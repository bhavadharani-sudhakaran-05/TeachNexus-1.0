# TeachNexus Project Structure

Complete directory layout of the TeachNexus MERN stack application.

```
TeachNexus-1.0/
│
├── README.md                           # Main project documentation
├── SETUP.md                            # Setup and deployment guide
├── DEVELOPMENT.md                      # Development guidelines
│
├── backend/                            # Node.js Express API Server
│   ├── src/
│   │   ├── server.js                   # Express app initialization
│   │   ├── config/
│   │   │   └── database.js             # MongoDB Mongoose connection
│   │   ├── models/                     # MongoDB Schemas (16 total)
│   │   │   ├── User.js                 # Teacher profiles & auth
│   │   │   ├── Resource.js             # Teaching materials
│   │   │   ├── LessonPlan.js           # Structured lessons
│   │   │   ├── Community.js            # Subject communities
│   │   │   ├── DiscussionThread.js     # Thread conversations
│   │   │   ├── Gamification.js         # XP & achievements
│   │   │   ├── Notification.js         # Real-time alerts
│   │   │   ├── DirectMessage.js        # DM conversations
│   │   │   ├── Mentorship.js           # Mentor relationships
│   │   │   ├── Achievement.js          # Badge definitions
│   │   │   ├── TeachingChallenge.js    # Monthly challenges
│   │   │   ├── StudentPerformance.js   # Predictive analytics
│   │   │   ├── ResourceGapAnalysis.js  # Curriculum gaps
│   │   │   ├── Subscription.js         # Payment & billing
│   │   │   ├── School.js               # Institution profiles
│   │   │   └── CurriculumMapping.js    # Standard alignment
│   │   ├── middleware/                 # Express middleware
│   │   │   ├── auth.js                 # JWT protection & authorization
│   │   │   ├── errorHandler.js         # Global error handling
│   │   │   ├── rateLimiter.js          # API rate limiting
│   │   │   └── requestLogger.js        # Request logging
│   │   ├── controllers/                # Business logic (9 files)
│   │   │   ├── authController.js       # Register, login, password reset
│   │   │   ├── userController.js       # Profile & dashboard
│   │   │   ├── resourceController.js   # CRUD + remix operations
│   │   │   ├── lessonPlanController.js # Lesson CRUD & publishing
│   │   │   ├── communityController.js  # Communities & discussions
│   │   │   ├── gamificationController.js  # XP, badges, leaderboard
│   │   │   ├── aiToolsController.js    # 8 AI feature endpoints
│   │   │   ├── adminController.js      # Admin dashboard functions
│   │   │   ├── messageController.js    # Direct messaging
│   │   │   └── notificationController.js # Notification management
│   │   ├── routes/                     # API route definitions (11 files)
│   │   │   ├── authRoutes.js           # /api/auth/* endpoints
│   │   │   ├── userRoutes.js           # /api/users/* endpoints
│   │   │   ├── resourceRoutes.js       # /api/resources/* endpoints
│   │   │   ├── lessonPlanRoutes.js     # /api/lesson-plans/* endpoints
│   │   │   ├── communityRoutes.js      # /api/community/* endpoints
│   │   │   ├── gamificationRoutes.js   # /api/gamification/* endpoints
│   │   │   ├── aiToolsRoutes.js        # /api/ai-tools/* endpoints
│   │   │   ├── adminRoutes.js          # /api/admin/* endpoints
│   │   │   ├── messageRoutes.js        # /api/messages/* endpoints
│   │   │   ├── notificationRoutes.js   # /api/notifications/* endpoints
│   │   │   └── paymentRoutes.js        # /api/payments/* endpoints
│   │   ├── utils/                      # Utility functions
│   │   │   ├── tokenUtils.js           # JWT operationsgenerate & verify
│   │   │   ├── cloudinaryUtils.js      # Image upload/delete
│   │   │   ├── socketHandler.js        # Socket.io event management
│   │   │   ├── emailUtils.js           # Email sending
│   │   │   └── stripeUtils.js          # Stripe payment processing
│   ├── scripts/
│   │   └── seed.js                     # Database seed script with 4 teachers
│   ├── logs/                           # Application logs directory
│   ├── .env.example                    # Environment variables template
│   ├── package.json                    # Node dependencies & scripts
│   ├── .gitignore                      # Git ignore rules
│   └── README.md                       # Backend-specific documentation
│
├── frontend/                           # React Client Application
│   ├── public/
│   │   ├── index.html                  # HTML entry point
│   │   └── favicon.ico                 # App icon
│   ├── src/
│   │   ├── index.js                    # React DOM root
│   │   ├── index.css                   # Global styles + CSS variables
│   │   ├── App.js                      # Main routing & Socket.io setup
│   │   ├── pages/                      # Page components (11 files)
│   │   │   ├── LandingPage.js          # Public landing page
│   │   │   ├── LoginPage.js            # Teacher login
│   │   │   ├── RegisterPage.js         # Account registration
│   │   │   ├── Dashboard.js            # Teacher dashboard home
│   │   │   ├── ResourceLibrary.js      # Resource search & browse
│   │   │   ├── LessonPlannerPage.js    # Lesson creation + AI
│   │   │   ├── CommunityPage.js        # Communities & discussions
│   │   │   ├── AIToolsPage.js          # 8 AI tools interface
│   │   │   ├── GamificationPage.js     # Stats, badges, leaderboard
│   │   │   ├── AdminPanel.js           # Admin dashboard
│   │   │   └── UserProfile.js          # Teacher public profile
│   │   ├── components/                 # Reusable components (3 files)
│   │   │   ├── Navigation.js           # Header navbar
│   │   │   ├── NotificationCenter.js   # Real-time notifications
│   │   │   └── ProtectedRoute.js       # Auth route wrapper
│   │   ├── styles/                     # CSS files (13 files)
│   │   │   ├── index.css               # Global styles (created in index.js)
│   │   │   ├── navigation.css          # Navbar styling
│   │   │   ├── notifications.css       # Notification styling
│   │   │   ├── landing.css             # Landing page styles
│   │   │   ├── auth.css                # Login/register styles
│   │   │   ├── dashboard.css           # Dashboard component styles
│   │   │   ├── resources.css           # Resource library styles
│   │   │   ├── lesson-planner.css      # Lesson planner styles
│   │   │   ├── community.css           # Community page styles
│   │   │   ├── ai-tools.css            # AI tools modal styles
│   │   │   ├── gamification.css        # Gamification page styles
│   │   │   ├── admin.css               # Admin panel styles
│   │   │   └── profile.css             # User profile styles
│   │   ├── utils/
│   │   │   └── api.js                  # Axios client + endpoint definitions
│   │   └── context/
│   │       └── store.js                # Zustand state management stores
│   ├── .env.example                    # Frontend env template
│   ├── .env.local                      # Local dev environment (gitignored)
│   ├── .gitignore                      # Git ignore rules
│   ├── package.json                    # Node dependencies & scripts
│   ├── package-lock.json               # Dependency lock file
│   ├── README.md                       # Frontend-specific documentation
│   └── public/                         # Static assets
│       └── .keep
│
├── .gitignore                          # Root git ignore
├── LICENSE                             # MIT License
└── CONTRIBUTING.md                     # Contribution guidelines (optional)
```

