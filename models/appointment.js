/*const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  doctor: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
*/
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientName: String,
  patientEmail: String,
  doctor: String,
  date: String,
  time: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// 🚫 No two appointments for same doctor + date + time
appointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  { unique: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
