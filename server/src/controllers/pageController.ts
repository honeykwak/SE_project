import { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';
import PortfolioItem from '../models/PortfolioItem';

// @desc    Get user profile and projects by username (Public)
// @route   GET /api/page/:username
// @access  Public
export const getPublicPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    // 1. Find user by username
    const user = await User.findOne({ username }).select('-password -email'); // 민감 정보 제외

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // 2. Find projects for this user
    const projects = await Project.find({ user: user._id }).sort({ startDate: 1 });

    // 3. Find portfolio items
    const portfolio = await PortfolioItem.find({ user: user._id }).sort({ createdAt: -1 });

    res.json({
      user,
      projects,
      portfolio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Increment visit count
// @route   POST /api/page/:username/visit
// @access  Public
export const incrementVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    const user = await User.findOneAndUpdate(
      { username },
      { $inc: { visits: 1 } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ visits: user.visits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