## Key Directories Explained

### Backend Models (src/models/)

Each model corresponds to a feature:

- **User.js**: Teacher accounts, profiles, subscription, gamification stats, authentication data
- **Resource.js**: Teaching materials with metadata, ratings, remix tracking
- **LessonPlan.js**: Structured lessons with components, collaborative editing support
- **Community.js**: Subject-based communities with member management
- **DiscussionThread.js**: Threaded conversations within communities
- **Gamification.js**: User XP, levels, achievements, leaderboard position
- **Achievement.js**: Badge definitions and unlock requirements
- **Mentorship.js**: Mentor-mentee pairings with progress tracking
- **TeachingChallenge.js**: Monthly/weekly challenges with participants
- **StudentPerformance.js**: Predictive analytics for at-risk students
- **ResourceGapAnalysis.js**: Curriculum coverage analysis and gap identification
- **Notification.js**: Real-time alerts with type differentiation
- **DirectMessage.js**: Private conversation messages
- **Subscription.js**: Billing and tier management (Stripe integration)
- **School.js**: Institution profiles and engagement metrics
- **CurriculumMapping.js**: Map curriculum standards to resources

### Backend Controllers (src/controllers/)

Each controller handles business logic for specific features:

- **authController.js** (4 endpoints):
  - POST /register - User registration with validation
  - POST /login - Email/password authentication
  - POST /forgot-password - Password reset request
  - POST /reset-password - Complete password reset

