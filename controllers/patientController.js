const Patient = require('../models/Patient');

exports.createPatient = async (req, res) => {
  const newPatient = new Patient(req.body);
  await newPatient.save();
  res.status(201).send(newPatient);
};

exports.getPatients = async (req, res) => {
  const patients = await Patient.find();
  res.send(patients);
};

exports.getPatient = async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).send('Patient not found');
  res.send(patient);
};

exports.getPatientById = async (id) => {
  const patient = await Patient.findById(id);
  if (!patient) throw new Error('Patient not found');
  return patient;
};

exports.updatePatient = async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!patient) return res.status(404).send('Patient not found');
  res.send(patient);
};

exports.deletePatient = async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);
  if (!patient) return res.status(404).send('Patient not found');
  res.send('Patient deleted');
};
