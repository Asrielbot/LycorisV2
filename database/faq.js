// database/faq.js
import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  content: { type: String, required: true },
});

export default mongoose.model("FAQ", faqSchema);