- **userController.js** (4 endpoints):
  - GET /profile - Retrieve authenticated user profile
  - PUT /profile - Update user information
  - GET /dashboard - Dashboard stats & recommendations
  - GET /:userId - Public teacher profile

- **resourceController.js** (6 endpoints):
  - POST / - Create new resource with file upload
  - GET / - List with search, filter, pagination
  - GET /:id - Resource details
  - POST /:id/download - Track download + award XP
  - POST /:resourceId/remix - Create remix version
  - DELETE /:id - Remove resource

- **lessonPlanController.js** (6 endpoints):
  - POST / - Create lesson plan
  - GET / - List user's lesson plans
  - GET /:id - View lesson plan details
  - PUT /:id - Update lesson plan
  - POST /:id/publish - Publish lesson plan
  - DELETE /:id - Delete lesson plan

- **communityController.js** (6 endpoints):
  - POST / - Create new community
  - GET / - List communities
  - GET /:id - Community details with threads
  - POST /:id/join - Join community
  - POST /:communityId/discussions - Create discussion thread
  - GET /:communityId/discussions - List discussions

- **gamificationController.js** (6 endpoints):
  - GET /stats - User gamification stats
  - GET /achievements - List all achievements
  - GET /leaderboard - Top 100 teachers
  - GET /challenges - Active teaching challenges
  - POST /challenges/:id/join - Join challenge
  - POST /challenges/:id/complete - Mark challenge complete

- **aiToolsController.js** (8 endpoints):
  - POST /lesson-generator - AI lesson plan generation
  - POST /summarize - Summarize resource content
  - POST /voice-to-lesson - Voice note to lesson
  - POST /whiteboard-scanner - OCR whiteboard content
  - POST /student-predictor - Predictive analytics
  - POST /gap-analyzer - Curriculum gap analysis
  - POST /teachbot - AI chatbot query
  - POST /recommend - Personalized resource recommendations

- **adminController.js** (5 endpoints):
  - GET /school-health - School metrics report
  - POST /timetable - Generate intelligent schedule
  - POST /polling - Create classroom poll
  - POST /curriculum-mapping - Create curriculum map
  - POST /mentor-match - Match mentor/mentee pairs

- **messageController.js** (3 endpoints):
  - POST /send - Send direct message
  - GET /conversation/:recipientId - Get conversation
  - GET / - List all conversations

- **notificationController.js** (3 endpoints):
  - GET / - List notifications (paginated)
  - PUT /mark-read - Mark notifications as read
  - DELETE /:id - Delete notification

### Frontend Pages (src/pages/)

Each page corresponds to a major user workflow:

- **LandingPage.js**: Public homepage with hero, stats, features, CTA
- **LoginPage.js**: Email/password authentication form
- **RegisterPage.js**: New account creation with validation
- **Dashboard.js**: Teacher home with stats, recommendations, quick actions
- **ResourceLibrary.js**: Search, filter, browse teaching resources
- **LessonPlannerPage.js**: Create lessons with AI assistance
- **CommunityPage.js**: Browse communities and discussions
- **AIToolsPage.js**: Access 8 AI-powered features
- **GamificationPage.js**: View XP, badges, leaderboard, challenges
- **AdminPanel.js**: Administrator dashboard with 6 features
- **UserProfile.js**: Public teacher profile with resources and achievements

### Frontend Components (src/components/)

Reusable components used across pages:

- **Navigation.js**: Responsive navbar with auth menu
- **NotificationCenter.js**: Real-time notification display (Socket.io)
- **ProtectedRoute.js**: Route guard for authenticated pages

### Frontend Styles (src/styles/)

CSS files organized by page/feature:

- **index.css**: Global styles, CSS variables, typography
- **navigation.css**: Navbar responsive design
- **notifications.css**: Toast/alert styling with animations
- **landing.css**: Hero, features, testimonials section styling
- **auth.css**: Login/register form styling and validation
- **dashboard.css**: Stats cards, recommendations layout
- **resources.css**: Grid/list view, search bar, filter controls
- **lesson-planner.css**: Form, preview, AI content display
- **community.css**: Sidebar, main content, discussion threads
- **ai-tools.css**: Tool cards, modal interface, forms
- **gamification.css**: Tabs, leaderboard table, badges grid
- **admin.css**: Feature cards, reports, modals
- **profile.css**: Cover photo, avatar, stats, tabs, content sections

