import mongoose from 'mongoose';

const seat = new mongoose.Schema({
    seatNumber: { type: Number, required: true },
    isBooked: { type: Boolean, default: false }
});


const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    seatBooked: [seat],
    bookingDate: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;