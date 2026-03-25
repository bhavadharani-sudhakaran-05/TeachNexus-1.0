# TeachNexus API Documentation

Complete reference for all REST API endpoints in TeachNexus.

---

## Base URL

```
Development: http://localhost:5000
Production: https://api.teachnexus.com (example)
```

## Authentication

All endpoints except public ones require JWT token in Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

Token obtained from `/api/auth/login` or `/api/auth/register` responses.

---

## Endpoints Reference

### 📋 Authentication (`/api/auth`)

#### Register New User

```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Teacher",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "userType": "teacher",
  "schoolName": "Springfield Elementary",
  "subjectSpecializations": ["Mathematics", "Science"],
  "gradeLevels": ["3-4", "5-6"]
}

Response: 201
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "60d5ec49f1b2c72f8c8e4a1e",
    "firstName": "John",
    "lastName": "Teacher",
    "email": "john@example.com",
    "userType": "teacher",
    "schoolName": "Springfield Elementary",
    "experiencePoints": 0,
    "level": 1
  }
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json
Rate Limit: 5 requests per 15 minutes

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ...user data... }
}
```

#### Forgot Password

```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: 200
{
  "message": "Password reset link sent to email",
  "resetToken": "temporary-token-for-reset"
}
```

#### Reset Password

```
POST /api/auth/reset-password
Content-Type: application/json
Authorization: Bearer <RESET_TOKEN>

{
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}

Response: 200
{
  "message": "Password reset successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 👤 Users (`/api/users`)

#### Get Own Profile

```
GET /api/users/profile
Authorization: Bearer <TOKEN>

Response: 200
{
  "_id": "60d5ec49f1b2c72f8c8e4a1e",
  "firstName": "John",
  "lastName": "Teacher",
  "email": "john@example.com",
  "profilePicture": "https://cloudinary.com/...",
  "biography": "Mathematics educator with 10 years experience",
  "userType": "teacher",
  "schoolName": "Springfield Elementary",
  "subjectSpecializations": ["Mathematics", "Science"],
  "gradeLevels": ["3-4", "5-6"],
  "experiencePoints": 1500,
  "level": 3,
  "totalResourcesUploaded": 12,
  "totalDownloads": 245,
  "communityReputation": 85,
  "resources": [...],
  "likedResources": [...],
  "joinedCommunities": [...]
}
```

#### Update Profile

```
PUT /api/users/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Teacher",
  "biography": "Updated bio",
  "subjectSpecializations": ["Mathematics", "Science", "Technology"],
  "gradeLevels": ["3-4", "5-6", "7-8"],
  "schoolName": "Updated School Name"
}

Response: 200
{
  "message": "Profile updated successfully",
  "user": { ...updated user data... }
}
```

#### Get Dashboard Data

```
GET /api/users/dashboard
Authorization: Bearer <TOKEN>

Response: 200
{
  "stats": {
    "totalResourcesUploaded": 12,
    "totalDownloads": 245,
    "communityReputation": 85,
    "experiencePoints": 1500,
    "level": 3,
    "badgesEarned": 5,
    "cpdPointsThisYear": 24
  },
  "recommendations": [
    {
      "_id": "...",
      "title": "Advanced Algebraic Expressions",
      "downloads": 120,
      "rating": 4.8
    }
  ],
  "greeting": "Welcome back, John! 🎉"
}
```

#### Get Public Profile

```
GET /api/users/:userId
Authorization: Bearer <TOKEN>

Response: 200
{
  "_id": "60d5ec49f1b2c72f8c8e4a1e",
  "firstName": "John",
  "lastName": "Teacher",
  "profilePicture": "https://cloudinary.com/...",
  "biography": "Mathematics educator",
  "schoolName": "Springfield Elementary",
  "experiencePoints": 1500,
  "level": 3,
  "totalResourcesUploaded": 12,
  "totalDownloads": 245,
  "resources": [...],
  "badges": [...]
}
```

---

### 📚 Resources (`/api/resources`)

#### Create Resource

```
POST /api/resources
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- title: "Introduction to Algebraic Expressions"
- description: "Comprehensive lesson on algebra"
- content: "Lesson content here"
- file: <file binary>
- resourceType: "lesson_plan" (lesson_plan, worksheet, code_files, lab_activity, etc.)
- subject: "Mathematics"
- gradeLevels: ["7-8", "8-9"]
- skillTags: ["Algebra", "Variables"]

