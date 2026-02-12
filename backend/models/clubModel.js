// models/clubModel.js
import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  presidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facultyHeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Club = mongoose.model('Club', clubSchema);
export default Club;