const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');

// Render views
router.get('/create', (req, res) => {
  res.render('createDoctor');
});

router.get('/update/:id', async (req, res) => {
  const doctor = await doctorController.getDoctorById(req.params.id);
  res.render('updateDoctor', { doctor });
});

router.get('/delete/:id', async (req, res) => {
  const doctor = await doctorController.getDoctorById(req.params.id);
  res.render('deleteDoctor', { doctor });
});

// API routes
router.post('/', auth, doctorController.createDoctor);
router.get('/', auth, doctorController.getDoctors);
router.get('/:id', auth, doctorController.getDoctor);
router.put('/:id', auth, doctorController.updateDoctor);
router.delete('/:id', auth, doctorController.deleteDoctor);

module.exports = router;
