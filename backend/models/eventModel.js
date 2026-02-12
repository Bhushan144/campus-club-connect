// models/eventModel.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  posterImageUrl: { type: String, required: true },
  description: { type: String, required: true },
  eventDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  overallStatus: {
    type: String,
    required: true,
    enum: ['Pending_Faculty_Approval', 'Pending_VC_Approval', 'Pending_HOD_Approval', 'Approved_Pending_Resources', 'Active', 'Completed', 'Rejected'],
    default: 'Pending_Faculty_Approval'
  },
  approvalChain: {
    facultyHead: {
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date },
      comments: { type: String }
    },
    verticalCoordinator: {
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date },
      comments: { type: String }
    },
    hod: {
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date },
      comments: { type: String }
    }
  },
  resourceRequests: {
    venue: {
      isRequired: { type: Boolean, default: false },
      status: { type: String, enum: ['Pending', 'Allocated', 'Not_Required'], default: 'Not_Required' },
      allocatedRoom: { type: String }
    },
    budget: {
      isRequired: { type: Boolean, default: false },
      amount: { type: Number, default: 0 },
      status: { type: String, enum: ['Pending', 'Approved', 'Settled', 'Not_Required'], default: 'Not_Required' },
      expenseProofs: [{ url: String, uploadedAt: Date }]
    }
  },
  isNotified: { type: Boolean, default: false }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;