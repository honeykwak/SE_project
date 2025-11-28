import { Request, Response } from 'express';
import Project from '../models/Project';

// @desc    Get user projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ startDate: 1 });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, startDate, endDate, status, description } = req.body;

    if (!title || !startDate || !endDate) {
      res.status(400).json({ message: 'Please add all required fields' });
      return;
    }

    const project = await Project.create({
      user: req.user._id,
      title,
      startDate,
      endDate,
      status: status || 'active',
      description,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check for user
    if (!req.user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Make sure the logged in user matches the project user
    if (project.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check for user
    if (!req.user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Make sure the logged in user matches the project user
    if (project.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    await project.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

