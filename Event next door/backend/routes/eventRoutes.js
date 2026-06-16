import express from 'express';
import * as eventController from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes
router.post('/', protect, authorize('admin'), eventController.createEvent);
router.put('/:id', protect, authorize('admin'), eventController.updateEvent);
router.delete('/:id', protect, authorize('admin'), eventController.deleteEvent);

export default router;