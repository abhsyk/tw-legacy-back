import express from 'express';
import { protect } from '../controllers/auth';
import { createPost, getAllPosts, setUserId } from '../controllers/post';

const router = express.Router();

router.use(protect);

router.get('/', getAllPosts);

router.post('/', setUserId, createPost);

export default router;
