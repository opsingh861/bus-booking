import mongoose from 'mongoose';


const stopSchema = new mongoose.Schema({
    location: { type: String, required: true },
    sequence: { type: Number, required: true },
    distanceTillNow: { type: Number, required: true }, // Distance from initial point till this stop in km
    travelTimeTillNow: { type: Number, required: true } // Travel time from initial point till this stop in minutes
});


const busSchema = new mongoose.Schema({
    busNumber: { type: String, required: true, unique: true }, // Unique bus number, we can give the number plate of the bus
    busName: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    seatingPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'BusSchedule' },
    availableDays: [String],
    stops: [stopSchema] // Array of stops in the route
});

const Bus = mongoose.model('Bus', busSchema);

export default Bus;
