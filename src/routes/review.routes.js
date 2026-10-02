import {Router} from 'express';
import {createReview, getReviews, getReviewById, updateReview, deleteReview} from '../controllers/review.controller.js';

const router = Router();

router.post('/', createReview);
router.get('/', getReviews);
router.get('/:reviewId', getReviewById);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

export default router;