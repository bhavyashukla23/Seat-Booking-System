import React from 'react';
import './Seats.css';

const Seat = ({ seat }) => {
  return (
    <div className={`seat ${seat.isBooked ? 'booked' : 'available'}`}>
      <span>Seat</span>
      {seat.isBooked ? <span> (Booked)</span> : <span> (Available)</span>}
    </div>
  );
};

export default Seat;
