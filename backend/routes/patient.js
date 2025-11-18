const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getDoctors,
  bookAppointment,
  getProfile,
  updateProfile,
  addProfileField,
  updateProfileField,
  deleteProfileField,
} = require('../controllers/patientController');

const router = express.Router();

router.get('/patient/doctors', authMiddleware, getDoctors);
router.post('/appointments', authMiddleware, bookAppointment);
router.get('/patient/profile', authMiddleware, getProfile);
router.put('/patient/profile', authMiddleware, updateProfile);
router.post('/patient/profile/fields', authMiddleware, addProfileField);
router.put('/patient/profile/fields/:fieldId', authMiddleware, updateProfileField);
router.delete('/patient/profile/fields/:fieldId', authMiddleware, deleteProfileField);

module.exports = router;

