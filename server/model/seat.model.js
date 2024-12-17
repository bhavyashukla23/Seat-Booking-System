const mongoose = require("mongoose");

const seatModel = new mongoose.Schema({
    seatNumber:Number,
    isBooked:{type:Boolean , default:false}
});

const Seat =mongoose.model("Seat", seatModel);

module.exports={Seat};