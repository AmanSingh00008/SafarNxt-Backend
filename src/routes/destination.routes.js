import {Router} from 'express';
import {getDestinations, getDestinationById, createDestination, updateDestination, deleteDestination} from '../controllers/destination.controller.js';

const router = Router();

// Get all destinations
router.get('/', getDestinations);
router.get('/:id', getDestinationById);
// Create a new destination
router.post('/', createDestination);
// Update a destination
router.put('/:id', updateDestination);
// Delete a destination
router.delete('/:id', deleteDestination);

export default router;