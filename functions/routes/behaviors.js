const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Behavior = require('../models/Behavior');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const behaviors = await Behavior.find({ user: req.userId })
      .sort({ date: -1 })
      .limit(50);
    
    res.json(behaviors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  const { type, description, metadata } = req.body;

  const karmaPointsMap = {
    'payment_on_time': 10,
    'payment_late': -15,
    'credit_utilization_low': 5,
    'credit_utilization_high': -5,
    'new_credit_account': 3,
    'credit_check': -2
  };

  try {
    const karmaPoints = karmaPointsMap[type] || 0;
    
    const behavior = new Behavior({
      user: req.userId,
      type,
      description,
      karmaPoints,
      metadata
    });

    await behavior.save();

    await User.findByIdAndUpdate(
      req.userId,
      { $inc: { karmaScore: karmaPoints } }
    );

    res.status(201).json(behavior);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/summary', auth, async (req, res) => {
  try {
    const behaviors = await Behavior.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalKarma: { $sum: '$karmaPoints' }
        }
      }
    ]);

    const user = await User.findById(req.userId);
    
    res.json({
      currentKarma: user.karmaScore,
      behaviorSummary: behaviors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;