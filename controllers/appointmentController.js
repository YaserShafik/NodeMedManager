const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointment');
const User = require('../models/User')

exports.createAppointment = async (req, res) => {
  try {
    console.log('Current User Role:', req.user.role); 
    console.log('Current User ID:', req.user.userId); 
    
    const { patientName, doctorName, date, reason } = req.body;
    
    if (req.user.role !== 'Doctor') {
      return res.status(403).send('Access denied.');
    }

    // Find Patient in User collection
    const patient = await User.findOne({ name: patientName, role: 'Patient' });
    if (!patient) {
      return res.status(404).send('Patient not found');
    }
    console.log("Patient found:", patient);

    // Find Doctor in User collection
    const doctor = await User.findOne({ name: doctorName, role: 'Doctor' });
    if (!doctor) {
      return res.status(404).send('Doctor not found');
    }
    console.log("Doctor found:", doctor);

    // Create Appointment
    const appointment = new Appointment({
      patient: patient._id,
      doctor: doctor._id,
      date,
      reason
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error during appointment creation:', error);  
    res.status(500).send('Server error');
  }
};




exports.getAppointments = async (req, res) => {
  try {
      const appointments = await Appointment.find().populate('patient').populate('doctor');
      res.render('appointments', { title: 'Appointments', appointments });
  } catch (error) {
      res.status(500).send('Server Error');
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', '_id username email')  // Poblar _id, username y email del paciente
      .populate('doctor', '_id username email');  // Poblar _id, username y email del doctor

    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).send('Server error');
  }
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
