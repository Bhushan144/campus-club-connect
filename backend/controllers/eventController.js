import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';
import Club from '../models/clubModel.js';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

// --- HELPER: Check if event can go Active ---
const checkAndActivateEvent = async (eventId) => {
    const event = await Event.findById(eventId);
    if (!event) return;
    if (event.overallStatus !== 'Approved_Pending_Resources') return;

    const venueOk = !event.resourceRequests.venue.isRequired || event.resourceRequests.venue.status === 'Allocated';
    const budgetOk = !event.resourceRequests.budget.isRequired || event.resourceRequests.budget.status === 'Approved';

    if (venueOk && budgetOk) {
        event.overallStatus = 'Active';
        await event.save();
        console.log(`Event ${event.title} is now ACTIVE`);

        // Notify all Students
        const students = await User.find({ role: 'Student' });
        const notifications = students.map(student => ({
            recipient: student._id,
            message: `New Event Alert: "${event.title}" is now active! Check it out.`,
            relatedEventId: event._id
        }));
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    }
};

// --- HELPER: Auto-Expire Events ---
const performAutoExpiryChecks = async () => {
    // Check for active events where the date has passed
    await Event.updateMany(
        { 
            overallStatus: 'Active', 
            eventDate: { $lt: new Date() } 
        },
        { 
            $set: { overallStatus: 'Completed' } 
        }
    );
};

// @desc    Create a new event proposal
// @route   POST /api/events
export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, eventDate } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an event poster');
  }

  // Upload image to Cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'club_events' },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
    uploadStream.end(req.file.buffer);
  });

  const event = new Event({
    title,
    description,
    eventDate,
    posterImageUrl: uploadResult.secure_url,
    createdBy: req.user._id,
    clubId: req.user.assignedClubId,
  });

  if (req.body.venueRequired === 'true') {
    event.resourceRequests.venue.isRequired = true;
    event.resourceRequests.venue.status = 'Pending';
  }
  if (req.body.budgetRequired === 'true' && req.body.budgetAmount) {
    event.resourceRequests.budget.isRequired = true;
    event.resourceRequests.budget.status = 'Pending';
    event.resourceRequests.budget.amount = Number(req.body.budgetAmount);
  }

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// @desc    Get events based on user role
// @route   GET /api/events
export const getEvents = asyncHandler(async (req, res) => {
  // Run auto-expiry check before fetching
  await performAutoExpiryChecks();

  const user = req.user;
  let events = [];
  const populateQuery = { path: 'clubId', select: 'name' };
  const showHistory = req.query.history === 'true';

  switch (user.role) {
    case 'SuperAdmin':
      events = await Event.find({}).populate(populateQuery).sort({ eventDate: -1 });
      break;

    case 'ClubPresident':
      events = await Event.find({ clubId: user.assignedClubId }).populate(populateQuery).sort({ eventDate: -1 });
      break;

    case 'FacultyHead':
      events = await Event.find({
        clubId: user.assignedClubId,
        overallStatus: 'Pending_Faculty_Approval',
      }).populate(populateQuery);
      break;
    
    case 'VC':
      events = await Event.find({ overallStatus: 'Pending_VC_Approval' }).populate(populateQuery);
      break;

    case 'HOD':
      const clubsInDept = await Club.find({ department: user.department });
      const clubIds = clubsInDept.map(club => club._id);
      events = await Event.find({
        clubId: { $in: clubIds },
        overallStatus: 'Pending_HOD_Approval',
      }).populate(populateQuery);
      break;
      
    case 'RoomAllotter':
       events = await Event.find({ 
           overallStatus: 'Approved_Pending_Resources',
           'resourceRequests.venue.isRequired': true 
        }).populate(populateQuery);
       break;

    case 'Accounts':
        events = await Event.find({ 
            overallStatus: 'Approved_Pending_Resources',
            'resourceRequests.budget.isRequired': true
        }).populate(populateQuery);
        break;

    case 'Student':
       if (showHistory) {
         events = await Event.find({ overallStatus: 'Completed' }).populate(populateQuery).sort({ eventDate: -1 });
       } else {
         events = await Event.find({ overallStatus: 'Active' }).populate(populateQuery).sort({ eventDate: 1 });
       }
       break;

    default:
      events = [];
  }

  res.json(events);
});

// @desc    Get a single event by ID
// @route   GET /api/events/:id
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('clubId', 'name department');
  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
export const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'SuperAdmin') {
        res.status(401);
        throw new Error('Not authorized to delete this event');
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
});