Response: 201
{
  "_id": "60d5ec49f1b2c72f8c8e4a1e",
  "title": "Introduction to Algebraic Expressions",
  "description": "...",
  "file": {
    "url": "https://cloudinary.com/...",
    "publicId": "teachnexus/...",
    "fileName": "algebra.pdf",
    "fileSize": 2048000
  },
  "createdBy": "60d5ec49f1b2c72f8c8e4a1d",
  "xpValue": 10,
  "message": "Resource created successfully! You earned 10 XP"
}
```

#### List Resources

```
GET /api/resources?search=algebra&subject=Mathematics&gradeLevel=7-8&page=1&limit=12
Authorization: Bearer <TOKEN> (optional for public resources)

Response: 200
{
  "resources": [
    {
      "_id": "...",
      "title": "Algebraic Expressions",
      "description": "...",
      "subject": "Mathematics",
      "gradeLevels": ["7-8"],
      "downloads": 120,
      "views": 450,
      "rating": {
        "average": 4.8,
        "count": 35
      },
      "createdBy": {
        "_id": "...",
        "firstName": "John",
        "lastName": "Teacher"
      }
    }
  ],
  "totalResults": 127,
  "currentPage": 1,
  "totalPages": 11
}
```

#### Get Resource Details

```
GET /api/resources/:id
Authorization: Bearer <TOKEN> (optional)

Response: 200
{
  "_id": "...",
  "title": "Algebraic Expressions",
  "description": "...",
  "content": "...",
  "file": {
    "url": "https://cloudinary.com/...",
    "publicId": "...",
    "fileSize": 2048000
  },
  "resourceType": "lesson_plan",
  "subject": "Mathematics",
  "gradeLevels": ["7-8"],
  "skillTags": ["Algebra"],
  "createdBy": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Teacher"
  },
  "downloads": 120,
  "views": 451,
  "rating": {
    "average": 4.8,
    "count": 35
  },
  "reviews": [
    {
      "userId": "...",
      "rating": 5,
      "comment": "Excellent resource!",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "isRemix": false,
  "remixedFromId": null,
  "remixHistory": []
}
```

#### Download Resource

```
POST /api/resources/:id/download
Authorization: Bearer <TOKEN>

Response: 200
{
  "message": "Download recorded successfully",
  "downloadUrl": "https://cloudinary.com/...",
  "xpAwarded": 5,
  "totalDownloads": 121
}
```

#### Remix Resource

```
POST /api/resources/:resourceId/remix
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "My Version: Algebraic Expressions",
  "modifications": "Simplified for advanced learners",
  "gradeLevels": ["8-9"]
}

