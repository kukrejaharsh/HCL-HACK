const Appointment = require('../models/Appointment');
const User = require('../models/User');

const ensureDoctorRole = (req, res) => {
  if (req.user.role !== 'doctor') {
    res.status(403).json({ message: 'Only doctors can perform this action' });
    return false;
  }
  return true;
};

exports.getPatients = async (req, res) => {
  try {
    if (!ensureDoctorRole(req, res)) {
      return;
    }

    const appointments = await Appointment.find({ doctorId: req.user.id, status: 'confirmed' })
      .populate('patientId', '-password');

    const patients = appointments.map((appointment) => ({
      appointmentId: appointment._id,
      date: appointment.date,
      time: appointment.time,
      patient: appointment.patientId,
    }));

    return res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPendingAppointments = async (req, res) => {
  try {
    if (!ensureDoctorRole(req, res)) {
      return;
    }

    const appointments = await Appointment.find({ doctorId: req.user.id, status: 'pending' })
      .populate('patientId', 'name email phone');

    return res.json(appointments);
  } catch (error) {
    console.error('Get pending appointments error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.respondToAppointment = async (req, res) => {
  try {
    if (!ensureDoctorRole(req, res)) {
      return;
    }

    const { appointmentId } = req.params;
    const { decision } = req.body;

    if (!appointmentId || !['accept', 'decline'].includes(decision)) {
      return res.status(400).json({ message: 'appointmentId and valid decision are required' });
    }

    const status = decision === 'accept' ? 'confirmed' : 'declined';

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctorId: req.user.id, status: 'pending' },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or already processed' });
    }

    return res.json({ message: `Appointment ${status}`, appointment });
  } catch (error) {
    console.error('Respond to appointment error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!ensureDoctorRole(req, res)) {
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Doctor get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!ensureDoctorRole(req, res)) {
      return;
    }

    const allowedFields = ['name', 'phone', 'address', 'specialization', 'clinic', 'experienceYears'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    return res.json(user);
  } catch (error) {
    console.error('Doctor update profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addProfileField = async (req, res) => {
  try {
    if (!ensureDoctorRole(req, res)) {
      return;
    }

    const { label, value } = req.body;
    if (!label || !value) {
      return res.status(400).json({ message: 'label and value are required' });
    }

    const user = await User.findById(req.user.id);
    user.profileFields.push({ label, value });
    await user.save();

    return res.status(201).json(user.profileFields);
  } catch (error) {
    console.error('Doctor add profile field error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProfileField = async (req, res) => {
  try {
    if (!ensureDoctorRole(req, res)) {
      return;
    }

    const { fieldId } = req.params;
    const { label, value } = req.body;

    if (!fieldId) {
      return res.status(400).json({ message: 'fieldId is required' });
    }

    const user = await User.findById(req.user.id);
    const field = user.profileFields.id(fieldId);

    if (!field) {
      return res.status(404).json({ message: 'Profile field not found' });
    }

    if (label !== undefined) {
      field.label = label;
    }
    if (value !== undefined) {
      field.value = value;
    }

    await user.save();

    return res.json(user.profileFields);
  } catch (error) {
    console.error('Doctor update profile field error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProfileField = async (req, res) => {
  try {
    if (!ensureDoctorRole(req, res)) {
      return;
    }

    const { fieldId } = req.params;
    if (!fieldId) {
      return res.status(400).json({ message: 'fieldId is required' });
    }

    const user = await User.findById(req.user.id);
    const field = user.profileFields.id(fieldId);

    if (!field) {
      return res.status(404).json({ message: 'Profile field not found' });
    }

    field.remove();
    await user.save();

    return res.json({ message: 'Profile field deleted', fields: user.profileFields });
  } catch (error) {
    console.error('Doctor delete profile field error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

