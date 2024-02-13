import Bus from '../models/busModel.js';
import BusSchedule from '../models/busScheduleModel.js';

export const addBus = async (req, res) => {
    try {
        const { busNumber, busName, totalSeats, availableDays } = req.body;

        // Check if all required fields are provided
        if (!busNumber || !busName || !totalSeats || !availableDays) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        // Check if totalSeats is valid
        if (totalSeats <= 0) {
            return res.status(400).json({ message: 'Total seats must be greater than 0', success: false });
        }

        // Check if the busNumber already exists
        const existingBus = await Bus.findOne({ busNumber });
        if (existingBus) {
            return res.status(400).json({ message: 'Bus already exists', success: false });
        }

        // Create a new bus
        const newBus = new Bus({
            busNumber,
            busName,
            totalSeats,
            availableDays
        });

        // Create a new bus schedule with the provided busNumber
        const newBusSchedule = new BusSchedule({
            busNumber,
            schedule: []
        });

        // Save the new bus schedule
        await newBusSchedule.save();

        // Assign the bus schedule to the bus
        newBus.seatingPlan = newBusSchedule._id;

        // Save the new bus
        await newBus.save();

        res.status(201).json({ message: 'Bus added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