## Environment & Configuration

### Backend Configuration (backend/.env)

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/teachnexus
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG_...
REDIS_URL=redis://localhost:6379
APP_FRONTEND_URL=http://localhost:3000
APP_BACKEND_URL=http://localhost:5000
```

### Frontend Configuration (frontend/.env.local)

```
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0
```

## Database Design

### Relationships

```
User
├── has many Resources
├── has many LessonPlans
├── has many Communities (as creator/member)
├── has many DiscussionThreads (as author)
├── has many DirectMessages (as sender/recipient)
├── has one Gamification
├── has many Mentions (as recipient/sender)
├── has many Mentorships (as mentor/mentee)
└── has many Subscriptions

Community
├── has many DiscussionThreads
├── has many Members (Users)
└── has many Resources (linked)

Resource
├── has many Reviews (from Users)
├── has many Downloads (tracked)
├── has many Remixes (ResourceId reference)
└── belongs to Community (optional)

LessonPlan
├── has many Collaborators (Users)
└── linked to Resources

Subscription
├── belongs to User or School
└── linked to Stripe data
```

### Indexes for Performance

Critical MongoDB indexes:

- User: email (unique), schoolName, userType
- Resource: subject, gradeLevels, createdBy, text index (title + description)
- Community: creator, subject, (title, description) text search
- LessonPlan: subject, gradeLevel, createdBy, isPublic
- Notification: userId, type, isRead
- DirectMessage: sender, recipient, conversationId

## File Upload Architecture

Cloudinary integration:

1. Frontend: Select file → Upload to Cloudinary (client-side)
2. Cloudinary: Process & store → Return URL + publicId
3. Backend: Save URL + metadata to MongoDB
4. Frontend: Display from Cloudinary CDN (fast & cached)

## Real-time Features

### Socket.io Events

Client → Server:

- `user_online` - User status
- `send_message` - New direct message
- `new_notification` - Notify subscribed users
- `lesson_update` - Collaborative editing changes
- `typing_indicator` - "User is typing..."

Server → Client:

- `message_received` - Incoming DM
- `notification_received` - New alert
- `user_status_changed` - Online/offline
- `realtime_update` - Data synchronization

## State Management (Zustand)

Stores in `context/store.js`:

- `useAuthStore`: user, token, login/logout
- `useResourceStore`: resources, currentResource
- `useNotificationStore`: notifications, unreadCount

## Script Commands

Backend:

- `npm run dev` - Start dev server with hot-reload
- `npm start` - Start production server
- `npm run seed` - Populate database with sample data
- `npm test` - Run test suite

Frontend:

- `npm start` - Start dev server (port 3000)
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Expose Webpack config (not recommended)

## Deployment Checklist

- [ ] All models defined and relationships set
- [ ] All controllers implement business logic
- [ ] All routes wired to controllers
- [ ] Frontend pages integrated with API
- [ ] Authentication flow working end-to-end
- [ ] Gamification mechanics implemented
- [ ] Real-time features tested
- [ ] File uploads working
- [ ] Payment integration tested with Stripe test keys
- [ ] Email sending configured
- [ ] Environment variables in CI/CD
- [ ] Database backed up
- [ ] Frontend built (`npm run build`)
- [ ] Deployed to Vercel (frontend) + Render (backend)
- [ ] SSL/HTTPS enabled
- [ ] Monitoring & logging set up
- [ ] Rate limiting applied to auth endpoints

## Development Notes

- All passwords hashed with bcrypt (10 rounds)
- JWT tokens valid for 7 days
- CORS enabled for localhost:3000 in dev
- Rate limiting: 100 requests per 15 minutes (general), 5 per 15 min (auth)
- API responses include comprehensive error messages
- Timestamps (createdAt, updatedAt) auto-managed by Mongoose
- Soft deletes not implemented (hard delete for simplicity)
- Email confirmation not enforced in dev
- XP values configurable in constants file (future enhancement)

---

**Last Updated**: 2024
**Version**: 1.0.0
**MERN Stack**: MongoDB + Express.js + React 18 + Node.js
