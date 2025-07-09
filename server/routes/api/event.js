const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require("path");
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const Event = require('../../models/event');
const Ticket = require('../../models/ticket');
const { updateEventStatus } = require("../../utils/event");
const { deleteFilesFromPath } = require("../../utils/deleteFiles");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/file_manager/uploads/events");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const removeImagesFromEvent = (event, removeImageUrls) => {
  if (!event || !Array.isArray(event.imageUrls)) return event;

  const normalizedPaths = removeImageUrls.map(url => {
    const parts = url.split('/api/');
    return '/' + parts[1] || url;
  });

  event.imageUrls = event.imageUrls.filter(imagePath => {
    return !normalizedPaths.includes(imagePath.replace(/\\/g, '/'));
  });

  return event;
}

// fetch all events for everyone
router.get('/all_event', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate('tickets')
      .populate({
        path: 'user',
        populate: {
          path: 'organizer',
        },
      })
      .sort('-createdAt');
    for (let event of events) {
      updateEventStatus(event);
      await event.save();
    }
    return res.status(200).json({ events });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
    });
  }
});

router.get('/fetch_slug/:slug', async(req, res) => {
  try {
    const slug = req.params.slug;
    if (!slug) {
      return res.status(404).json({
        error: "event doesn't exist"
      })
    }
    const event = await Event.findOne({slug})
      .populate('tickets')
      .populate({
        path: 'user',
        populate: {
          path: 'organizer',
        },
      });
      if (event) {
        updateEventStatus(event);
        await event.save(); 
        return res.status(200).json({ event });
      }
      else {
        return res.status(201).json()
      }

  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
    });
  }
})


// GET /event/me - return events based on user role
router.get(
  '/me',
  auth,
  async (req, res) => {
    try {
      const user = req.user;

      let events;

      if (user.role === ROLES.Admin) {
        // Admin: get events created by the user
        events = await Event.find({ user: user._id }).sort('-createdAt');
      } else if (user.role === ROLES.Member) {
        // Normal user: get events where they're an attendee
        events = await Event.find({
          registeredAttendees: user._id
        }).sort('-createdAt');
      }
      for (let event of events) {
        updateEventStatus(event);
        await event.save();
      }
      return res.status(200).json({ events });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.post(
  '/add',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  upload.array('images', 6),
  async (req, res) => {
    try {
      const {
        name,
        description,
        startDate,
        endDate,
        location,
        category,
        capacity,
        isActive,
        tickets = [],
        visibility
      } = req.body;

      const user = req.user._id;
      const files = req.files;

      if (!name || !description || !startDate || !endDate || !location || !category) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'At least one image file is required.' });
      }

      const existingEvent = await Event.findOne({ name });
      if (existingEvent) {
        files.forEach(file => {
          deleteFilesFromPath([`/uploads/event/${file.filename}`]);
        });
        return res.status(400).json({ error: 'An event with this name already exists.' });
      }

      // const imageUrl = `/uploads/${file.filename}`;
      const imageUrls = files.map((file) => `/uploads/events/${file.filename}`);

      const event = new Event({
        name,
        description,
        startDate,
        endDate,
        location,
        category,
        capacity: capacity || null,
        isActive: isActive !== undefined ? isActive : true,
        visibility: visibility !== undefined ? visibility : false,
        imageUrls,
        user,
        tickets
      });

      updateEventStatus(event);

      await event.save();

      return res.status(200).json({
        success: true,
        message: 'Event has been added successfully!',
        event
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// GET /events
router.get(
  '/',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      let events;

      if (req.user.role === ROLES.Organizer) {
        // Organizer: only return their own events
        events = await Event.find({ user: req.user._id }).sort('-createdAt');
      } else {
        // Admin: return all events
        events = await Event.find()
          .populate({
            path: 'user',
            populate: {
              path: 'organizer',
              model: 'Organizer',
            }
          }
        )
        .sort('-createdAt');
      }
      for (let event of events) {
        updateEventStatus(event);
        await event.save();
      }
      return res.status(200).json({ events });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.get(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await Event.findById(eventId)
      .populate('tickets')
      .populate('user');

      // Optional: If Organizer, only allow access to their own event
      if (req.user.role === ROLES.Organizer && !event.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }
      updateEventStatus(event);
      await event.save(); 
      return res.status(200).json({ event });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);


router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  upload.array('images', 6),
  async (req, res) => {
    try {
      const eventId = req.params.id;
      let {
        name,
        description,
        startDate,
        endDate,
        location,
        category,
        capacity,
        isActive,
        removeImage,
        visibility
      } = req.body;

      const files = req.files;
      if (!Array.isArray(removeImage)) { removeImage = Array(removeImage) }

      // Validate required fields if necessary
      if (!name || !description || !startDate || !endDate || !location || !category) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      // Find the event by id
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      // Organizer can only update their own events
      if (req.user.role === ROLES.Organizer && !event.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      // Update event fields
      event.name = name;
      event.description = description;
      event.startDate = startDate;
      event.endDate = endDate;
      event.location = location;
      event.category = category;
      event.capacity = capacity || null;
      event.isActive = isActive !== undefined ? isActive : event.isActive;
      event.visibility = visibility !== undefined ? visibility : event.visibility

      if (!removeImage.includes(undefined) && removeImage.length > 0) {
        removeImagesFromEvent(event, removeImage);
          const normalizedPaths = removeImage.map(url => {
            const parts = url.split('/api/');
            return '/' + parts[1] || url;
          });
        deleteFilesFromPath(normalizedPaths)
      }

      // If new images are uploaded, replace imageUrls
      if (files && files.length > 0) {
        const newImagePaths = files.map(file => `/uploads/events/${file.filename}`);
        event.imageUrls = [...event.imageUrls, ...newImagePaths];
      }

      // Update status using your utility
      updateEventStatus(event);

      await event.save();

      return res.status(200).json({
        success: true,
        message: 'Event updated successfully!',
        event
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.post(
  '/add-ticket',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      let { event, type, price, discount, quantity, discountPrice, coupons } = req.body;
      const user = req.user._id;

      if (!event || !type || price == null) {
        return res.status(400).json({
          success: false,
          message: 'Event, ticket type, and price are required.'
        });
      }

      const eventExists = await Event.findById(event);

      if (!eventExists) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }


      if (eventExists) {
        coupons = coupons.map((e) => e.value);

       const ticket = new Ticket({
          type,
          user,
          price,
          quantity,
          discount: discount || false,
          discountPrice: discountPrice || 0,
          coupons: coupons || []
        });
      
        const savedTicket = await ticket.save();
        eventExists.tickets.push(ticket._id);
        await eventExists.save()

        return res.status(200).json({
        success: true,
        message: 'Ticket has been added to event',
        ticket: savedTicket
      }); 
    }

    } catch (error) {
      console.log(error)
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
)


router.delete(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const eventId = req.params.id;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      // Organizer can only delete their own events
      if (req.user.role === ROLES.Organizer && !event.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      deleteFilesFromPath(event.imageUrls)
      await event.deleteOne();

      return res.status(200).json({
        success: true,
        message: 'Event deleted successfully!'
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);


module.exports = router;
