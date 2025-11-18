const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getPatients,
  getPendingAppointments,
  respondToAppointment,
  getProfile,
  updateProfile,
  addProfileField,
  updateProfileField,
  deleteProfileField,
} = require('../controllers/doctorController');

const router = express.Router();

router.get('/doctor/patients', authMiddleware, getPatients);
router.get('/doctor/appointments/pending', authMiddleware, getPendingAppointments);
router.post('/doctor/appointments/:appointmentId/respond', authMiddleware, respondToAppointment);
router.get('/doctor/profile', authMiddleware, getProfile);
router.put('/doctor/profile', authMiddleware, updateProfile);
router.post('/doctor/profile/fields', authMiddleware, addProfileField);
router.put('/doctor/profile/fields/:fieldId', authMiddleware, updateProfileField);
router.delete('/doctor/profile/fields/:fieldId', authMiddleware, deleteProfileField);

module.exports = router;

