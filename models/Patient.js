const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  address: String,
  phone: String,
  email: { type: String, required: true, unique: true },
  medicalHistory: [{
    date: { type: Date, default: Date.now },
    diagnosis: String,
    treatment: String,
    documents: [String]  // URLs of uploaded documents
  }]
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
