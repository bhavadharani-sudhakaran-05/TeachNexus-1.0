const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  createDiscussionThread,
  getDiscussionThreads,
} = require('../controllers/communityController');

const router = express.Router();

router.post('/', protect, createCommunity);
router.get('/', getCommunities);
router.get('/:id', getCommunityById);
router.post('/:id/join', protect, joinCommunity);
router.post('/:communityId/discussions', protect, createDiscussionThread);
router.get('/:communityId/discussions', getDiscussionThreads);

module.exports = router;
