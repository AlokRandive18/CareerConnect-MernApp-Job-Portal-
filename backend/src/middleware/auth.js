import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const authorizeEmployer = (req, res, next) => {
  if (req.user.userType !== 'employer') {
    return res.status(403).json({ success: false, error: 'Only employers can access this resource' });
  }
  next();
};

export const authorizeJobSeeker = (req, res, next) => {
  if (req.user.userType !== 'job_seeker') {
    return res.status(403).json({ success: false, error: 'Only job seekers can access this resource' });
  }
  next();
};
