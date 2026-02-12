// controllers/analyticsController.js
import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';
import Club from '../models/clubModel.js';

// @desc    Get HOD analytics data
// @route   GET /api/analytics/hod
// @access  Private/HOD
export const getHodAnalytics = asyncHandler(async (req, res) => {
  const department = req.user.department;

  // 1. Get all clubs within the HOD's department
  const clubsInDept = await Club.find({ department });
  const clubIds = clubsInDept.map(club => club._id);

  // 2. KPI: Total events and pending events for the department
  const kpiStats = await Event.aggregate([
    { $match: { clubId: { $in: clubIds } } },
    {
      $group: {
        _id: null,
        totalEvents: { $sum: 1 },
        pendingEvents: {
          $sum: { $cond: [{ $eq: ['$overallStatus', 'Pending_HOD_Approval'] }, 1, 0] }
        }
      }
    }
  ]);
  
  // 3. Bar Chart: Events per club
  const eventsPerClub = await Event.aggregate([
    { $match: { clubId: { $in: clubIds } } },
    { $group: { _id: '$clubId', count: { $sum: 1 } } },
    { $lookup: { from: 'clubs', localField: '_id', foreignField: '_id', as: 'club' } },
    { $unwind: '$club' },
    { $project: { _id: 0, clubName: '$club.name', count: 1 } }
  ]);
  
  // 4. Pie Chart: Status distribution
  const statusDistribution = await Event.aggregate([
    { $match: { clubId: { $in: clubIds } } },
    { $group: { _id: '$overallStatus', count: { $sum: 1 } } },
    { $project: { _id: 0, status: '$_id', count: 1 } }
  ]);

  res.json({
    kpi: {
      totalEvents: kpiStats[0]?.totalEvents || 0,
      totalClubs: clubIds.length,
      pendingEvents: kpiStats[0]?.pendingEvents || 0,
    },
    eventsPerClub,
    statusDistribution,
  });
});