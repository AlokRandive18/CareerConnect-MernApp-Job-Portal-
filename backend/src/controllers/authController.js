import User from '../models/User.js';
import { generateToken, formatUserResponse } from '../utils/helpers.js';

export const register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { email, password, firstName, lastName, userType } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName || !userType) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    console.log('Creating user...');
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // Create user
    const user = new User({ email, password, firstName, lastName, userType });
    await user.save();
    console.log('User created:', user._id);

    // Generate token
    const token = generateToken(user._id, user.userType);

    res.status(201).json({
      success: true,
      data: {
        user: formatUserResponse(user),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.userType);
    console.log('Login successful for user:', email);

    res.status(200).json({
      success: true,
      data: {
        user: formatUserResponse(user),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, location, bio, skills, experience, education } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        firstName,
        lastName,
        phone,
        location,
        bio,
        skills,
        experience,
        education,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
