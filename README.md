# TeachNexus - Intelligent Teacher Collaboration & Resource Sharing Platform

**TeachNexus** is a comprehensive MERN stack full-stack web application that revolutionizes teacher collaboration by combining resource sharing, community learning, gamification, AI-powered tools, and advanced administrative features.

---

## 🎯 Overview

TeachNexus solves critical challenges in education:

- **Teacher Isolation**: Connect teachers through vibrant communities and direct messaging
- **Resource Fragmentation**: Centralized, searchable, peer-reviewed resource library
- **Professional Development**: Track CPD points, unlock achievements, and advance through levels
- **Student Performance**: AI-powered predictive analytics identifying at-risk students early
- **Curriculum Alignment**: Map curriculum standards to resources and track coverage

## ✨ Unique Features (39 Total)

### Core Features

1. **Comprehensive Resource Library** - Search, filter, download, remix, and rate teaching materials
2. **Community Spaces** - Subject-specific communities with discussion threads
3. **Lesson Planning** - AI-assisted lesson creation with collaborative editing
4. **Direct Messaging** - Real-time teacher-to-teacher communication
5. **User Profiles** - Public teacher profiles showcasing resources and achievements

### Gamification System

6. **Experience Points (XP)** - Earn XP for uploads, downloads, remixes, community participation
7. **Level Progression** - Advance through 10+ levels from Novice to Master
8. **Achievement Badges** - Unlock 20+ unique badges through various activities
9. **Monthly Leaderboard** - Compete globally, local school rankings
10. **Teaching Challenges** - Weekly/monthly challenges with XP and badge rewards
11. **CPD Point Tracking** - Official Continuing Professional Development tracking

### AI-Powered Tools

12. **AI Lesson Planner** - Generate complete lesson plans in seconds
13. **Resource Summarizer** - Extract key points from teaching materials
14. **Voice-to-Lesson** - Convert audio notes into structured lesson plans
15. **Whiteboard Scanner** - OCR digitalization of whiteboard content
16. **Student Performance Predictor** - Identify at-risk students using ML analytics
17. **Resource Gap Analyzer** - Discover gaps in curriculum coverage
18. **TeachBot AI Assistant** - Context-aware chatbot for teaching insights
19. **Smart Recommender** - Personalized resource recommendations based on profile

### Resource Management

20. **Resource Remixing** - Modify and rebrand existing resources
21. **Remix History** - Track lineage of remixed resources
22. **Peer Review System** - Community review and validation
23. **Quality Ratings** - 5-star rating system with detailed feedback
24. **File Upload** - Cloudinary integration for documents, images, videos
25. **Version Control** - Track resource updates and modifications

### Community & Collaboration

26. **Discussion Threads** - Threaded conversations with categories (question, resource_share, poll)
27. **Pinned Posts** - Highlight important discussions
28. **Solved Badges** - Mark questions as answered
29. **Mentorship Program** - Pair experienced teachers with newcomers
30. **Mentor Matching** - Algorithm-based matching by subject and experience

### Administrative Dashboard

31. **School Health Reports** - Dashboard metrics for school administrators
32. **Smart Timetable Builder** - AI-optimized class scheduling
33. **Classroom Polling** - Real-time classroom engagement tools
34. **Curriculum Mapping** - Map standards to resources and lesson plans
35. **Teacher Management** - Bulk operations and performance tracking
36. **Parent Communication** - Templates and scheduling for parent outreach

### Advanced Features

37. **Real-time Notifications** - Socket.io powered instant updates
38. **Subscription Tiers** - Free/Basic/Premium with feature differentiation
39. **School Verification** - Official school account verification system

---

## 🏗️ Technology Stack

### Backend

- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt (10-round hashing)
- **Real-time**: Socket.io for messaging and notifications
- **File Storage**: Cloudinary CDN
- **Email**: Nodemailer + SendGrid integration
- **Payments**: Stripe API integration
- **Security**: Helmet.js, CORS, Rate limiting
- **Job Queue**: Bull + Redis (optional)
- **Collaboration**: Yjs for real-time document editing

### Frontend

- **Library**: React 18 with React Router DOM v6
- **State Management**: Zustand (lightweight centralized store)
- **HTTP Client**: Axios with custom interceptors
- **Real-time**: Socket.io client
- **UI Framework**: Tailwind CSS + custom CSS variables
- **Animation**: Framer Motion
- **Charts**: Recharts for data visualization
- **Rich Editing**: React Quill for text editing
- **Forms**: React Hook Form (optional)
- **Notifications**: React Hot Toast

### DevOps & Deployment

- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render, Railway, or Heroku
- **Database**: MongoDB Atlas (cloud)
- **CDN**: Cloudinary for media assets
- **VCS**: Git + GitHub

---

## 🚀 Quick Start

### Prerequisites

- Node.js (16+)
- MongoDB Atlas account
- Cloudinary account
- Stripe test keys
- SendGrid or Gmail account (for emails)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

**Environment Variables (.env)**:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/teachnexus
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

SENDGRID_API_KEY=SG._...
SENDGRID_EMAIL=noreply@teachnexus.com

REDIS_URL=redis://localhost:6379

APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local
echo "REACT_APP_API_BASE_URL=http://localhost:5000" > .env.local
npm start
```

**Build for Production**:

```bash
npm run build
# Built files in /build directory for Vercel deployment
```

---

## 📊 Database Schema

### Core Models (16 total)

| Model               | Purpose              | Key Fields                                                 |
| ------------------- | -------------------- | ---------------------------------------------------------- |
| User                | Teacher profiles     | profile, specializations, subscription, gamification stats |
| Resource            | Teaching materials   | file, metadata, ratings, remix history                     |
| LessonPlan          | Structured lessons   | components, collaborators, schedule, Yjs doc               |
| Community           | Subject spaces       | members, discussions, activity tracking                    |
| DiscussionThread    | Conversations        | replies, category, solved status                           |
| Gamification        | XP & achievements    | level, badges array, CPD points                            |
| Mentorship          | Pairing system       | mentor-mentee relationship, progress tracking              |
| Achievement         | Badge definitions    | rarity, requirement, XP reward                             |
| TeachingChallenge   | Monthly tasks        | participants, leaderboard                                  |
| StudentPerformance  | Predictive analytics | assessments, at-risk analysis                              |
| ResourceGapAnalysis | Curriculum mapping   | coverage %, gaps, recommendations                          |
| Notification        | Real-time updates    | type, ref, status                                          |
| DirectMessage       | Conversations        | sender, recipient, read status                             |
| Subscription        | Billing              | Stripe integration, tier, features                         |
| School              | Institution profiles | verification, engagement metrics                           |
| CurriculumMapping   | Standard alignment   | week-by-week mapping, statistics                           |

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Confirm password reset

### Resources

- `GET /api/resources` - List with pagination, search, filter
- `POST /api/resources` - Create new resource
- `GET /api/resources/:id` - View resource details
- `POST /api/resources/:id/download` - Track download
- `POST /api/resources/:resourceId/remix` - Create remix

### Lesson Plans

- `GET /api/lesson-plans` - List user's plans
- `POST /api/lesson-plans` - Create new plan
- `POST /api/lesson-plans/:id/publish` - Publish plan

### Community

- `GET /api/community` - List communities
- `POST /api/community` - Create community
- `GET /api/community/:id/discussions` - Thread list
- `POST /api/community/:communityId/discussions` - Create thread
- `POST /api/community/:id/join` - Join community

### Gamification

- `GET /api/gamification/stats` - User stats
- `GET /api/gamification/leaderboard` - Top 100 teachers
- `GET /api/gamification/challenges` - Active challenges

### AI Tools

- `POST /api/ai-tools/lesson-generator` - Generate lesson
- `POST /api/ai-tools/summarize` - Summarize resource
- `POST /api/ai-tools/student-predictor` - Predict performance

### Admin

- `GET /api/admin/school-health` - School metrics
- `POST /api/admin/timetable` - Generate schedule
- `POST /api/admin/mentor-match` - Match mentors

---

## 🔐 Authentication Flow

1. **Registration**: Email + password → bcrypt hash → JWT token stored in localStorage
2. **Login**: Email + password → verify hash → JWT token → Redirect to dashboard
3. **Protected Routes**: Check token in localStorage → Validate with backend → Allow access
4. **Token Refresh**: Interceptor auto-injects bearer token in all subsequent requests
5. **Logout**: Clear localStorage token → Redirect to login

---

## 🗣️ Real-time Features (Socket.io)

**Events**:

- `user_online` - User status tracking
- `new_notification` - Real-time alerts
- `send_message` - Direct messaging
- `lesson_update` - Collaborative editing changes
- `typing_indicator` - "Person is typing..." UI

---

## 📈 Gamification Mechanics

### XP System

- Upload resource: +10 XP
- Resource download: +5 XP to creator
- Remix creation: +15 XP (remixer) + 10 XP (creator)
- Publish lesson: +50 XP
- Create community: +30 XP
- Join community: +10 XP
- Discussion reply: +5 XP + reputation

### Levels

- Novice (0 XP) → Master (100,000+ XP)
- 10 total levels with escalating XP requirements
- Level badge displayed on profile

### Achievements (20+ badges)

- First Upload, Lesson Master, Community Leader, Mentor, Top Remixer
- Rare badges like "School Champion" (top contributor at school)
- Legendary badges like "Innovator" (50+ unique remixes)

---

## 🎓 Deployment Guide

### Vercel (Frontend)

1. Push `frontend/` to GitHub repo
2. Import project in Vercel dashboard
3. Set environment variables:
   - `REACT_APP_API_BASE_URL` = production backend URL
4. Deploy (automatic on git push)

### Render (Backend)

1. Create new Web Service
2. Connect GitHub repository
3. Set environment variables in Render dashboard
4. Add MongoDB connection string
5. Deploy

### MongoDB Atlas (Database)

1. Create cluster (M0 free tier available)
2. Create database user with strong password
3. Whitelist IP addresses (or 0.0.0.0 for development)
4. Copy connection string to `MONGODB_URI`
5. Run migrations/seed scripts

---

## 📚 Development Workflow

```bash
# Start backend dev server (auto-restart on changes)
cd backend && npm run dev

