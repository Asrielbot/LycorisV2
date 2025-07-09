// database/models/EDT.js
import mongoose from "mongoose";

const EDTSchema = new mongoose.Schema({
  Week: {
    type: String,
    required: true,
  },
  Position: {
    type: String,
    required: true,
  },
  Text: {
    type: String,
    required: true,
  },
});

export default mongoose.model("EDT", EDTSchema, "EDT"); 