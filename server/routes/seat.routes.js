const express = require("express");
const router = express.Router();

const { resetAvailableSeats, bookTickets, getSeats } = require("../controller/seat.controller");
const { checkCount } = require("../middleware/count");

router.get("/", getSeats);
router.post("/book", checkCount, bookTickets);
router.patch("/reset", resetAvailableSeats);

module.exports = {router};  
