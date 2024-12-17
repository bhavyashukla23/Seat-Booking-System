const {Seat} = require("../model/seat.model"); 

// GET route 
const getSeats = async (req, res) => {
  try {
    const allSeats = await Seat.find().sort({ seatNumber: 1 });
    res.status(200).send(allSeats);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching seats", error });
  }
};

// A PATCH request at "/seats/book" to reserve/book the seat
const bookTickets = async (req, res) => {
  try {
    const requiredSeats = req.body.seats;
    console.log(requiredSeats);
    if (!requiredSeats || requiredSeats <= 0) {
      return res.status(400).send({ message: "Invalid number of seats requested." });
    }

    const allSeats = await Seat.find().sort({ seatNumber: 1 });
    let reserved = [];
    let i = 0;

    while (i < allSeats.length) {
      let empty = 0;
      let startIndex = -1;

      for (let j = i; j < i + 7 && j < allSeats.length; j++) {
        if (!allSeats[j].isBooked) {
          empty++;
          if (startIndex === -1) startIndex = j;
        }
      }

      if (empty >= requiredSeats) {
        for (let j = startIndex; j < startIndex + requiredSeats; j++) {
          reserved.push(allSeats[j].seatNumber);
          await Seat.findByIdAndUpdate(allSeats[j]._id, { isBooked: true });
        }
        break;
      } else {
        i += 7;
      }
    }

    if (reserved.length === requiredSeats) {
      res.status(200).send(reserved);
    } else {
      const availableSeats = await Seat.find({ isBooked: false }).sort({ seatNumber: 1 });

      if (availableSeats.length < requiredSeats) {
        return res.status(400).send({ message: "Sorry, not enough seats available." });
      }

      let differences = [];
      for (let a = 0; a <= availableSeats.length - requiredSeats; a++) {
        const first = availableSeats[a].seatNumber;
        const last = availableSeats[a + requiredSeats - 1].seatNumber;
        differences.push(last - first);
      }

      const leastDifference = Math.min(...differences);
      const startIndex = differences.indexOf(leastDifference);

      for (let j = startIndex; j < startIndex + requiredSeats; j++) {
        reserved.push(availableSeats[j].seatNumber);
        await Seat.findByIdAndUpdate(availableSeats[j]._id, { isBooked: true });
      }
      console.log("seat reserved");
      res.status(200).send(reserved);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error booking seats", error });
  }
};

// A PATCH request at "/seats/reset" to reset all seats' status to available
const resetAvailableSeats = async (req, res) => {
  try {
    await Seat.updateMany({ isBooked: true }, { isBooked: false });
    res.status(200).send({ message: "All seats are now available for booking." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error resetting seats", error });
  }
};

module.exports = { resetAvailableSeats, bookTickets, getSeats };
