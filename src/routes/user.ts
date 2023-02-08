import express from 'express';
import { login, logout, protect, register } from '../controllers/auth';
import { currentUser, getUser } from '../controllers/user';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/user/:username', getUser);

router.use(protect);

router.get('/current-user', currentUser);

export default router;
