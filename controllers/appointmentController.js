const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

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
    console.log("Intentando actualizar la cita con ID:", req.params.id);
    console.log("Datos recibidos del formulario:", req.body);

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) {
      console.log("Cita no encontrada");
      return res.status(404).send('Appointment not found');
    }

    if (!appointment.date) {
      appointment.date = new Date(); // Establecer la fecha actual si está vacía
    }

    console.log('Cita actualizada:', appointment);
    res.send("Cita actualizada correctamente");
  } catch (error) {
    console.error('Error actualizando la cita:', error);
    res.status(500).send('Error al actualizar la cita');
  }
};


// exports.renderUpdateAppointment = async (req, res) => {
//   try {
//     const appointmentId = req.params.id;  // Obtiene el ID de la cita desde los parámetros de la URL

//     // Buscar la cita por su ID, poblando los detalles de paciente y doctor
//     const appointment = await Appointment.findById(appointmentId)
//       .populate('patient', '_id username email')
//       .populate('doctor', '_id username email');

//     if (appointment.date) {
//         appointment.date = new Date(appointment.date);
//       }

//     if (!appointment) {
//       return res.status(404).send('Appointment not found');
//     }

//     // Renderizar la vista de actualización de la cita, pasando el token CSRF
//     res.render('updateAppointment', {
//       appointment, 
//       csrfToken: req.csrfToken()  // Pasar el token CSRF a la vista
//     });
//   } catch (error) {
//     console.error('Error fetching appointment for update:', error);
//     res.status(500).send('Server error');
//   }
// };

exports.deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) return res.status(404).send('Appointment not found');
  res.send('Appointment deleted');
};