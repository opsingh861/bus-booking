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

export const addStop = async (req, res) => {

    try {
        const { busNumber, location, sequence, distanceFromPreviousStop, travelTimeFromPreviousStop } = req.body;
        // if(!busNumber || !location || !sequence || !distanceFromPreviousStop || !travelTimeFromPreviousStop) {
        //     return res.status(400).json({ message: 'All fields are required', success: false });
        // }
        const bus = await Bus.findOne({ busNumber });
        if (!bus) {
            return res.status(400).json({ message: 'Bus does not exist', success: false });
        }
        const n = bus.stops.length;
        let distanceTillNow = 0;
        let travelTimeTillNow = 0;
        if (n > 0) {
            distanceTillNow = bus.stops[n - 1].distanceTillNow + distanceFromPreviousStop;
            travelTimeTillNow = bus.stops[n - 1].travelTimeTillNow + travelTimeFromPreviousStop;
        }
        const newStop = {
            location,
            sequence,
            distanceTillNow, // using this we can save a extra loop for traversing and calculating the distance
            travelTimeTillNow
        };
        bus.stops.push(newStop);
        await bus.save();
        res.status(201).json({ message: 'Stop added successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

}


export const addSeat = async (req, res) => {
    try {
        const { busNumber, seatNumber, date } = req.body;

        // Check if busNumber, seatNumber, and date are provided
        if (!busNumber || !seatNumber || !date) {
            return res.status(400).json({ message: 'Bus number, seat number, and date are required', success: false });
        }

        // Find the bus by busNumber
        const bus = await Bus.findOne({ busNumber });

        // If bus not found, return error
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found', success: false });
        }

        // Ensure bus.schedule is initialized as an empty array
        if (!bus.schedule) {
            bus.schedule = [];
        }

        // Increase occupancy and initialize seats if not done already
        if (!bus.currentOccupancy) {
            bus.currentOccupancy = 1;
        } else {
            bus.currentOccupancy++;
        }

        // Initialize seats if not done already
        if (!bus.stops.length) {
            const totalSeats = bus.totalSeats;
            for (let i = 1; i <= totalSeats; i++) {
                bus.stops.push({
                    seatNumber: i,
                    isBooked: false
                });
            }
        }

        // Find schedule entry for the specified date or create one if not found
        let scheduleEntry = bus.schedule.find(entry => entry.date.toISOString().split('T')[0] === date);

        if (!scheduleEntry) {
            scheduleEntry = {
                date: new Date(date),
                seats: []
            };
            bus.schedule.push(scheduleEntry);
        }

        console.log('Schedule entry:', scheduleEntry);

        // Find the seat by seatNumber and mark it as booked
        const seat = scheduleEntry.seats.find(s => s.seatNumber === seatNumber);

        console.log('Seat:', seat);

        if (!seat) {
            return res.status(404).json({ message: 'Seat not found', success: false });
        }

        if (seat.isBooked) {
            return res.status(400).json({ message: 'Seat is already booked', success: false });
        }

        seat.isBooked = true;

        // Save the changes to the bus
        await bus.save();

        res.status(200).json({ message: 'Seat marked as booked successfully', success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


