const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema(
  {
    // Participants
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    conversationId: String, // Unique ID for message thread
    
    // Message Content
    message: {
      type: String,
      required: true,
    },
    attachments: [
      {
        url: String,
        type: String,
        name: String,
      },
    ],
    
    // Message Status
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    
    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DirectMessage', directMessageSchema);
