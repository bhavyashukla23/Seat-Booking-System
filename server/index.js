const express = require('express');
const cors = require('cors');
const { connectDB } = require("./config/db"); 
const { router } = require("./routes/seat.routes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/seats", router);

const PORT = process.env.PORT || 5000;  
app.listen(PORT, async () => {
  try {
    await connectDB();  
    console.log("DB is connected");
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
