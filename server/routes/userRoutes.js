import express from 'express';
import * as userController from '../controller/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the user route');
});

router.get('/browseAvailableBuses', userController.browseAvailableBuses);
router.get('/getBusDetails', userController.getBusDetails);
router.get('/getSittingPlan', userController.getSittingPlan);
router.post('/bookSeat', userController.bookSeat);
router.post('/cancelBooking', userController.cancelBooking);

export default router;