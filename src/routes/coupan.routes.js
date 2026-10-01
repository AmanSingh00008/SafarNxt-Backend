import {Router} from 'express';
import {getCoupans, getCoupanById, createCoupan, updateCoupan, deleteCoupan} from '../controllers/coupan.controller.js';

const router = Router();

// Get all coupans  
router.get('/', getCoupans);
router.get('/:id', getCoupanById);  
// Create a new coupan
router.post('/', createCoupan);
// Update a coupan
router.put('/:id', updateCoupan);
// Delete a coupan
router.delete('/:id', deleteCoupan);