const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Behavior = require('../models/Behavior');

// Get dashboard analytics data (Admin only)
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get all users for leaderboard
    const allUsers = await User.find()
      .select('username email karmaScore createdAt')
      .sort({ karmaScore: -1 });
    
    // Calculate average karma score
    const avgKarmaScore = allUsers.length > 0 
      ? Math.round(allUsers.reduce((sum, user) => sum + user.karmaScore, 0) / allUsers.length)
      : 0;
    
    // Get behavior statistics
    const behaviorStats = await Behavior.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalKarma: { $sum: '$karmaPoints' }
        }
      }
    ]);
    
    // Get karma distribution (for histogram)
    const karmaRanges = [
      { range: '0-50', min: 0, max: 50 },
      { range: '51-100', min: 51, max: 100 },
      { range: '101-250', min: 101, max: 250 },
      { range: '251-500', min: 251, max: 500 },
      { range: '500+', min: 501, max: Infinity }
    ];
    
    const karmaDistribution = karmaRanges.map(range => {
      const count = allUsers.filter(user => 
        user.karmaScore >= range.min && user.karmaScore <= range.max
      ).length;
      return {
        range: range.range,
        count: count,
        percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
      };
    });
    
    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = await Behavior.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          count: { $sum: 1 },
          karmaChange: { $sum: '$karmaPoints' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get top performers (users with most karma gained in last 30 days)
    const topPerformers = await Behavior.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo },
          karmaPoints: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$userId',
          karmaGained: { $sum: '$karmaPoints' },
          behaviorCount: { $sum: 1 }
        }
      },
      {
        $sort: { karmaGained: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          username: '$user.username',
          karmaGained: 1,
          behaviorCount: 1
        }
      }
    ]);
    
    res.json({
      summary: {
        totalUsers,
        avgKarmaScore,
        totalBehaviors: await Behavior.countDocuments(),
        activeUsers: topPerformers.length
      },
      leaderboard: allUsers,
      behaviorStats,
      karmaDistribution,
      recentActivity,
      topPerformers
    });
    
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;