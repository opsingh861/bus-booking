import express from 'express';
import * as authController from '../controller/authController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the auth route');
});

router.post('/signup', authController.signup);
router.post('/signupAdmin', authController.signupAdmin);
router.post('/loginUser', authController.loginUser);
router.post('/loginAdmin', authController.loginAdmin);

export default router;