// @desc    Approve an event proposal
// @route   PATCH /api/events/:id/approve
export const approveEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    const user = req.user;
    let statusUpdated = false;

    if (event.overallStatus === 'Pending_Faculty_Approval' && user.role === 'FacultyHead') {
        event.approvalChain.facultyHead.status = 'Approved';
        event.approvalChain.facultyHead.approvedBy = user._id;
        event.approvalChain.facultyHead.timestamp = Date.now();
        event.overallStatus = 'Pending_VC_Approval'; 
        statusUpdated = true;
    } else if (event.overallStatus === 'Pending_VC_Approval' && user.role === 'VC') {
        event.approvalChain.verticalCoordinator.status = 'Approved';
        event.approvalChain.verticalCoordinator.approvedBy = user._id;
        event.approvalChain.verticalCoordinator.timestamp = Date.now();
        event.overallStatus = 'Pending_HOD_Approval'; 
        statusUpdated = true;
    } else if (event.overallStatus === 'Pending_HOD_Approval' && user.role === 'HOD') {
        event.approvalChain.hod.status = 'Approved';
        event.approvalChain.hod.approvedBy = user._id;
        event.approvalChain.hod.timestamp = Date.now();
        event.overallStatus = 'Approved_Pending_Resources'; 
        statusUpdated = true;
    }

    if (statusUpdated) {
        const updatedEvent = await event.save();

        // Notify President
        let roleName = user.role; 
        if(roleName === 'FacultyHead') roleName = 'Faculty Head';
        if(roleName === 'VC') roleName = 'Vertical Coordinator';
        
        await Notification.create({
            recipient: event.createdBy,
            message: `Your event "${event.title}" has been approved by ${roleName} (${user.name}).`,
            relatedEventId: event._id
        });

        res.json(updatedEvent);
    } else {
        res.status(403); 
        throw new Error('Not authorized to approve this event at its current stage');
    }
});

// @desc    Reject an event proposal
// @route   PATCH /api/events/:id/reject
export const rejectEvent = asyncHandler(async (req, res) => {
    const { comments } = req.body;
    if (!comments) {
        res.status(400);
        throw new Error('Rejection comments are required');
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    const user = req.user;
    let rejectionLogged = false;

    if (event.overallStatus === 'Pending_Faculty_Approval' && user.role === 'FacultyHead') {
        event.approvalChain.facultyHead.status = 'Rejected';
        event.approvalChain.facultyHead.comments = comments;
        rejectionLogged = true;
    } else if (event.overallStatus === 'Pending_VC_Approval' && user.role === 'VC') {
        event.approvalChain.verticalCoordinator.status = 'Rejected';
        event.approvalChain.verticalCoordinator.comments = comments;
        rejectionLogged = true;
    } else if (event.overallStatus === 'Pending_HOD_Approval' && user.role === 'HOD') {
        event.approvalChain.hod.status = 'Rejected';
        event.approvalChain.hod.comments = comments;
        rejectionLogged = true;
    }

    if(rejectionLogged) {
        event.overallStatus = 'Rejected';
        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } else {
        res.status(403);
        throw new Error('Not authorized to reject this event at its current stage');
    }
});

// @desc    Allocate a venue for an event
// @route   PATCH /api/events/:id/allocate-venue
export const allocateVenue = asyncHandler(async (req, res) => {
    const { room } = req.body;
    if (!room) { res.status(400); throw new Error('Room name is required'); }
    
    const event = await Event.findById(req.params.id);

    if (event && event.resourceRequests.venue.isRequired) {
        event.resourceRequests.venue.status = 'Allocated';
        event.resourceRequests.venue.allocatedRoom = room;
        await event.save();

        await checkAndActivateEvent(req.params.id);

        // Notify President
        await Notification.create({
            recipient: event.createdBy,
            message: `Venue Allocated: Room "${room}" assigned to "${event.title}" by Venue Manager (${req.user.name}).`,
            relatedEventId: event._id
        });

        const finalEventState = await Event.findById(req.params.id);
        res.json(finalEventState);
    } else {
        res.status(404);
        throw new Error('Event not found or does not require a venue');
    }
});

// @desc    Approve the budget for an event
// @route   PATCH /api/events/:id/approve-budget
export const approveBudget = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event && event.resourceRequests.budget.isRequired) {
        event.resourceRequests.budget.status = 'Approved';
        await event.save();

        await checkAndActivateEvent(req.params.id);

        // Notify President
        await Notification.create({
            recipient: event.createdBy,
            message: `Budget Approved: The budget request for "${event.title}" has been approved by the Accountant (${req.user.name}).`,
            relatedEventId: event._id
        });

        const finalEventState = await Event.findById(req.params.id);
        res.json(finalEventState);
    } else {
        res.status(404);
        throw new Error('Event not found or does not require a budget');
    }
});