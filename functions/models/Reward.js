const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  karmaRequired: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['cashback', 'discount', 'feature', 'badge'],
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reward', rewardSchema);