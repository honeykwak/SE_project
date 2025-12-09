import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_dev_only';
const JWT_EXPIRES_IN = '1d';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, username } = req.body;

    // 1. Check if user already exists (Email or Username)
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      const message = userExists.email === email
        ? 'User already exists with this email'
        : 'Username is already taken';
      res.status(400).json({ message });
      return;
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      name,
    });

    if (user) {
      // 4. Generate JWT
      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        bio: user.bio,
        tags: user.tags,
        avatarUrl: user.avatarUrl,
        location: user.location,
        availability: user.availability,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Check for user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // 2. Check password
    if (!user.password) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // 3. Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      bio: user.bio,
      tags: user.tags,
      avatarUrl: user.avatarUrl,
      location: user.location,
      availability: user.availability,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        bio: user.bio,
        tags: user.tags,
        avatarUrl: user.avatarUrl,
        location: user.location,
        availability: user.availability,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.role = req.body.role || user.role;
      user.bio = req.body.bio || user.bio;
      user.location = req.body.location || user.location;
      user.availability = req.body.availability || user.availability;
      user.avatarUrl = req.body.avatarUrl || user.avatarUrl;

      // Handle tags array
      if (req.body.tags) {
        user.tags = req.body.tags;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        bio: updatedUser.bio,
        tags: updatedUser.tags,
        avatarUrl: updatedUser.avatarUrl,
        location: updatedUser.location,
        availability: updatedUser.availability,
        token: req.header('Authorization')?.split(' ')[1], // Return existing token just in case
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(400).json({ message: 'Invalid Google Token' });
      return;
    }

    const { email, name, sub: googleId, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // If user exists but no googleId (legacy email user), link it
      if (!user.googleId) {
        user.googleId = googleId;
        // Optionally update avatar if missing
        if (!user.avatarUrl && picture) user.avatarUrl = picture;
        await user.save();
      }
    } else {
      // Create new user
      // Generate unique username from email handle + random string if needed
      let username = email?.split('@')[0] || 'user' + Date.now();

      // Ensure username uniqueness
      let usernameExists = await User.findOne({ username });
      if (usernameExists) {
        username += Math.floor(Math.random() * 1000).toString();
      }

      user = await User.create({
        email,
        name,
        username,
        googleId,
        avatarUrl: picture,
        // No password for Google users
      });
    }

    // Generate JWT
    const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      bio: user.bio,
      tags: user.tags,
      avatarUrl: user.avatarUrl,
      location: user.location,
      availability: user.availability,
      token: jwtToken,
    });

  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({ message: 'Google Login Failed' });
  }
};