Response: 201
{
  "_id": "new-resource-id",
  "title": "My Version: Algebraic Expressions",
  "isRemix": true,
  "remixedFromId": "original-resource-id",
  "remixHistory": [
    {
      "resourceId": "original-resource-id",
      "remixedBy": "...",
      "remixedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "message": "Remix created successfully! You earned 15 XP, original creator earned 10 XP"
}
```

#### Delete Resource

```
DELETE /api/resources/:id
Authorization: Bearer <TOKEN>

Response: 200
{
  "message": "Resource deleted successfully"
}
```

---

### 📖 Lesson Plans (`/api/lesson-plans`)

#### Create Lesson Plan

```
POST /api/lesson-plans
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Introduction to Fractions",
  "subject": "Mathematics",
  "gradeLevel": "4-5",
  "duration": 45,
  "objectives": [
    "Understand the concept of fractions",
    "Identify numerator and denominator"
  ],
  "materials": [
    "Fraction circles",
    "Pizza cutouts",
    "Whiteboard"
  ],
  "lesson": {
    "introduction": "Start with pizza analogy...",
    "instructionalStrategies": ["Direct instruction", "Hands-on activity"],
    "studentActivities": "Divide objects into fractions",
    "closure": "Summarize key concepts",
    "assessment": "Quiz on fractions",
    "accommodations": "Provide visual aids for visual learners"
  },
  "linkedResources": ["resource-id-1", "resource-id-2"]
}

Response: 201
{
  "_id": "...",
  "title": "Introduction to Fractions",
  "createdBy": "...",
  "isDraft": true,
  "isPublic": false,
  "views": 0,
  "createdAt": "2024-01-15T10:30:00Z",
  "xpAwarded": 20,
  "message": "Lesson plan created! You earned 20 XP"
}
```

#### List Lesson Plans

```
GET /api/lesson-plans?subject=Mathematics&gradeLevel=4-5&page=1
Authorization: Bearer <TOKEN>

Response: 200
{
  "lessonPlans": [
    {
      "_id": "...",
      "title": "Introduction to Fractions",
      "subject": "Mathematics",
      "gradeLevel": "4-5",
      "duration": 45,
      "views": 125,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 23,
  "page": 1
}
```

#### Get Lesson Plan

```
GET /api/lesson-plans/:id
Authorization: Bearer <TOKEN>

Response: 200
{
  "_id": "...",
  "title": "Introduction to Fractions",
  "subject": "Mathematics",
  "gradeLevel": "4-5",
  "duration": 45,
  "objectives": [...],
  "materials": [...],
  "lesson": {...},
  "linkedResources": [
    {
      "_id": "...",
      "title": "Resource Title",
      "url": "..."
    }
  ],
  "views": 126,
  "createdBy": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Teacher"
  }
}
```

#### Update Lesson Plan

```
PUT /api/lesson-plans/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Updated Title",
  "objectives": [...],
  "materials": [...]
  // ... other fields to update
}

Response: 200
{
  "_id": "...",
  "message": "Lesson plan updated successfully"
}
```

#### Publish Lesson Plan

```
POST /api/lesson-plans/:id/publish
Authorization: Bearer <TOKEN>

Response: 200
{
  "_id": "...",
  "isDraft": false,
  "isPublic": true,
  "xpAwarded": 50,
  "message": "Lesson plan published! You earned 50 XP"
}
```

#### Delete Lesson Plan

```
DELETE /api/lesson-plans/:id
Authorization: Bearer <TOKEN>

Response: 200
{
  "message": "Lesson plan deleted successfully"
}
```

---

### 👥 Community (`/api/community`)

#### Create Community

```
POST /api/community
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Mathematics Teachers Network",
  "description": "Collaborative space for math educators",
  "subject": "Mathematics",
  "gradeLevels": ["all"],
  "isPublic": true,
  "approvalRequired": false
}

Response: 201
{
  "_id": "...",
  "name": "Mathematics Teachers Network",
  "creator": "...",
  "memberCount": 1,
  "members": [...],
  "xpAwarded": 30,
  "message": "Community created successfully! You earned 30 XP"
}
```

#### List Communities

```
GET /api/community?subject=Mathematics&page=1
Authorization: Bearer <TOKEN> (optional)

Response: 200
{
  "communities": [
    {
      "_id": "...",
      "name": "Mathematics Teachers Network",
      "description": "...",
      "subject": "Mathematics",
      "memberCount": 145,
      "totalPosts": 342,
      "creator": "..."
    }
  ],
  "total": 23,
  "page": 1
}
```

#### Get Community Details

```
GET /api/community/:id
Authorization: Bearer <TOKEN>

