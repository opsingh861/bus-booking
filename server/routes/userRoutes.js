import express from 'express';
import * as userController from '../controller/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the user route');
});

router.get('/browseAvailableBuses', userController.browseAvailableBuses);
router.get('/getBusDetails', userController.getBusDetails);

export default router;