const Appointment = require('../models/Appointment');
const User = require('../models/User');

const ensurePatientRole = (req, res) => {
  if (req.user.role !== 'patient') {
    res.status(403).json({ message: 'Only patients can perform this action' });
    return false;
  }
  return true;
};

exports.getDoctors = async (req, res) => {
  try {
    if (!ensurePatientRole(req, res)) {
      return;
    }

    const doctors = await User.find({ role: 'doctor' })
      .select('name email phone specialization clinic experienceYears');

    return res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    if (!ensurePatientRole(req, res)) {
      return;
    }

    const { doctorId, date, time, reason } = req.body;
    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'doctorId, date, and time are required' });
    }

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointmentDate = new Date(date);
    if (Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: 'Invalid appointment date' });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId: doctor._id,
      date: appointmentDate,
      time,
      reason,
    });

    return res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (error) {
    console.error('Book appointment error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!ensurePatientRole(req, res)) {
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!ensurePatientRole(req, res)) {
      return;
    }

    const allowedFields = ['name', 'phone', 'address'];
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
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addProfileField = async (req, res) => {
  try {
    if (!ensurePatientRole(req, res)) {
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
    console.error('Add profile field error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProfileField = async (req, res) => {
  try {
    if (!ensurePatientRole(req, res)) {
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
    console.error('Update profile field error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProfileField = async (req, res) => {
  try {
    if (!ensurePatientRole(req, res)) {
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
    console.error('Delete profile field error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

