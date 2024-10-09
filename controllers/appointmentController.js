const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const sendMail = require('../utils/mailer');

exports.createAppointment = async (req, res) => {
  try {
    console.log('Current User Role:', req.user.role); 
    console.log('Current User ID:', req.user.userId); 
    
    const { patientName, doctorName, date, reason } = req.body;
    
    if (req.user.role !== 'Doctor') {
      return res.status(403).send('Access denied.');
    }

    const patient = await User.findOne({ username: patientName, role: 'Patient' });
    if (!patient) {
      console.log("Patient not found for exact search:", patientName);
      return res.status(404).send('Patient not found');
    }
    
    // Find Doctor in User collection
    const doctor = await User.findOne({ username: doctorName, role: 'Doctor' });
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
    
    // Send email notification to patient
    sendMail(patient.email, 'Nueva Cita', `Tienes una nueva cita con el Dr. ${doctor.username} el ${date}`);
  
    // Render appointmentDetails view
    res.status(201).render('appointmentDetails',{
      title: 'Appointment Created',
      appointment: {
        _id: appointment._id,
        patient: patient.username,
        doctor: doctor.username,
        date: new Date(appointment.date).toLocaleString(),
        reason: appointment.reason,
      },
    })
  } catch (error) {
    error.statusCode = 400;
    next(error);
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
  try {
    const { patient, doctor, date, reason } = req.body;
    const foundPatient = await User.findOne({ username: patient, role: 'Patient' });
    if (!foundPatient) {
      console.log("Paciente no encontrado:", patient);
      return res.status(404).send('Paciente no encontrado');
    }

    const foundDoctor = await User.findOne({ username: doctor, role: 'Doctor' });
    if (!foundDoctor) {
      console.log("Doctor no encontrado:", doctor);
      return res.status(404).send('Doctor no encontrado');
    }

    // Actualizar la cita
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, {
      patient: foundPatient._id,
      doctor: foundDoctor._id,
      date,
      reason
    }, { new: true });

    if (!appointment) {
      console.log("Cita no encontrada");
      return res.status(404).send('Cita no encontrada');
    }

    res.redirect(`/api/appointments/${appointment._id}`);  // Redirigir a la vista de detalles de la cita
  } catch (error) {
    console.error('Error actualizando la cita:', error);
    res.status(500).send('Error al actualizar la cita');
  }
};


exports.deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) return res.status(404).send('Appointment not found');
  res.send('Appointment deleted');
};