import { Request, Response } from 'express';
import PortfolioItem from '../models/PortfolioItem';

// @desc    Get user portfolio items
// @route   GET /api/portfolio
// @access  Private
export const getPortfolioItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await PortfolioItem.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new portfolio item
// @route   POST /api/portfolio
// @access  Private
export const createPortfolioItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, imageUrl, projectLink } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Please add a title' });
      return;
    }

    const item = await PortfolioItem.create({
      user: req.user._id,
      title,
      description,
      imageUrl,
      projectLink,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private
export const updatePortfolioItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await PortfolioItem.findById(req.params.id);

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    if (item.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    const updatedItem = await PortfolioItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private
export const deletePortfolioItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await PortfolioItem.findById(req.params.id);

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    if (item.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    await item.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

