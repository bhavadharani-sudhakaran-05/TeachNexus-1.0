const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createResource,
  getResources,
  getResourceById,
  downloadResource,
  remixResource,
  deleteResource,
} = require('../controllers/resourceController');

const router = express.Router();

router.post('/', protect, createResource);
router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/:id/download', protect, downloadResource);
router.post('/:resourceId/remix', protect, remixResource);
router.delete('/:id', protect, deleteResource);

module.exports = router;
