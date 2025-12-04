import Application from '../models/Application.js';
import Job from '../models/Job.js';

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      userId: req.user.userId
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, error: 'Already applied for this job' });
    }

    // Create application
    const application = new Application({
      jobId,
      userId: req.user.userId,
      coverLetter
    });

    await application.save();

    // Add applicant to job
    job.applicants.push({
      userId: req.user.userId,
      appliedAt: new Date()
    });
    await job.save();

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.userId })
      .populate('jobId')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const applications = await Application.find({ jobId })
      .populate('userId', '-password')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const job = await Job.findById(application.jobId);
    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    application.status = status;
    application.updatedAt = new Date();
    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
