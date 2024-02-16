import Bus from '../models/busModel.js';
import BusSchedule from '../models/busScheduleModel.js';

export const browseAvailableBuses = async (req, res) => {
    try {
        let { source, destination, day } = req.query;
        if (!source || !destination) {
            return res.status(400).json({ message: 'Source and destination are required', success: false });
        }
        if (source === destination) {
            return res.status(400).json({ message: 'Source and destination cannot be the same', success: false });
        }
        // Query the database for buses that cover the specified route
        source = source.toLowerCase();
        destination = destination.toLowerCase();
        const buses = await Bus.find({
            'stops.location': { $all: [source, destination] }
        });

        // Calculate distance and ETA for each bus 
        const busesWithInfo = buses.map(bus => {
            const sourceIndex = bus.stops.findIndex(stop => stop.location === source);

            const destinationIndex = bus.stops.findIndex(stop => stop.location === destination); // we are checking if source is behind destination in the sequence

            if (bus.stops[sourceIndex].sequence > bus.stops[destinationIndex].sequence) { // right now we are not considering for the bus coming back to initial stop
                return res.status(404).json({ message: 'Bus not found', success: false });
            }

            if (bus.availableDays.indexOf(day) === -1) { // checking if the bus is available on the specified day
                return res.status(404).json({ message: 'Bus not found', success: false });
            }

            let distance = bus.stops[destinationIndex].distanceTillNow - bus.stops[sourceIndex].distanceTillNow;
            distance = Math.abs(distance);
            let travelTime = bus.stops[destinationIndex].travelTimeTillNow - bus.stops[sourceIndex].travelTimeTillNow;
            travelTime = Math.abs(travelTime);
            const occupancy = bus.currentOccupancy;
            const totalSeats = bus.totalSeats;
            console.log(totalSeats);
            const percentageOccupancy = (occupancy / totalSeats) * 100;


            const speed = distance / travelTime;
            const timeToReachDestination = distance / speed; // in minutes
            const eta = new Date(Date.now() + timeToReachDestination * 60000).toLocaleTimeString();
            return {
                busNumber: bus.busNumber,
                busName: bus.busName,
                distance,
                travelTime,
                eta,
                percentageOccupancy
            };
            
        });

        res.status(200).json({
            message: 'Available buses retrieved successfully',
            buses: busesWithInfo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBusDetails = async (req, res) => {
    try {
        let { busNumber } = req.query;
        if (!busNumber) {
            return res.status(400).json({ message: 'Bus number is required', success: false });
        }
        // Query the database for the specified bus
        busNumber = busNumber.toLowerCase();
        const bus = await Bus.findOne({ busNumber });

        // If bus not found, return error
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found', success: false });
        }

        res.status(200).json({
            message: 'Bus details retrieved successfully',
            bus
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSittingPlan = async (req, res) => {
    try {
        const { busNumber, date } = req.query;

        if (!busNumber || !date) {
            return res.status(400).json({ message: 'Bus number and date are required', success: false });
        }

        const bus = await Bus.findOne({ busNumber });
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found', success: false });
        }
        // console.log(bus);

        const scheduleReq = await BusSchedule.findOne({ busNumber });
        if (!scheduleReq) {
            return res.status(404).json({ message: 'Bus schedule not found', success: false });
        }

        for (let i = 0; i < scheduleReq.schedule.length; i++) {
            if (scheduleReq.schedule[i].date === date) {
                const seats = scheduleReq.schedule[i].seats;
                return res.status(200).json({
                    message: 'Sitting plan retrieved successfully',
                    seats
                });
            }
        }

        return res.status(404).json({ message: 'Bus schedule not found', success: false });

    } catch (error) {
        // Handle any errors
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const bookSeat = async (req, res) => {
    try {
        const { busNumber, date, seatNumber } = req.body;

        const bus = await Bus.findOne({ busNumber });
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found', success: false });
        }

        const scheduleReq = await BusSchedule.findOne({ busNumber });
        if (!scheduleReq) {
            return res.status(404).json({ message: 'Bus schedule not found', success: false });
        }

        for (let i = 0; i < scheduleReq.schedule.length; i++) {
            if (scheduleReq.schedule[i].date === date) {
                const seats = scheduleReq.schedule[i].seats;
                const seat = seats.find(seat => seat.seatNumber == seatNumber);
                if (!seat) {
                    return res.status(404).json({ message: 'Seat not found', success: false });
                }
                if (seat.isBooked) {
                    return res.status(400).json({ message: 'Seat already booked', success: false });
                }
                seat.isBooked = true;`  `
                await scheduleReq.save();
                return res.status(200).json({ message: 'Seat booked successfully', success: true });
            }
        }

        return res.status(404).json({ message: 'Bus schedule not found', success: false });

    } catch (error) {
        // Handle any errors
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { busNumber, date, seatNumber } = req.body;
        if (!busNumber || !date || !seatNumber) {
            return res.status(400).json({ message: 'Bus number, date and seat number are required', success: false });
        }

        const bus = await Bus.findOne({ busNumber });
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found', success: false });
        }

        const scheduleReq = await BusSchedule.findOne({ busNumber });
        if (!scheduleReq) {
            return res.status(404).json({ message: 'Bus schedule not found', success: false });
        }

        for (let i = 0; i < scheduleReq.schedule.length; i++) {
            if (scheduleReq.schedule[i].date === date) {
                const seats = scheduleReq.schedule[i].seats;
                const seat = seats.find(seat => seat.seatNumber == seatNumber);
                if (!seat) {
                    return res.status(404).json({ message: 'Seat not found', success: false });
                }
                if (!seat.isBooked) {
                    return res.status(400).json({ message: 'Seat is already not booked', success: false });
                }
                seat.isBooked = false;
                await scheduleReq.save();
                return res.status(200).json({ message: 'Seat booking cancelled successfully', success: true });
            }
        }

        return res.status(404).json({ message: 'Bus schedule not found', success: false });

    } catch (error) {
        // Handle any errors
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}


