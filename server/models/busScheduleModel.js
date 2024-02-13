import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    seats: [{
        seatNumber: { type: Number, required: true },
        isBooked: { type: Boolean, default: false }
    }]
});

const busScheduleSchema = new mongoose.Schema({
    busNumber: { type: String, required: true, unique: true },
    schedule: [scheduleSchema]
});

const BusSchedule = mongoose.model('BusSchedule', busScheduleSchema);

export default BusSchedule;
