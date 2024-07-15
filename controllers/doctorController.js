const Doctor = require('../models/Doctor');

exports.createDoctor = async (req, res) => {
  const newDoctor = new Doctor(req.body);
  await newDoctor.save();
  res.status(201).send(newDoctor);
};

exports.getDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  res.send(doctors);
};

exports.getDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).send('Doctor not found');
  res.send(doctor);
};

exports.getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new Error('Doctor not found');
  return doctor;
};

exports.updateDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doctor) return res.status(404).send('Doctor not found');
  res.send(doctor);
};

exports.deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return res.status(404).send('Doctor not found');
  res.send('Doctor deleted');
};
