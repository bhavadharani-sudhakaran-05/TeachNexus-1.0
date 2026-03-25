const Resource = require('../models/Resource');
const User = require('../models/User');
const { deleteFromCloudinary } = require('../utils/cloudinaryUtils');

exports.createResource = async (req, res) => {
  try {
    const { title, description, content, resourceType, subject, gradeLevels, skillTags, isPublic } = req.body;
    const createdBy = req.userId;

    const resource = await Resource.create({
      title,
      description,
      content,
      resourceType,
      subject,
      gradeLevels,
      skillTags,
      isPublic,
      createdBy,
    });

    // Update user stats
    await User.findByIdAndUpdate(createdBy, {
      $inc: { totalResourcesUploaded: 1, experiencePoints: 10 },
    });

    return res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      resource,
    });
  } catch (error) {
    console.error('Create resource error:', error);
    return res.status(500).json({ message: 'Error creating resource' });
  }
};

exports.getResources = async (req, res) => {
  try {
    const { subject, gradeLevel, resourceType, search, page = 1, limit = 12 } = req.query;

    let query = { isPublic: true };

    if (subject) query.subject = subject;
    if (gradeLevel) query.gradeLevels = { $in: [gradeLevel] };
    if (resourceType) query.resourceType = resourceType;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const resources = await Resource.find(query)
      .populate('createdBy', 'firstName lastName profilePicture')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Resource.countDocuments(query);

    return res.status(200).json({
      success: true,
      resources,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get resources error:', error);
    return res.status(500).json({ message: 'Error fetching resources' });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('createdBy', 'firstName lastName profilePicture');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    return res.status(200).json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error('Get resource error:', error);
    return res.status(500).json({ message: 'Error fetching resource' });
  }
};

exports.downloadResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const resource = await Resource.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    // Award XP to creator
    await User.findByIdAndUpdate(resource.createdBy, {
      $inc: { experiencePoints: resource.downloadXpValue, totalDownloads: 1 },
    });

    return res.status(200).json({
      success: true,
      message: 'Resource downloaded',
      downloadUrl: resource.file.url,
    });
  } catch (error) {
    console.error('Download resource error:', error);
    return res.status(500).json({ message: 'Error downloading resource' });
  }
};

exports.remixResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { title, description, content } = req.body;
    const userId = req.userId;

    const originalResource = await Resource.findById(resourceId);
    if (!originalResource) {
      return res.status(404).json({ message: 'Original resource not found' });
    }

    const remixedResource = await Resource.create({
      title,
      description,
      content,
      resourceType: originalResource.resourceType,
      subject: originalResource.subject,
      gradeLevels: originalResource.gradeLevels,
      createdBy: userId,
      isRemix: true,
      remixedFromId: resourceId,
      remixedFromAuthor: originalResource.createdBy,
      isPublic: false,
    });

    // Update remix history
    remixedResource.remixHistory.push({
      resourceId: originalResource._id,
      author: originalResource.createdBy,
      timestamp: new Date(),
      version: 1,
    });
    await remixedResource.save();

    // Award XP to both
    await User.findByIdAndUpdate(userId, { $inc: { experiencePoints: 15 } });
    await User.findByIdAndUpdate(originalResource.createdBy, { $inc: { experiencePoints: 10 } });

    return res.status(201).json({
      success: true,
      message: 'Resource remixed successfully',
      remixedResource,
    });
  } catch (error) {
    console.error('Remix resource error:', error);
    return res.status(500).json({ message: 'Error remixing resource' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    if (resource.file.publicId) {
      await deleteFromCloudinary(resource.file.publicId);
    }

    await Resource.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    return res.status(500).json({ message: 'Error deleting resource' });
  }
};
