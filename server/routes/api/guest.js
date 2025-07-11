const express = require('express');
const router = express.Router();
const Guest = require('../../models/guest');
const auth = require('../../middleware/auth');

// Create a new guest profile
router.post('/add', async (req, res) => {
  try {
    const { email, name, eventId, ticketId } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'No email provided' });
    }
    if (!name) {
        return res.status(40).json({ error: 'No email provided' })
    }
    if (!eventId || !ticketId) {
        return res.status(400).json({ error: 'No event details provided' })
    }

    const guest = new Guest({
        email,
        name,
        eventId,
        ticketId
    })
     
    await guest.save();
    
    return res.status(200).json({
      success: true,
      guest
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Could not create guest. Please try again.'
    });
  }
});

router.get('/:id', async(req, res) => {
    try {
    const id = req.params.id;
    if (id) {
      const user = await Guest.findById(id)
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
