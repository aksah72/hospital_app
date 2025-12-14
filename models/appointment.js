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
    ref: "User",   // 👈 must match your User model name
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
