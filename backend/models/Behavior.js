const mongoose = require('mongoose');

const behaviorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['payment_on_time', 'payment_late', 'credit_utilization_low', 'credit_utilization_high', 'new_credit_account', 'credit_check'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  karmaPoints: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

module.exports = mongoose.model('Behavior', behaviorSchema);