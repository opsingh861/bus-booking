import express from 'express';
import * as adminController from '../controller/adminController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the admin route');
});

router.post('/addBus', adminController.addBus); 
router.post('/addStop', adminController.addStop);
router.post('/addSeat', adminController.addSeat);

export default router;