Response: 200
{
  "_id": "...",
  "name": "Mathematics Teachers Network",
  "description": "...",
  "subject": "Mathematics",
  "memberCount": 146,
  "members": [...],
  "discussionThreads": [
    {
      "_id": "...",
      "title": "Effective strategies for teaching fractions",
      "category": "discussion",
      "author": "...",
      "replies": 12,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Join Community

```
POST /api/community/:id/join
Authorization: Bearer <TOKEN>

Response: 200
{
  "_id": "...",
  "message": "Successfully joined community! You earned 10 XP",
  "memberCount": 147,
  "xpAwarded": 10
}
```

#### Create Discussion Thread

```
POST /api/community/:communityId/discussions
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Best practices for differentiation",
  "content": "What strategies do you use for differentiating instruction?",
  "category": "discussion",
  "tags": ["differentiation", "strategies"]
}

Response: 201
{
  "_id": "...",
  "title": "Best practices for differentiation",
  "content": "...",
  "author": "...",
  "category": "discussion",
  "replies": 0,
  "likes": 0,
  "createdAt": "2024-01-15T10:30:00Z",
  "xpAwarded": 5,
  "message": "Discussion created! You earned 5 XP"
}
```

#### Get Discussion Threads

```
GET /api/community/:communityId/discussions?page=1&category=discussion
Authorization: Bearer <TOKEN>

Response: 200
{
  "discussions": [
    {
      "_id": "...",
      "title": "Best practices for differentiation",
      "category": "discussion",
      "author": {
        "_id": "...",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "replies": 8,
      "likes": 25,
      "views": 156,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 42,
  "page": 1
}
```

---

### 🎮 Gamification (`/api/gamification`)

#### Get Gamification Stats

```
GET /api/gamification/stats
Authorization: Bearer <TOKEN>

Response: 200
{
  "userId": "...",
  "totalXP": 2850,
  "currentLevel": 4,
  "xpForNextLevel": 5000,
  "xpProgress": "2850 / 5000 (57%)",
  "unlockedBadges": [
    {
      "_id": "...",
      "name": "First Upload",
      "description": "Upload your first resource",
      "icon": "🎯",
      "color": "#D4A574",
      "unlockedAt": "2024-01-10T10:30:00Z"
    }
  ],
  "totalBadges": 3,
  "cpdPointsThisYear": 18,
  "cpdPointsAllTime": 45,
  "leaderboardRank": 42,
  "leaderboardScore": 2850,
  "currentStreak": 15,
  "longestStreak": 28
}
```

#### Get Achievements

```
GET /api/gamification/achievements
Authorization: Bearer <TOKEN> (optional)

Response: 200
{
  "achievements": [
    {
      "_id": "...",
      "name": "First Upload",
      "description": "Upload your first teaching resource",
      "icon": "🎯",
      "category": "Upload",
      "requirement": "uploadCount >= 1",
      "xpReward": 50,
      "rarity": "common",
      "totalUnlocked": 1245
    },
    {
      "_id": "...",
      "name": "Resource Master",
      "description": "Upload 50 resources",
      "icon": "🏆",
      "category": "Upload",
      "requirement": "uploadCount >= 50",
      "xpReward": 500,
      "rarity": "rare",
      "totalUnlocked": 34
    }
  ],
  "total": 20
}
```

#### Get Leaderboard

```
GET /api/gamification/leaderboard?limit=100
Authorization: Bearer <TOKEN>

Response: 200
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "...",
      "firstName": "Sarah",
      "lastName": "Thompson",
      "totalXP": 15420,
      "currentLevel": 8,
      "school": "Lincoln High School",
      "badges": 18
    },
    {
      "rank": 2,
      "userId": "...",
      "firstName": "Michael",
      "lastName": "Chen",
      "totalXP": 12850,
      "currentLevel": 7,
      "school": "Springfield Elementary",
      "badges": 15
    }
  ],
  "userRank": {
    "rank": 42,
    "totalXP": 2850,
    "currentLevel": 4
  }
}
```

#### Get Teaching Challenges

```
GET /api/gamification/challenges
Authorization: Bearer <TOKEN>

Response: 200
{
  "challenges": [
    {
      "_id": "...",
      "title": "Lesson Plan Wizard",
      "description": "Create 5 lesson plans this week",
      "objective": "Encourage systematic lesson planning",
      "difficulty": "medium",
      "xpReward": 200,
      "badgeReward": "Planner Badge",
      "participants": 234,
      "completionCount": 45,
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-01-22T23:59:59Z",
      "isActive": true,
      "userParticipation": {
        "joined": true,
        "completed": false,
        "progress": "2 / 5"
      }
    }
  ],
  "total": 3
}
```

#### Join Challenge

```
POST /api/gamification/challenges/:id/join
Authorization: Bearer <TOKEN>

Response: 200
{
  "_id": "...",
  "message": "Successfully joined challenge!",
  "totalParticipants": 235
}
```

#### Complete Challenge

```
POST /api/gamification/challenges/:id/complete
Authorization: Bearer <TOKEN>

Response: 200
{
  "_id": "...",
  "message": "Challenge completed! You earned 200 XP",
  "xpAwarded": 200,
  "badgeAwarded": {
    "name": "Planner Badge",
    "icon": "📋"
  }
}
```

---

### 🤖 AI Tools (`/api/ai-tools`)

#### Generate Lesson Plan

```
POST /api/ai-tools/lesson-generator
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "topic": "Introduction to Fractions",
  "gradeLevel": "4-5",
  "subject": "Mathematics",
  "duration": 45
}

Response: 200
{
  "lesson": {
    "title": "Introduction to Fractions",
    "objectives": [
      "Understand fractions as parts of a whole",
      "Identify numerators and denominators"
    ],
    "materials": [
      "Fraction circles",
      "Pizza cutouts",
      "Whiteboard"
    ],
    "introduction": "Start with relatable examples...",
    "instructionalStrategies": [
      "Direct instruction with visual aids",
      "Collaborative practice activities"
    ],
    "studentActivities": "Students practice dividing objects...",
    "closure": "Review key concepts...",
    "assessment": "Quick quiz on fractions"
  }
}
```

#### Summarize Resource

```
POST /api/ai-tools/summarize
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "resourceId": "...",
  "content": "Long resource content text..."
}

Response: 200
{
  "summary": "Brief summary of main concepts...",
  "keyPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ],
  "learningOutcomes": [
    "Students will understand...",
    "Students will be able to..."
  ]
}
```

#### Voice to Lesson Plan

```
POST /api/ai-tools/voice-to-lesson
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- audio: <audio file>
- subject: "Mathematics"
- gradeLevel: "4-5"

Response: 200
{
  "transcript": "Audio transcription...",
  "lesson": {
    "title": "Lesson from voice notes",
    "objectives": [...],
    "materials": [...],
    "content": "..."
  }
}
```

#### Scan Whiteboard

```
POST /api/ai-tools/whiteboard-scanner
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- image: <image file>
- subject: "Mathematics"

Response: 200
{
  "extractedContent": "Text and equations from whiteboard...",
  "formattedLesson": {
    "concepts": ["Concept 1", "Concept 2"],
    "equations": ["..."],
    "lessonOutline": "..."
  }
}
```

#### Predict Student Performance

```
POST /api/ai-tools/student-predictor
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "classId": "...",
  "studentAssessments": [
    {
      "studentId": "...",
      "recentScores": [85, 78, 82],
      "attendancePercentage": 95,
      "participationLevel": "high"
    }
  ]
}

Response: 200
{
  "analysis": {
    "analyzedAt": "2024-01-15T10:30:00Z",
    "riskStudents": [
      {
        "studentId": "...",
        "name": "Student Name",
        "riskLevel": "medium",
        "predictedScore": 65,
        "suggestedInterventions": [
          "Additional tutoring",
          "One-on-one support"
        ],
        "parentCommunicationDraft": "Dear Parents..."
      }
    ],
    "classStrengths": "Strong collaboration...",
    "areasOfImprovement": "Concept comprehension..."
  }
}
```

#### Analyze Resource Gaps

```
POST /api/ai-tools/gap-analyzer
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "subject": "Mathematics",
  "gradeLevel": "4-5"
}

Response: 200
{
  "subject": "Mathematics",
  "gradeLevel": "4-5",
  "lastAnalyzedAt": "2024-01-15T10:30:00Z",
  "allTopics": [
    {
      "topic": "Fractions",
      "standard": "CCSS.MATH.4.NF",
      "resourceCount": 45,
      "averageQuality": 4.6,
      "coverage": "adequate"
    }
  ],
  "criticalGaps": [
    {
      "topic": "Advanced Fractions",
      "standard": "CCSS.MATH.5.N.2",
      "reason": "Only 3 resources available",
      "suggestedResourceTypes": ["interactive_tool", "worksheet"],
      "qualifiedContributors": 12
    }
  ],
  "statistics": {
    "totalTopics": 24,
    "adequatelyCovered": 20,
    "underservedTopics": 4,
    "resourceCoveragePercentage": 85
  }
}
```

#### TeachBot Query

```
POST /api/ai-tools/teachbot-query
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "question": "How do I make fractions engaging for young learners?"
}

Response: 200
{
  "response": "Engaging fractions for young learners involves...",
  "suggestedResources": [
    {
      "resourceId": "...",
      "title": "Fun Fraction Games",
      "relevance": 0.95
    }
  ],
  "followUpQuestions": [
    "What strategies work best for struggling learners?",
    "How can I differentiate fraction instruction?"
  ]
}
```

#### Recommend Resources

```
GET /api/ai-tools/recommend?subject=Mathematics&limit=10
Authorization: Bearer <TOKEN>

Response: 200
{
  "recommendations": [
    {
      "_id": "...",
      "title": "Efficient Fraction Teaching",
      "description": "...",
      "downloads": 245,
      "rating": 4.8,
      "relevanceScore": 0.98,
      "createdBy": "..."
    }
  ]
}
```

---

### 👨‍💼 Admin (`/api/admin`)

#### Get School Health Report

```
GET /api/admin/school-health
Authorization: Bearer <TOKEN>
Admin Required: true

Response: 200
{
  "schoolName": "Springfield Elementary",
  "report": {
    "totalTeachersOnPlatform": 24,
    "totalTeachersAtSchool": 28,
    "adoptionPercentage": 85.7,
    "totalResourcesShared": 342,
    "averageResourcesPerTeacher": 14.25,
    "totalDownloads": 8945,
    "communityEngagementScore": 8.5,
    "averageLevelOfTeachers": 4.2,
    "topSubjects": ["Mathematics", "English Language Arts", "Science"],
    "generatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Generate Timetable

```
POST /api/admin/timetable
Authorization: Bearer <TOKEN>
Admin Required: true
Content-Type: application/json

{
  "schoolId": "...",
  "classrooms": 18,
  "periodsPerDay": 7,
  "daysPerWeek": 5,
  "constraints": {
    "maxConsecutivePeriods": 2,
    "breakTimes": ["11:30-12:00", "14:30-15:00"]
  }
}

Response: 200
{
  "timetable": {
    "Monday": [
      { "period": 1, "classroom": "4A", "subject": "Mathematics", "teacher": "John" },
      { "period": 2, "classroom": "4A", "subject": "English", "teacher": "Jane" }
    ]
  },
  "conflicts": 0,
  "optimizationScore": 95,
  "notes": "Timetable optimized with zero conflicts"
}
```

#### Create Classroom Poll

```
POST /api/admin/polling
Authorization: Bearer <TOKEN>
Admin Required: true
Content-Type: application/json

{
  "question": "What is the capital of France?",
  "options": ["Paris", "Lyon", "Marseille", "Toulouse"],
  "duration": 300,
  "allowMultiple": false
}

Response: 201
{
  "_id": "...",
  "pollUrl": "https://teachnexus.com/poll/poll-id",
  "qrCode": "data:image/png;base64,...",
  "closingTime": "2024-01-15T10:35:00Z"
}
```

#### Create Curriculum Mapping

```
POST /api/admin/curriculum-mapping
Authorization: Bearer <TOKEN>
Admin Required: true
Content-Type: application/json

{
  "schoolId": "...",
  "subject": "Mathematics",
  "gradeLevel": "4",
  "academicYear": "2023-2024",
  "curriculumFramework": "CCSS",
  "mappingGrid": [
    {
      "week": 1,
      "standardsToTeach": ["CCSS.MATH.4.NBT.A.1"],
      "topicsToTeach": ["Place value"],
      "linkedResources": ["resource-id-1"],
      "linkedLessonPlans": ["lesson-id-1"],
      "status": "planned"
    }
  ]
}

Response: 201
{
  "_id": "...",
  "subject": "Mathematics",
  "gradeLevel": "4",
  "academicYear": "2023-2024",
  "statistics": {
    "totalStandardsToTeach": 24,
    "standardsCovered": 18,
    "resourcesCovered": 15,
    "completionPercentage": 75
  }
}
```

#### Match Mentor

```
POST /api/admin/mentor-match
Authorization: Bearer <TOKEN>
Admin Required: true
Content-Type: application/json

{
  "menteeId": "...",
  "criteria": {
    "subject": "Mathematics",
    "experience": "5+",
    "location": "same_school"
  }
}

Response: 201
{
  "_id": "...",
  "mentor": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Teacher",
    "experience": 12
  },
  "mentee": { ... },
  "matchingScore": 0.92,
  "startDate": "2024-01-20T00:00:00Z"
}
```

---

### 💬 Messages (`/api/messages`)

#### Send Message

```
POST /api/messages/send
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "recipientId": "...",
  "message": "Hi Jane! I wanted to share some fraction teaching strategies...",
  "attachments": []
}

Response: 201
{
  "_id": "...",
  "sender": "...",
  "recipient": "...",
  "message": "...",
  "createdAt": "2024-01-15T10:30:00Z",
  "isRead": false
}
```

#### Get Conversation

```
GET /api/messages/conversation/:recipientId?limit=50
Authorization: Bearer <TOKEN>

Response: 200
{
  "messages": [
    {
      "_id": "...",
      "sender": { "firstName": "John", "lastName": "Teacher" },
      "recipient": { "firstName": "Jane", "lastName": "Smith" },
      "message": "Great resource!",
      "createdAt": "2024-01-15T09:00:00Z",
      "isRead": true,
      "readAt": "2024-01-15T09:15:00Z"
    }
  ],
  "unreadCount": 2
}
```

#### Get Conversations List

```
GET /api/messages?limit=20
Authorization: Bearer <TOKEN>

Response: 200
{
  "conversations": [
    {
      "conversationId": "...",
      "otherUser": {
        "_id": "...",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "lastMessage": "Thanks for the resource!",
      "lastMessageAt": "2024-01-15T18:30:00Z",
      "unreadCount": 2
    }
  ]
}
```

---

### 🔔 Notifications (`/api/notifications`)

#### Get Notifications

```
GET /api/notifications?page=1&category=all&limit=20
Authorization: Bearer <TOKEN>

Response: 200
{
  "notifications": [
    {
      "_id": "...",
      "title": "New Comment on Your Resource",
      "message": "Jane Smith commented on 'Fractions for Beginners':",
      "type": "comment",
      "category": "social",
      "relatedContent": { "type": "resource", "id": "..." },
      "actionUrl": "/resources/...",
      "isRead": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "unreadCount": 5,
  "total": 42
}
```

#### Mark Notifications as Read

```
PUT /api/notifications/mark-read
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "notificationIds": ["id-1", "id-2", "id-3"]
}

Response: 200
{
  "message": "Notifications marked as read",
  "unreadCount": 2
}
```

#### Delete Notification

```
DELETE /api/notifications/:id
Authorization: Bearer <TOKEN>

Response: 200
{
  "message": "Notification deleted successfully"
}
```

---

### 💳 Payments (`/api/payments`)

#### Create Checkout Session

```
POST /api/payments/create-checkout-session
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "tier": "premium",
  "duration": "monthly"
}

Response: 201
{
  "sessionId": "cs_live_123abc...",
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_live_123abc...",
  "message": "Checkout session created successfully"
}
```

#### Stripe Webhook

```
POST /api/payments/webhook
Content-Type: application/json
(No Authorization needed - Stripe signature verification required)

Webhook Events Handled:
- checkout.session.completed
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

---

## Error Responses

All errors return appropriate HTTP status codes:

```javascript
// 400 Bad Request
{
  "error": "Validation failed",
  "details": ["Email is required", "Password must be at least 8 characters"]
}

// 401 Unauthorized
{
  "error": "Authentication required",
  "message": "Please login to access this resource"
}

// 403 Forbidden
{
  "error": "Access denied",
  "message": "You don't have permission to perform this action"
}

// 404 Not Found
{
  "error": "Not found",
  "message": "Resource not found"
}

// 409 Conflict
{
  "error": "Email already registered",
  "message": "Please use a different email or login"
}

// 429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later",
  "retryAfter": 900
}

// 500 Server Error
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Common Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12, max: 100)
- `sort`: Sort field (e.g., `-createdAt` for descending)
- `search`: Full-text search query
- `filter`: Additional filters (varies by endpoint)

---

## Rate Limiting

- General endpoints: 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes per IP
- Responses include `X-RateLimit-*` headers

---

**Last Updated**: 2024-01-15
**API Version**: 1.0.0
**Documentation Version**: 1.0.0
