const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  const newAppointment = new Appointment(req.body);
  await newAppointment.save();
  res.status(201).send(newAppointment);
};

exports.getAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patient', 'firstName lastName')
    .populate('doctor', 'firstName lastName specialty');
  res.send(appointments);
};

exports.getAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'firstName lastName')
    .populate('doctor', 'firstName lastName specialty');
  if (!appointment) return res.status(404).send('Appointment not found');
  res.send(appointment);
};

exports.getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate('patient', 'firstName lastName')
    .populate('doctor', 'firstName lastName specialty');
  if (!appointment) throw new Error('Appointment not found');
  return appointment;
};

exports.updateAppointment = async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!appointment) return res.status(404).send('Appointment not found');
  res.send(appointment);
};

exports.deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) return res.status(404).send('Appointment not found');
  res.send('Appointment deleted');
};
