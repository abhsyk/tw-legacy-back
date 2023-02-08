import express from 'express';
import { createPost, setUserId } from '../controllers/post';

const router = express.Router();

router.post('/', setUserId, createPost);

export default router;
