import Job from '../models/Job.js';

// Simple resume parser + matcher (same logic as frontend)
const normalize = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const allSkillsMap = {
  'react': ['react','reactjs','react.js'],
  'javascript': ['javascript','js','es6','es5'],
  'python': ['python','py'],
  'java': ['java'],
  'nodejs': ['nodejs','node.js','node'],
  'docker': ['docker'],
  'kubernetes': ['kubernetes','k8s'],
  'aws': ['aws','amazon web services'],
  'mongodb': ['mongodb','mongo'],
  'postgresql': ['postgresql','postgres','psql'],
  'sql': ['sql','mysql','sqlserver'],
  'django': ['django'],
  'flask': ['flask'],
  'terraform': ['terraform'],
  'redis': ['redis']
};

const extractSkills = (text) => {
  const t = String(text || '').toLowerCase();
  const found = [];
  const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  Object.entries(allSkillsMap).forEach(([key, variants]) => {
    variants.forEach(v => {
      try {
        const safe = escapeRegex(v);
        const re = new RegExp(`(^|\\W)${safe}(?=\\W|$)`, 'i');
        if (re.test(t) && !found.includes(key)) found.push(key);
      } catch (err) {
        // ignore invalid regex
      }
    });
  });
  return found;
};

const parseResume = (text) => {
  const skills = extractSkills(text);
  const expMatch = String(text || '').toLowerCase().match(/(\d+)\s*(?:years?|yrs?)/);
  const yearsOfExperience = expMatch ? parseInt(expMatch[1]) : 0;
  let education = 'bachelor';
  const t = String(text || '').toLowerCase();
  if (t.includes('phd') || t.includes('doctorate')) education = 'phd';
  else if (t.includes('master') || t.includes('m.tech') || t.includes('mba')) education = 'masters';
  else if (t.includes('diploma')) education = 'diploma';
  return { skills, yearsOfExperience, education };
};

const calculateMatchScore = (parsed, job) => {
  let score = 0;
  const jobSkillsNorm = (job.skills || []).map(s => normalize(s));
  const parsedNorm = parsed.skills.map(s => normalize(s));
  const matched = parsedNorm.filter(p => jobSkillsNorm.some(j => j.includes(p) || p.includes(j)));
  const maxSkills = Math.max(parsedNorm.length, jobSkillsNorm.length, 1);
  score += (matched.length / maxSkills) * 60;
  const expRequired = parseInt(job.experience) || 0;
  if (parsed.yearsOfExperience >= expRequired) score += 25;
  else score += (parsed.yearsOfExperience / Math.max(expRequired,1)) * 25;
  const levels = ['10th','12th','diploma','bachelor','masters','phd'];
  const jobEd = levels.indexOf(job.educationLevel || 'bachelor');
  const userEd = levels.indexOf(parsed.education);
  if (userEd >= jobEd) score += 15; else score += (userEd / (jobEd + 1)) * 15;
  return Math.round(score);
};

const analyzeResume = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim()) return res.status(400).json({ success: false, error: 'No resume text provided' });
    const parsed = parseResume(text);
    const jobs = await Job.find({ status: 'active' }).lean();
    const scored = jobs.map(job => ({
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      skills: job.skills,
      matchScore: calculateMatchScore(parsed, job)
    }));
    scored.sort((a,b) => b.matchScore - a.matchScore);
    return res.json({ success: true, parsed, matches: scored.slice(0,10) });
  } catch (err) {
    console.error('AI analyze error', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export { analyzeResume };
