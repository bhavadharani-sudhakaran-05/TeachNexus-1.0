const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const School = require('../src/models/School');
const Community = require('../src/models/Community');
const Resource = require('../src/models/Resource');
const Gamification = require('../src/models/Gamification');
const Achievement = require('../src/models/Achievement');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB');

    // Clear collections
    console.log('🧹 Clearing collections...');
    await User.deleteMany({});
    await School.deleteMany({});
    await Community.deleteMany({});
    await Resource.deleteMany({});
    await Gamification.deleteMany({});
    await Achievement.deleteMany({});

    // Step 1: Create schools
    console.log('\n🏫 Creating schools...');
    const schools = await School.insertMany([
      {
        name: 'Springfield Elementary School',
        motto: 'Excellence in Elementary Education',
        description: 'A premier elementary school focused on comprehensive education',
        email: 'admin@springfield-elem.edu',
        phone: '555-0100',
        address: {
          street: '123 Education Lane',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
        },
        principal: 'Dr. James Wilson',
        schoolType: 'public',
        supportedCurriculumStandards: ['CCSS', 'NGSS'],
        subjects: ['Mathematics', 'English Language Arts', 'Science', 'Social Studies', 'Art', 'PE'],
        studentCount: 450,
        teacherCount: 25,
        classroomCount: 18,
        subscriptionTier: 'basic',
      },
      {
        name: 'Lincoln High School',
        motto: 'Preparing Tomorrow\'s Leaders',
        description: 'A comprehensive high school with advanced programs',
        email: 'admin@lincoln-high.edu',
        phone: '555-0200',
        address: {
          street: '456 Leadership Road',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62702',
        },
        principal: 'Ms. Sarah Johnson',
        schoolType: 'public',
        supportedCurriculumStandards: ['CCSS', 'NGSS', 'APE'],
        subjects: ['Mathematics', 'English Language Arts', 'Science', 'Social Studies', 'Computer Science', 'Arts'],
        studentCount: 1200,
        teacherCount: 60,
        classroomCount: 45,
        subscriptionTier: 'premium',
      },
    ]);
    console.log(`✅ Created ${schools.length} schools`);

    // Step 2: Create achievements
    console.log('\n🏆 Creating achievements...');
    const achievements = await Achievement.insertMany([
      {
        name: 'First Upload',
        description: 'Upload your first teaching resource',
        category: 'Upload',
        requirement: 'uploadCount >= 1',
        requiredValue: 1,
        xpReward: 50,
        rarity: 'common',
      },
      {
        name: 'Resource Master',
        description: 'Upload 50 resources',
        category: 'Upload',
        requirement: 'uploadCount >= 50',
        requiredValue: 50,
        xpReward: 500,
        rarity: 'rare',
      },
      {
        name: 'Community Leader',
        description: 'Create a community and add 100 members',
        category: 'Community',
        requirement: 'communitiesLed >= 1 && communityMembers >= 100',
        requiredValue: 100,
        xpReward: 300,
        rarity: 'uncommon',
      },
      {
        name: 'Mentor',
        description: 'Complete 5 mentorship relationships',
        category: 'Mentorship',
        requirement: 'mentorships >= 5',
        requiredValue: 5,
        xpReward: 400,
        rarity: 'uncommon',
      },
      {
        name: 'AI Pioneer',
        description: 'Use all 8 AI tools',
        category: 'AI',
        requirement: 'aiToolsUsed >= 8',
        requiredValue: 8,
        xpReward: 350,
        rarity: 'rare',
      },
      {
        name: 'Remix Innovator',
        description: 'Create 25 remixes',
        category: 'Remix',
        requirement: 'remixes >= 25',
        requiredValue: 25,
        xpReward: 450,
        rarity: 'rare',
      },
    ]);
    console.log(`✅ Created ${achievements.length} achievements`);

    // Step 3: Create users (teachers)
    console.log('\n👨‍🏫 Creating teachers...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('TeachNexus123!', salt);

    const users = await User.insertMany([
      {
        firstName: 'John',
        lastName: 'Teacher',
        email: 'john.teacher@teachnexus.com',
        password: passwordHash,
        userType: 'teacher',
        schoolName: schools[0].name,
        subjectSpecializations: ['Mathematics', 'Science'],
        gradeLevels: ['3-4', '5-6'],
        biography: 'Passionate math and science educator with 10 years of experience',
        subscriptionTier: 'free',
        experiencePoints: 1500,
        level: 3,
        totalResourcesUploaded: 12,
        totalDownloads: 245,
        communityReputation: 85,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@teachnexus.com',
        password: passwordHash,
        userType: 'teacher',
        schoolName: schools[1].name,
        subjectSpecializations: ['English Language Arts', 'Literature'],
        gradeLevels: ['9-10', '11-12'],
        biography: 'ELA teacher dedicated to fostering critical thinking and creative writing',
        subscriptionTier: 'premium',
        experiencePoints: 3200,
        level: 5,
        totalResourcesUploaded: 32,
        totalDownloads: 890,
        communityReputation: 200,
      },
      {
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@teachnexus.com',
        password: passwordHash,
        userType: 'teacher',
        schoolName: schools[0].name,
        subjectSpecializations: ['Computer Science', 'Technology'],
        gradeLevels: ['7-8', '9-10'],
        biography: 'Computer science educator bringing coding to young learners',
        subscriptionTier: 'basic',
        experiencePoints: 2100,
        level: 4,
        totalResourcesUploaded: 18,
        totalDownloads: 512,
        communityReputation: 120,
      },
      {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.williams@teachnexus.com',
        password: passwordHash,
        userType: 'teacher',
        schoolName: schools[1].name,
        subjectSpecializations: ['Science', 'Environmental Science'],
        gradeLevels: ['6-8', '9-10'],
        biography: 'Science educator focused on hands-on learning and environmental awareness',
        subscriptionTier: 'free',
        experiencePoints: 900,
        level: 2,
        totalResourcesUploaded: 8,
        totalDownloads: 156,
        communityReputation: 45,
      },
    ]);
    console.log(`✅ Created ${users.length} teachers`);

    // Step 4: Create gamification records
    console.log('\n🎮 Creating gamification records...');
    const gamifications = await Gamification.insertMany(
      users.map((user, index) => ({
        userId: user._id,
        totalXP: user.experiencePoints,
        currentLevel: user.level,
        xpForNextLevel: (user.level + 1) * 1000,
        unlockedBadges: achievements.slice(0, Math.min(2 + index, achievements.length)).map(badge => ({
          badgeId: badge._id,
          name: badge.name,
          unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        })),
        totalBadges: Math.min(2 + index, achievements.length),
        cpdPointsThisYear: Math.floor(Math.random() * 50),
        leaderboardRank: index + 1,
        leaderboardScore: user.experiencePoints,
        currentStreak: Math.floor(Math.random() * 30),
      }))
    );
    console.log(`✅ Created ${gamifications.length} gamification records`);

    // Step 5: Create communities
    console.log('\n👥 Creating communities...');
    const communities = await Community.insertMany([
      {
        name: 'Mathematics Teachers Network',
        description: 'Collaborative space for math educators to share strategies, resources, and innovations',
        subject: 'Mathematics',
        gradeLevels: ['all'],
        color: '#3498DB',
        creator: users[0]._id,
        moderators: [users[0]._id],
        members: users.map(user => ({ userId: user._id, joinedAt: new Date(), role: 'member' })),
        memberCount: users.length,
        isPublic: true,
        approvalRequired: false,
      },
      {
        name: 'English Language Arts Professionals',
        description: 'Dedicated community for ELA teachers to collaborate on curriculum, assessments, and best practices',
        subject: 'English Language Arts',
        gradeLevels: ['9-12'],
        color: '#E74C3C',
        creator: users[1]._id,
        moderators: [users[1]._id],
        members: users.map(user => ({ userId: user._id, joinedAt: new Date(), role: 'member' })),
        memberCount: users.length,
        isPublic: true,
        approvalRequired: false,
      },
      {
        name: 'STEM Education Initiative',
        description: 'Integration of Science, Technology, Engineering, and Mathematics for innovative teaching',
        subject: 'Science',
        gradeLevels: ['all'],
        color: '#2ECC71',
        creator: users[2]._id,
        moderators: [users[2]._id, users[0]._id],
        members: users.map(user => ({ userId: user._id, joinedAt: new Date(), role: 'member' })),
        memberCount: users.length,
        isPublic: true,
        approvalRequired: false,
      },
    ]);
    console.log(`✅ Created ${communities.length} communities`);

    // Step 6: Create sample resources
    console.log('\n📚 Creating sample resources...');
    const resources = await Resource.insertMany([
      {
        title: 'Introduction to Algebraic Expressions',
        description: 'A comprehensive lesson on algebraic expressions, variables, and coefficients',
        content: 'Detailed content covering variables, constants, and basic algebraic operations...',
        resourceType: 'lesson_plan',
        subject: 'Mathematics',
        gradeLevels: ['7-8'],
        skillTags: ['Algebra', 'Variables', 'Expressions'],
        createdBy: users[0]._id,
        isPublic: true,
        downloads: 45,
        views: 120,
        rating: {
          average: 4.5,
          count: 20,
        },
        isPeerReviewed: true,
        xpValue: 10,
      },
      {
        title: 'Shakespeare\'s Sonnets: Comprehension & Analysis',
        description: 'Interactive activities for analyzing Shakespeare\'s sonnets',
        content: 'Activities designed to help students understand and analyze Shakespeare\'s poetry...',
        resourceType: 'worksheet',
        subject: 'English Language Arts',
        gradeLevels: ['9-10'],
        skillTags: ['Poetry', 'Shakespeare', 'Literary Analysis'],
        createdBy: users[1]._id,
        isPublic: true,
        downloads: 78,
        views: 234,
        rating: {
          average: 4.8,
          count: 35,
        },
        isPeerReviewed: true,
        xpValue: 10,
      },
      {
        title: 'Python Basics: Variables and Data Types',
        description: 'Introductory programming lesson on Python variables and data types',
        content: 'Step-by-step guide to Python programming fundamentals...',
        resourceType: 'code_files',
        subject: 'Computer Science',
        gradeLevels: ['9-10', '11-12'],
        skillTags: ['Programming', 'Python', 'Data Types'],
        createdBy: users[2]._id,
        isPublic: true,
        downloads: 92,
        views: 290,
        rating: {
          average: 4.7,
          count: 42,
        },
        isPeerReviewed: true,
        xpValue: 15,
      },
      {
        title: 'Climate Change: Causes and Effects Lab',
        description: 'Interactive lab activity exploring climate change mechanisms',
        content: 'Hands-on laboratory exercise with data analysis components...',
        resourceType: 'lab_activity',
        subject: 'Science',
        gradeLevels: ['6-8', '9-10'],
        skillTags: ['Climate', 'Environment', 'Data Analysis'],
        createdBy: users[3]._id,
        isPublic: true,
        downloads: 56,
        views: 165,
        rating: {
          average: 4.6,
          count: 28,
        },
        isPeerReviewed: true,
        xpValue: 12,
      },
    ]);
    console.log(`✅ Created ${resources.length} sample resources`);

    // Success message
    console.log('\n' + '='.repeat(60));
    console.log('✅ DATABASE SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📋 Summary:');
    console.log(`   - ${schools.length} schools`);
    console.log(`   - ${users.length} teacher accounts`);
    console.log(`   - ${communities.length} communities`);
    console.log(`   - ${resources.length} sample resources`);
    console.log(`   - ${achievements.length} achievement types`);
    console.log(`   - ${gamifications.length} gamification records`);
    console.log('\n🔐 Test Login Credentials:');
    console.log('   Email: john.teacher@teachnexus.com');
    console.log('   Password: TeachNexus123!');
    console.log('\n   Or try other accounts:');
    users.forEach((user, idx) => {
      console.log(`   ${idx + 2}. ${user.email} (Password: TeachNexus123!)`);
    });
    console.log('\n💡 Tips:');
    console.log('   - All users have standard password: TeachNexus123!');
    console.log('   - Resources include peer reviews and ratings');
    console.log('   - Users are members of all created communities');
    console.log('   - Achievement system ready for integration');
    console.log('\n' + '='.repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ SEED ERROR:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run seed
seedDatabase();
