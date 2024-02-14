import Bus from '../models/busModel.js';

export const browseAvailableBuses = async (req, res) => {
    try {
        const { source, destination } = req.query;

        // Query the database for buses that cover the specified route
        const buses = await Bus.find({
            'stops.location': { $all: [source, destination] }
        });

        // Calculate distance and ETA for each bus 
        const busesWithInfo = buses.map(bus => {
            const sourceIndex = bus.stops.findIndex(stop => stop.location === source);
            console.log(bus.stops[sourceIndex]);
            const destinationIndex = bus.stops.findIndex(stop => stop.location === destination);
            console.log(bus.stops[destinationIndex]);
            const distance = bus.stops[destinationIndex].distanceTillNow - bus.stops[sourceIndex].distanceTillNow;
            console.log(distance);
            const travelTime = bus.stops[destinationIndex].travelTimeTillNow - bus.stops[sourceIndex].travelTimeTillNow;
            console.log(travelTime);
            const speed = distance / travelTime;
            const timeToReachDestination = distance / speed; // in minutes
            const eta = new Date(Date.now() + timeToReachDestination * 60000).toLocaleTimeString();
            return {
                busNumber: bus.busNumber,
                busName: bus.busName,
                distance,
                travelTime,
                eta
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

