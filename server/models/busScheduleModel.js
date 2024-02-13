import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
    seatNumber: { type: Number, required: true },
    isBooked: { type: Boolean, default: false }
});

const scheduleSchema = new mongoose.Schema({
    date: { type: Date },
    seats: [seatSchema]
});

const busScheduleSchema = new mongoose.Schema({
    schedule: [scheduleSchema]
});

const BusSchedule = mongoose.model('BusSchedule', busScheduleSchema);

export default BusSchedule;
