import Job from '../models/Job.js';
import { formatJobResponse, matchSkills } from '../utils/helpers.js';

export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salaryMin, salaryMax, jobType, category, skills, experience, requirements } = req.body;

    if (!title || !description || !company || !location || !jobType) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }

    const job = new Job({
      title,
      description,
      company,
      location,
      salaryMin,
      salaryMax,
      jobType,
      category,
      skills: skills || [],
      experience,
      requirements: requirements || [],
      employerId: req.user.userId
    });

    await job.save();

    res.status(201).json({
      success: true,
      data: formatJobResponse(job)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { search, location, jobType, category, page = 1, limit = 10 } = req.query;
    
    let filter = { status: 'active' };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;
    
    const jobs = await Job.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ postedAt: -1 });

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: jobs.map(formatJobResponse),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employerId', '-password');
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
      success: true,
      data: formatJobResponse(updatedJob)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRecommendedJobs = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user.userId);
    
    if (!user.skills || user.skills.length === 0) {
      const jobs = await Job.find({ status: 'active' }).limit(10).sort({ postedAt: -1 });
      return res.status(200).json({
        success: true,
        data: jobs.map(formatJobResponse)
      });
    }

    const jobs = await Job.find({ status: 'active' })
      .sort({ postedAt: -1 })
      .lean();

    const scoredJobs = jobs.map(job => ({
      ...job,
      matchScore: matchSkills(user.skills, job.skills)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

    res.status(200).json({
      success: true,
      data: scoredJobs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
