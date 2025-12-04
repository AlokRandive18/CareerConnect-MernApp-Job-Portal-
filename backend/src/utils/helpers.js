import jwt from 'jsonwebtoken';

export const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const formatUserResponse = (user) => {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userType: user.userType,
    avatar: user.avatar,
    phone: user.phone,
    location: user.location
  };
};

export const formatJobResponse = (job) => {
  return {
    id: job._id,
    title: job.title,
    description: job.description,
    company: job.company,
    location: job.location,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    jobType: job.jobType,
    skills: job.skills,
    postedAt: job.postedAt,
    applicantCount: job.applicants?.length || 0
  };
};

export const matchSkills = (userSkills, jobSkills) => {
  if (!userSkills || !jobSkills) return 0;
  const matched = userSkills.filter(skill => 
    jobSkills.some(js => js.toLowerCase() === skill.toLowerCase())
  );
  return (matched.length / jobSkills.length) * 100;
};
