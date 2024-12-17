import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Seat from './seats/Seats'; 
import './App.css';

const App = () => {
  const [seats, setSeats] = useState([]); // Initialize seats as an empty array
  const [requiredSeats, setRequiredSeats] = useState(1);
  const [reservedSeats, setReservedSeats] = useState([]); // Tracks booked seats
  const [message, setMessage] = useState('');

  // Fetch seat data when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/seats')
      .then((response) => {
        console.log('Fetched Seats:', response.data); 
        setSeats(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error('Error fetching seats:', error);
        setMessage('Error fetching seat data.');
      });
  }, []);

  // Function to handle seat booking
  const handleBookSeats = () => {
    if (requiredSeats <= 0) {
      setMessage('Please select a valid number of seats.');
      return;
    }

    axios.post('http://localhost:5000/seats/book', { seats: requiredSeats })
      .then((response) => {
        console.log('Booked Seats:', response.data);
        setMessage('Seats booked successfully!');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error booking seats:', error);
        setMessage(error.response?.data?.message || 'Error booking seats.');
      });
  };

  // Function to reset all seats
  const handleResetSeats = () => {
    axios.patch('http://localhost:5000/seats/reset')
      .then((response) => {
        console.log('Reset Seats:', response.data);
        setSeats(Array.isArray(response.data) ? response.data : []);
        setReservedSeats([]); 
        setMessage('All seats have been reset and are available for booking.');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error resetting seats:', error);
        setMessage('Error resetting seats.');
      });
  };

  return (
    <div className="App">
      <h1>Seat Booking System</h1>
      <div className="controls">
        <input
          type="number"
          value={requiredSeats}
          min="1"
          max="7"
          onChange={(e) => setRequiredSeats(Number(e.target.value))}
        />
        <button onClick={handleBookSeats}>Book Seats</button>
        <button onClick={handleResetSeats}>Reset Seats</button>
      </div>
      {message && <p>{message}</p>}

      {/* Seats Container */}
      <div className="seats-container">
        {Array.isArray(seats) && seats.length > 0 ? (
          seats.map((seat) => (
            <Seat key={seat.seatNumber} seat={seat} />
          ))
        ) : (
          <p>No seats available.</p>
        )}
      </div>
    </div>
  );
};

export default App;

