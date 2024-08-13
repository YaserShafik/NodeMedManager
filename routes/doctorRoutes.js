const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Render views
router.get('/create', auth, role(['Admin']), (req, res) => {
  res.render('createDoctor');
});

router.get('/update/:id', auth, role(['Admin']), async (req, res) => {
  const doctor = await doctorController.getDoctorById(req.params.id);
  res.render('updateDoctor', { doctor });
});

router.get('/delete/:id', auth, role(['Admin']), async (req, res) => {
  const doctor = await doctorController.getDoctorById(req.params.id);
  res.render('deleteDoctor', { doctor });
});

// API routes
router.post('/', auth, role(['Admin']), doctorController.createDoctor);
router.get('/', auth, role(['Doctor', 'Admin']), doctorController.getDoctors);
router.get('/:id', auth, role(['Doctor', 'Admin']), doctorController.getDoctor);
router.put('/:id', auth, role(['Admin']), doctorController.updateDoctor);
router.delete('/:id', auth, role(['Admin']), doctorController.deleteDoctor);

module.exports = router;
