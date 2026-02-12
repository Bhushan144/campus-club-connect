// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['Student', 'ClubPresident', 'FacultyHead', 'VC', 'HOD', 'RoomAllotter', 'Accounts', 'SuperAdmin'],
    default: 'Student'
  },
  department: { type: String },
  assignedClubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;