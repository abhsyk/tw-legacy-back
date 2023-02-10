import express from 'express';
import { protect } from '../controllers/auth';
import {
  createPost,
  getAllPosts,
  getPost,
  repost,
  setUserId,
} from '../controllers/post';

const router = express.Router();

router.use(protect);

router.get('/', getAllPosts);
router.get('/:postId', getPost);
router.get('/:userId/posts', getAllPosts);

router.post('/repost', repost);
router.post('/', setUserId, createPost);

export default router;