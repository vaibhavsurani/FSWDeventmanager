// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Get all events
router.get('/', async (req, res) => {
	try {
		const events = await Event.find().populate('organizer', 'name email');
		res.json(events);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Search events
router.get('/search', async (req, res) => {
	try {
		const { query } = req.query;
		const events = await Event.find(
			{ $text: { $search: query } },
			{ score: { $meta: 'textScore' } }
		)
		.sort({ score: { $meta: 'textScore' } })
		.populate('organizer', 'name email');
		
		res.json(events);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get event by ID
router.get('/:id', async (req, res) => {
	try {
		const event = await Event.findById(req.params.id).populate('organizer', 'name email');
		if (!event) {
			return res.status(404).json({ error: 'Event not found' });
		}
		res.json(event);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create new event
router.post('/', auth, async (req, res) => {
	try {
		const event = new Event({
			...req.body,
			organizer: req.user._id
		});
		await event.save();
		res.status(201).json(event);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Update event
router.patch('/:id', auth, async (req, res) => {
	try {
		const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id });
		if (!event) {
			return res.status(404).json({ error: 'Event not found or unauthorized' });
		}

		Object.assign(event, req.body);
		await event.save();
		res.json(event);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
	try {
		const event = await Event.findOneAndDelete({ 
			_id: req.params.id, 
			organizer: req.user._id 
		});
		
		if (!event) {
			return res.status(404).json({ error: 'Event not found or unauthorized' });
		}
		
		res.json({ message: 'Event deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
module.exports = router;