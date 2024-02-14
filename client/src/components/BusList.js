
const BusList = ({ busNumber, busName, distance, travelTime, eta }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-2">{busName}</h3>
            <p className="text-gray-600 mb-1">Bus Number: {busNumber}</p>
            <p className="text-gray-600 mb-1">Distance: {distance} km</p>
            <p className="text-gray-600 mb-1">Travel Time: {travelTime} minutes</p>
            <p className="text-gray-600">Estimated Time of Arrival: {eta}</p>
        </div>
    );
};

export default BusList;
