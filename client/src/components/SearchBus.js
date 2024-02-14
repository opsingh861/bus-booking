"use client"

import axios from 'axios';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const getDay = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

const SearchBus = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date());

  const handleSearch = () => {
    
    const [busNumber, busName, distance, travelTime,eta] = axios.get(`/user/browseAvailableBuses?source=${source}&destination=${destination}&day=${"Monday"}`)
    console.log(busNumber, busName, distance, travelTime, eta)
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Search Buses</h2>
      <div className="mb-4">
        <label htmlFor="source" className="block mb-2">Source:</label>
        <input
          type="text"
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full border rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="destination" className="block mb-2">Destination:</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block mb-2">Date:</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full border rounded-md p-2"
        />
      </div>
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Search</button>
    </div>
  );
};

export default SearchBus;
