const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  specialty: { type: String, required: true },
  schedule: [String],  // E.g. ['Monday 9:00-17:00', 'Tuesday 9:00-17:00']
  appointments: [{
    patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
    date: Date,
    reason: String
  }]
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
