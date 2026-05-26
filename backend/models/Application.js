const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},
  company: { type: String, required: true },
  position: { type: String, required: true },
  status: {
    type: String,
    enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
    default: 'Applied'
  },
  appliedDate: { type: Date, default: Date.now },
  jobUrl: { type: String },
  jobDescription: { type: String },
  salary: { type: String },
  location: { type: String },
  notes: { type: String },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  contactName: { type: String },
  contactEmail: { type: String },
  resumeVersion: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);