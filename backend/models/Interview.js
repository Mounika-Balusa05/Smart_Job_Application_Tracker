const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  company: { type: String, required: true },
  position: { type: String, required: true },
  interviewType: {
    type: String,
    enum: ['Phone Screen', 'Technical', 'HR Round', 'Manager Round', 'Final Round', 'Group Interview', 'Other'],
    required: true
  },
  scheduledDate: { type: Date, required: true },
  duration: { type: Number, default: 60 },
  location: { type: String },
  interviewerName: { type: String },
  interviewerEmail: { type: String },
  notes: { type: String },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Upcoming'
  },
  feedback: { type: String },
  reminderSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);