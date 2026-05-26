const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['interview_tomorrow', 'interview_soon', 'status_update', 'general'],
    default: 'general'
  },
  read: { type: Boolean, default: false },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);