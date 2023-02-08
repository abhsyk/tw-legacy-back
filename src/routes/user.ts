import express from 'express';
import { currentUser, login, protect, register } from '../controllers/user';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use(protect);

router.get('/current-user', currentUser);

export default router;
