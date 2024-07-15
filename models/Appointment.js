const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
