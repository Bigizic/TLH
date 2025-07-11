const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const User = require('../../models/user');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');

// search users api
router.get('/search', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { search } = req.query;

    const regex = new RegExp(search, 'i');

    const users = await User.find(
      {
        $or: [
          { name: { $regex: regex } },
          { userName: { $regex: regex } },
          { email: { $regex: regex } }
        ]
      },
      { password: 0, _id: 0 }
    ).populate('organizer', 'companyName');

    return res.status(200).json({
      users
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch users api
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({}, { password: 0, _id: 0, googleId: 0 })
      .sort('-created')
      .populate('organizer', 'companyName')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments();

    return res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


// return all users
router.get('/all_users', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user._id;
    // const userDoc = await User.findById(user, { password: 0 })
    const userDoc = await User.findById(user, { password: 0 }).populate({
      path: 'organizer',
      model: 'Organizer',
    });

    return res.status(200).json({
      user: userDoc
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const user = req.user._id;
    const update = req.body.profile;
    const query = { _id: user };

    const userDoc = await User.findOneAndUpdate(query, update, {
      new: true
    });

    return res.status(200).json({
      success: true,
      message: 'Your profile is successfully updated!',
      user: userDoc
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get('/:id', async(req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const user = await User.findById(id).populate('organizer')
      if (user) {
        return res.status(200).json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        })
      }
    } else {
      throw new Error()
    }
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    })
  }
})

module.exports = router;
