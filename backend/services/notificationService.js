const cron = require('node-cron');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');
const Application = require('../models/Application');

// Helper to create notification if not already created
const createNotificationIfNew = async (userId, interviewId, title, message, type) => {
  const existing = await Notification.findOne({ userId, interviewId, type });
  if (!existing) {
    await Notification.create({ userId, interviewId, title, message, type });
    console.log(`🔔 Notification created: ${title}`);
  } else {
    console.log(`⏭️ Notification already exists: ${title}`);
  }
};

// Check interviews and create notifications
const checkInterviews = async () => {
  try {
    console.log('🔍 Checking interviews...');
    const now = new Date();

    // 1 day from now range (between 23-25 hours)
    const oneDayFrom = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const oneDayFromEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // 1 hour from now range (between 50-70 minutes)
    const oneHourFrom = new Date(now.getTime() + 50 * 60 * 1000);
    const oneHourFromEnd = new Date(now.getTime() + 70 * 60 * 1000);

    // Find ALL upcoming interviews
    const interviews = await Interview.find({ status: 'Upcoming' });
    console.log(`📋 Found ${interviews.length} upcoming interviews`);

    for (const interview of interviews) {
      const scheduledDate = new Date(interview.scheduledDate);

      // Get application to find userId
      const app = await Application.findById(interview.applicationId);
      if (!app) {
        console.log(`⚠️ No application found for interview ${interview._id}`);
        continue;
      }

      if (!app.userId) {
        console.log(`⚠️ No userId found for application ${app._id} - ${app.company}`);
        continue;
      }

      const uid = app.userId;
      console.log(`📌 Checking interview: ${app.company} at ${scheduledDate}`);

      // Tomorrow reminder
      if (scheduledDate >= oneDayFrom && scheduledDate <= oneDayFromEnd) {
        await createNotificationIfNew(
          uid,
          interview._id,
          '📅 Interview Tomorrow!',
          `You have a ${interview.interviewType} interview with ${app.company} tomorrow at ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Good luck! 💪`,
          'interview_tomorrow'
        );
      }

      // 1 hour reminder
      if (scheduledDate >= oneHourFrom && scheduledDate <= oneHourFromEnd) {
        await createNotificationIfNew(
          uid,
          interview._id,
          '⏰ Interview in 1 Hour!',
          `Your ${interview.interviewType} interview with ${app.company} starts in about 1 hour! Get ready! 🚀`,
          'interview_soon'
        );
      }
    }

    console.log('✅ Interview check complete!');
  } catch (err) {
    console.error('❌ Notification check error:', err);
  }
};

// Run every 5 minutes (changed from 30 for testing)
const startNotificationService = () => {
  console.log('🔔 Notification service started');
  
  cron.schedule('*/5 * * * *', () => {
    console.log('⏰ Running scheduled notification check...');
    checkInterviews();
  });

  // Run immediately on start
  checkInterviews();
};

module.exports = { startNotificationService, checkInterviews };