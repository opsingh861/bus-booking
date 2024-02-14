import Bus from '../models/busModel.js';
import BusSchedule from '../models/busScheduleModel.js';

export const addBus = async (req, res) => {
    try {
        let { busNumber, busName, totalSeats, availableDays } = req.body;

        // Check if all required fields are provided
        if (!busNumber || !busName || !totalSeats || !availableDays) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        // Check if totalSeats is valid
        if (totalSeats <= 0) {
            return res.status(400).json({ message: 'Total seats must be greater than 0', success: false });
        }

        // Check if the busNumber already exists
        busNumber = busNumber.toLowerCase();
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

        res.status(201).json({ message: 'Bus added successfully', success: true});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addStop = async (req, res) => {

    try {
        let { busNumber, location, sequence, distanceFromPreviousStop, travelTimeFromPreviousStop } = req.body;

        busNumber = busNumber.toLowerCase();
        const bus = await Bus.findOne({ busNumber });
        if (!bus) {
            return res.status(400).json({ message: 'Bus does not exist', success: false });
        }
        const n = bus.stops.length;
        let distanceTillNow = 0;
        let travelTimeTillNow = 0;
        location = location.toLowerCase();
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
        res.status(201).json({ message: 'Stop added successfully', success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

}


export const addSeat = async (req, res) => {
    try {
        let { busNumber, seatNumber, date } = req.body;

        // Check if busNumber, seatNumber, and date are provided
        if (!busNumber || !seatNumber || !date) {
            return res.status(400).json({ message: 'Bus number, seat number, and date are required', success: false });
        }
        busNumber = busNumber.toLowerCase();

        // Find the bus by busNumber
        const bus = await Bus.findOne({ busNumber });
        // console.log(bus.seatingPlan);

        // If bus not found, return error
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found', success: false });
        }

        // Parse the date string into a Date object

        const busSchedule = await BusSchedule.findOne({ busNumber });
        // console.log(busSchedule);


        let scheduleList = busSchedule.schedule;
        // console.log(scheduleList);
        let dateIndex = -1;
        for (let i = 0; i < scheduleList.length; i++) {
            if (scheduleList[i].date === date) {
                dateIndex = i;
                break;
            }
        }
        if (dateIndex === -1) {
            // iterate and create seat array equal to the total seats in the bus

            let seats = [];
            for (let i = 0; i < bus.totalSeats; i++) {
                seats.push({ seatNumber: i + 1, isBooked: false });
            }

            scheduleList.push({ date, seats: seats });
            dateIndex = scheduleList.length - 1;
        }
        let seats = scheduleList[dateIndex].seats;
        let seatIndex = seatNumber - 1;
        if (seats[seatIndex].isBooked) {
            return res.status(400).json({ message: 'Seat already booked', success: false });
        }
        seats[seatIndex].isBooked = true;
        await busSchedule.save();

        res.status(200).json({ message: 'Seat marked as booked successfully', success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
