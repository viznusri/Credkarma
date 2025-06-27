const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reward = require('../models/Reward');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const rewards = await Reward.find({ active: true }).sort({ karmaRequired: 1 });
    const user = await User.findById(req.userId).populate('unlockedRewards');
    
    const rewardsWithStatus = rewards.map(reward => ({
      ...reward.toObject(),
      isUnlocked: user.unlockedRewards.some(ur => ur._id.equals(reward._id)),
      canUnlock: user.karmaScore >= reward.karmaRequired
    }));

    res.json(rewardsWithStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:rewardId/unlock', auth, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.rewardId);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    const user = await User.findById(req.userId);
    
    if (user.karmaScore < reward.karmaRequired) {
      return res.status(400).json({ message: 'Insufficient karma score' });
    }

    if (user.unlockedRewards.includes(reward._id)) {
      return res.status(400).json({ message: 'Reward already unlocked' });
    }

    user.unlockedRewards.push(reward._id);
    await user.save();

    res.json({ message: 'Reward unlocked successfully', reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const rewards = [
      {
        title: '5% Cashback',
        description: 'Get 5% cashback on all purchases for a month',
        karmaRequired: 100,
        category: 'cashback'
      },
      {
        title: 'Premium Support',
        description: 'Access to premium customer support',
        karmaRequired: 150,
        category: 'feature'
      },
      {
        title: 'Credit Score Boost Badge',
        description: 'Show off your excellent credit behavior',
        karmaRequired: 200,
        category: 'badge'
      },
      {
        title: '10% Shopping Discount',
        description: 'Get 10% off on partner stores',
        karmaRequired: 250,
        category: 'discount'
      },
      {
        title: 'VIP Status',
        description: 'Unlock VIP features and benefits',
        karmaRequired: 500,
        category: 'feature'
      }
    ];

    await Reward.deleteMany({});
    await Reward.insertMany(rewards);
    
    res.json({ message: 'Rewards seeded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;