# Start frontend dev server (port 3000)
cd frontend && npm start

# Backend runs on localhost:5000
# Frontend runs on localhost:3000
# API calls auto-proxy to backend via Vite/CRA config
```

### Code Organization

Frontend:

```
src/
├── pages/          # Page components
├── components/     # Reusable components
├── styles/         # CSS files
├── utils/          # API client, helpers
├── context/        # Zustand stores
└── App.js          # Main routing
```

Backend:

```
src/
├── config/         # Database, environment
├── models/         # Mongoose schemas
├── controllers/    # Business logic
├── routes/         # API endpoints
├── middleware/     # Auth, errors, logging
├── utils/          # Cloudinary, email, tokens
└── server.js       # Express app
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration with email verification
- [ ] Login with JWT token persistence
- [ ] Resource upload and search
- [ ] Resource remix with history chain
- [ ] Community creation and joining
- [ ] Discussion thread creation
- [ ] Real-time messaging via Socket.io
- [ ] Gamification XP updates
- [ ] Admin panel functions
- [ ] Payment/subscription flow

### Integration Testing (Optional)

```bash
# Backend tests with Jest + Supertest
cd backend && npm test

# Frontend tests with React Testing Library
cd frontend && npm test
```

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**

- Check `MONGODB_URI` in .env
- Verify IP whitelist in MongoDB Atlas
- Test connection string in MongoDB Compass

**"JWT token invalid"**

- Clear localStorage and re-login
- Check `JWT_SECRET` matches frontend/backend

**"Cloudinary upload fails"**

- Verify API credentials
- Check folder permissions in Cloudinary dashboard

### Frontend Issues

**"API requests timeout"**

- Ensure backend running on port 5000
- Check `REACT_APP_API_BASE_URL` environment variable
- Verify CORS enabled in backend

**"Styling not loading"**

- Ensure CSS files imported in page components
- Check `../styles/filename.css` paths are correct
- Clear browser cache (Ctrl+Shift+Delete)

---

## 📝 Environment Variables Checklist

### Backend (.env)

- [ ] `NODE_ENV` = development/production
- [ ] `PORT` = 5000 or custom
- [ ] `MONGODB_URI` = MongoDB Atlas connection
- [ ] `JWT_SECRET` = Random 32+ character string
- [ ] `CLOUDINARY_*` = From Cloudinary dashboard
- [ ] `STRIPE_*` = From Stripe dashboard
- [ ] `SENDGRID_API_KEY` = From SendGrid dashboard
- [ ] `REDIS_URL` = (Optional) Redis server

### Frontend (.env.local)

- [ ] `REACT_APP_API_BASE_URL` = Backend URL

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing-feature'`
3. Push branch: `git push origin feature/amazing-feature`
4. Open Pull Request

---

## 📄 License

MIT License - See LICENSE.md for details

---

## 🆘 Support

- **Email**: support@teachnexus.com
- **Documentation**: [Link to docs]
- **Github Issues**: Create an issue on the repository

---

## 🎉 Acknowledgments

Built with passion for teachers by education enthusiasts. Special thanks to the open-source community for incredible libraries like React, Mongoose, Express, and Socket.io.

---

**TeachNexus** - _Empowering Teachers, Transforming Education_ 🍎
#   T e a c h N e x u s   M E R N   S t a c k   -   T e a c h e r   C o l l a b o r a t i o n   P l a t f o r m  
 