const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');

// GET all interviews
router.get('/', protect, async (req, res) => {
  try {
    const { status, applicationId } = req.query;

    // Get all applications belonging to this user
    const userApps = await Application.find({ userId: req.user._id }).select('_id');
    const userAppIds = userApps.map(a => a._id);

    let query = { applicationId: { $in: userAppIds } };
    if (status) query.status = status;
    if (applicationId) query.applicationId = applicationId;

    const interviews = await Interview.find(query)
      .populate('applicationId', 'company position status')
      .sort({ scheduledDate: 1 });
    res.json({ success: true, data: interviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET upcoming interviews (next 7 days)
router.get('/upcoming', protect, async (req, res) => {
  try {
    const now = new Date();
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Get all applications belonging to this user
    const userApps = await Application.find({ userId: req.user._id }).select('_id');
    const userAppIds = userApps.map(a => a._id);

    const interviews = await Interview.find({
      applicationId: { $in: userAppIds },
      scheduledDate: { $gte: now, $lte: next7Days },
      status: 'Upcoming'
    })
      .populate('applicationId', 'company position')
      .sort({ scheduledDate: 1 });

    res.json({ success: true, data: interviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single interview
router.get('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('applicationId');
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    res.json({ success: true, data: interview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create interview
router.post('/', protect, async (req, res) => {
  try {
    const interview = new Interview(req.body);
    await interview.save();
    res.status(201).json({ success: true, data: interview });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update interview
router.put('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    res.json({ success: true, data: interview });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE interview
router.delete('/:id', protect, async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Interview deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;