


# 🎯 Smart Job Application Tracker

>🌐 **Live App** 👉 [Click Here](https://jobtrackr-landing.vercel.app)


---

## 💡 Why I Built This Project

When I started applying for jobs and internships, I realized I was losing track of where I applied, which companies replied, and when my interviews were scheduled. I was using notes and Excel sheets which was messy and confusing.

So I decided to build a proper full-stack web app to solve this real problem — not just for me, but for every student and job seeker who faces the same struggle!

---

## ✨ Features

1. 📋 **Track Job Applications** — Add companies, roles, status, priority, location and recruiter details all in one place
2. 🔍 **Search & Filter** — Search applications by company or role, filter by status and priority instantly
3. 📅 **Interview Scheduler** — Schedule interviews linked to your applications with date, time, type and meeting link
4. 🔔 **Smart Notifications** — Get automatic in-app alerts 1 day and 1 hour before every interview so you never miss one
5. 📊 **Dashboard** — See your full job search at a glance — total applications, interviews, offers and upcoming schedule
6. 🔐 **Secure Authentication** — Register and login safely with JWT tokens and bcrypt password hashing
7. 🌙 **Dark Mode UI** — Clean, modern dark-themed interface built for comfortable long-term use

---

## 🙋 How It Helps Users

- **Students** applying to multiple companies can track every application in one place instead of messy spreadsheets
- **Never miss an interview** — automatic reminders make sure you're always prepared
- **Stay organized** — filter applications by status, priority and company anytime
- **Save time** — everything from applying to getting hired is managed in one app
- **Feel confident** — knowing exactly where you stand in every application process

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Axios, date-fns, React Hot Toast |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, node-cron, CORS, dotenv |
| **Database** | MongoDB, Mongoose |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |
| **Fonts** | Outfit — Google Fonts |

---

## 📁 Project Structure

```
smartapptracker/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT protect middleware
│   ├── models/
│   │   ├── Application.js       # Job application schema
│   │   ├── Interview.js         # Interview schema
│   │   ├── Notification.js      # Notification schema
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── applications.js      # Application CRUD APIs
│   │   ├── auth.js              # Register & Login APIs
│   │   ├── interviews.js        # Interview CRUD APIs
│   │   └── notifications.js     # Notification APIs
│   ├── services/
│   │   └── notificationService.js  # Auto notification cron job
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Express server entry point
│
└── frontend/
    ├── public/
    │   ├── screenshots/         # App screenshots
    │   ├── favicon.ico
    │   └── index.html
    └── src/
        ├── components/
        │   └── NotificationBell.js  # Bell with dropdown
        ├── context/
        │   └── AuthContext.js       # Auth state management
        ├── pages/
        │   ├── Applications.js      # Applications page
        │   ├── Dashboard.js         # Dashboard page
        │   ├── Interviews.js        # Interviews page
        │   ├── Login.js             # Login page
        │   └── Register.js          # Register page
        ├── utils/
        │   └── api.js               # Axios API calls
        ├── App.js                   # Main app with routing
        └── App.css                  # Global styles
```

---

## 🔗 Links

| | Link |
|---|---|
| 🏠 **Live App** | [jobtrackr-landing.vercel.app](https://jobtrackr-landing.vercel.app) |
| ⚛️ **Frontend App** | [smart-job-application-tracker-wheat.vercel.app](https://smart-job-application-tracker-wheat.vercel.app) |
| ⚙️ **Backend App** | [smart-job-application-tracker-2yo6.onrender.com](https://smart-job-application-tracker-2yo6.onrender.com) |
| 💻 **GitHub Repo** | [github.com/Mounika-Balusa05/Smart_Job_Application_Tracker](https://github.com/Mounika-Balusa05/Smart_Job_Application_Tracker) |

---

## 👩‍💻 Author

**Mounika Balusa**
Full Stack Developer
📍 Hyderabad, Telangana, India

> Built with ❤️ as a portfolio project for internship and job applications | © 2026
