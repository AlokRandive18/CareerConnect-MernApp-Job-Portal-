import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import API from '../lib/api.js';

export const AIJobSuggester = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(true);

  // Function to extract text from resume (improved skill extraction)
  const parseResume = (text) => {
    const skills = [];
    const experience = [];
    const education = [];

    // Comprehensive technical skills list with variations
    const allSkills = {
      'react': ['react', 'reactjs', 'react.js'],
      'javascript': ['javascript', 'js', 'es6', 'es5'],
      'python': ['python', 'py'],
      'java': ['java', 'j2ee', 'core java'],
      'cpp': ['c++', 'cpp'],
      'csharp': ['c#', 'csharp', 'c sharp'],
      'nodejs': ['nodejs', 'node.js', 'node'],
      'express': ['express', 'expressjs'],
      'mongodb': ['mongodb', 'mongo'],
      'postgresql': ['postgresql', 'postgres', 'psql'],
      'sql': ['sql', 'mysql', 'sqlserver'],
      'aws': ['aws', 'amazon web services'],
      'azure': ['azure', 'microsoft azure'],
      'gcp': ['gcp', 'google cloud'],
      'docker': ['docker', 'containers'],
      'kubernetes': ['kubernetes', 'k8s'],
      'figma': ['figma'],
      'adobe xd': ['adobe xd', 'xd'],
      'ui design': ['ui design', 'user interface'],
      'ux design': ['ux design', 'user experience'],
      'devops': ['devops', 'dev ops'],
      'machine learning': ['machine learning', 'ml', 'ai', 'artificial intelligence'],
      'tensorflow': ['tensorflow', 'tf'],
      'django': ['django'],
      'flask': ['flask'],
      'spring': ['spring', 'spring boot', 'springboot'],
      'vue': ['vue', 'vuejs', 'vue.js'],
      'angular': ['angular', 'angularjs'],
      'typescript': ['typescript', 'ts'],
      'html': ['html', 'html5'],
      'css': ['css', 'css3', 'scss', 'sass'],
      'git': ['git', 'github', 'gitlab', 'bitbucket'],
      'linux': ['linux', 'ubuntu', 'debian'],
      'unix': ['unix'],
      'agile': ['agile', 'scrum', 'kanban'],
      'rest api': ['rest api', 'restful api', 'api'],
      'graphql': ['graphql'],
      'redis': ['redis', 'cache'],
      'elasticsearch': ['elasticsearch', 'elastic'],
      'jenkins': ['jenkins', 'ci/cd'],
      'selenium': ['selenium'],
      'jira': ['jira'],
      'webpack': ['webpack'],
      'npm': ['npm', 'node package manager'],
      'yarn': ['yarn'],
      'testing': ['testing', 'jest', 'mocha', 'unittest'],
      'aws lambda': ['lambda', 'serverless'],
      'microservices': ['microservices', 'microservice']
    };

    const textLower = text.toLowerCase().replace(/[,;:\n\r]/g, ' ');

    // Helper to escape regex metacharacters
    const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Extract skills with better matching (escape variants to avoid invalid regexes like C++)
    Object.entries(allSkills).forEach(([skill, variations]) => {
      variations.forEach(variant => {
        try {
          const safe = escapeRegex(variant);
          // Use non-word boundary anchors to match tokens that include non-word chars (e.g., c++, c#)
          const regex = new RegExp(`(^|\\W)${safe}(?=\\W|$)`, 'i');
          if (regex.test(textLower) && !skills.includes(skill)) {
            skills.push(skill);
          }
        } catch (err) {
          // ignore invalid pattern for safety
        }
      });
    });

    // Check for years of experience - more flexible patterns
    const expPatterns = [
      /(\d+)\s*(?:years?|yrs?|yr)\s*(?:of\s*)?(?:experience|exp|working|work)/i,
      /experience:\s*(\d+)\s*(?:years?|yrs?)/i,
      /(\d+)\s*(?:years?)\s*(?:in|as|of|with)/i
    ];
    
    expPatterns.forEach(pattern => {
      const match = textLower.match(pattern);
      if (match && !experience.length) {
        experience.push(parseInt(match[1]));
      }
    });

    // Check for education level
    if (textLower.includes('phd') || textLower.includes('doctorate') || textLower.includes('ph.d')) {
      education.push('phd');
    } else if (textLower.includes('master') || textLower.includes('m.tech') || textLower.includes('mba') || textLower.includes('m.s')) {
      education.push('masters');
    } else if (textLower.includes('bachelor') || textLower.includes('b.tech') || textLower.includes('b.e') || textLower.includes('bsc') || textLower.includes('b.s')) {
      education.push('bachelor');
    } else if (textLower.includes('diploma') || textLower.includes('12th') || textLower.includes('higher secondary')) {
      education.push('diploma');
    }

    return {
      skills: [...new Set(skills)],
      yearsOfExperience: experience.length > 0 ? experience[0] : 0,
      education: education.length > 0 ? education[0] : 'bachelor'
    };
  };


  // Calculate match score between resume and job
  const calculateMatchScore = (parsed, job) => {
    let score = 0;

    // Skill matching (max 60 points) - improved matching
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const jobSkillsNormalized = job.skills.map(s => normalize(String(s)));
    const matchedSkills = parsed.skills.filter(skill => {
      const skillNorm = normalize(String(skill));
      return jobSkillsNormalized.some(jobSkillNorm => {
        if (!jobSkillNorm || !skillNorm) return false;
        // Exact normalized match
        if (jobSkillNorm === skillNorm) return true;
        // Partial normalized match (both directions)
        if (jobSkillNorm.includes(skillNorm) || skillNorm.includes(jobSkillNorm)) return true;
        // Common abbreviations already normalized (js -> js, nodejs -> nodejs)
        return false;
      });
    });
    
    // Give better score when more skills match
    const maxSkills = Math.max(parsed.skills.length, job.skills.length, 1);
    score += (matchedSkills.length / maxSkills) * 60;
    // Experience matching (max 25 points)
    const expRequired = parseInt(job.experience) || 0;
    if (parsed.yearsOfExperience >= expRequired) {
      score += 25;
    } else {
      score += (parsed.yearsOfExperience / Math.max(expRequired, 1)) * 25;
    }

    // Education matching (max 15 points)
    const educationLevels = ['10th', '12th', 'diploma', 'bachelor', 'masters', 'phd'];
    const jobEducationLevel = educationLevels.indexOf(job.educationLevel || 'bachelor');
    const userEducationLevel = educationLevels.indexOf(parsed.education);

    if (userEducationLevel >= jobEducationLevel) {
      score += 15;
    } else {
      score += (userEducationLevel / (jobEducationLevel + 1)) * 15;
    }

    return Math.round(score);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          let text = event.target.result;
          // Remove binary symbols and keep only readable text
          text = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
          setResumeText(text);
          setError('');
        } catch (err) {
          setError('Error reading file. Please use a text file (.txt)');
        }
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please upload or paste your resume');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Parse resume to extract skills, experience, education
      const parsed = parseResume(resumeText);

      // Fetch all jobs
      const jobsRes = await API.get('/jobs');
      const allJobs = jobsRes.data.data || [];

      // Calculate match scores for each job
      const scoredJobs = allJobs.map(job => ({
        ...job,
        matchScore: calculateMatchScore(parsed, job),
        matchedSkills: parsed.skills.filter(skill =>
          job.skills.map(s => s.toLowerCase()).some(jobSkill =>
            jobSkill.includes(skill) || skill.includes(jobSkill)
          )
        )
      }));

      // Sort by match score (highest first)
      const sortedJobs = scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

      // Filter jobs with match score >= 40
      const recommendedJobs = sortedJobs.filter(job => job.matchScore >= 40);

      setSuggestions(recommendedJobs);

      if (recommendedJobs.length === 0) {
        setError('No perfect matches found. Showing all available jobs instead.');
        setSuggestions(sortedJobs.slice(0, 5));
      }

      setShowUploadModal(false);
    } catch (err) {
      console.error('Analyze resume error:', err);
      const message = err?.response?.data?.error || err?.message || 'Failed to analyze resume';
      setError(`Failed to analyze resume: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.userType !== 'job_seeker') {
    return (
      <div className={`min-h-screen py-12 px-4 flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Please login as a job seeker to access AI Job Suggestions</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🤖 AI Job Suggester
            </span>
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload your resume and let AI find the perfect jobs for you
          </p>
        </div>

        {showUploadModal && (
          <div className={`max-w-2xl mx-auto mb-8 p-8 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="space-y-6">
              <div>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Upload Your Resume
                </h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Our AI will analyze your resume and recommend the best matching jobs
                </p>
              </div>

              <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDark ? 'border-gray-700 hover:border-blue-600' : 'border-gray-300 hover:border-blue-600'}`}>
                <input
                  type="file"
                  id="resumeUpload"
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.doc,.docx"
                  className="hidden"
                />
                <label htmlFor="resumeUpload" className="cursor-pointer block">
                  <div className="text-4xl mb-2">📄</div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Click to upload or drag and drop
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    TXT, PDF, DOC, DOCX (Max 5MB)
                  </p>
                </label>
              </div>

              {resumeFile && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="text-lg">✓</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{resumeFile.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeFile(null);
                      setResumeText('');
                    }}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Or Paste Your Resume Here
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className={`w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  rows="6"
                  placeholder="Paste your resume text here..."
                />
              </div>

              {error && (
                <div className={`p-4 rounded-lg border-l-4 ${isDark ? 'bg-red-900 bg-opacity-20 border-red-500 text-red-300' : 'bg-red-50 border-red-500 text-red-700'}`}>
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyzeResume}
                disabled={loading || !resumeText.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Analyzing Resume...' : '🚀 Analyze Resume & Get Suggestions'}
              </button>
            </div>
          </div>
        )}

        {/* Job Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ✨ Recommended Jobs for You
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(true);
                  setSuggestions([]);
                  setResumeText('');
                  setResumeFile(null);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Upload New Resume
              </button>
            </div>

            <div className="grid gap-6">
              {suggestions.map((job) => (
                <div
                  key={job._id}
                  className={`p-6 rounded-lg border-l-4 border-blue-600 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition-shadow`}
                >
                  {/* Match Score Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {job.title}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {job.company} • {job.location}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold text-center ${
                      job.matchScore >= 80
                        ? 'bg-green-600 text-white'
                        : job.matchScore >= 60
                        ? 'bg-yellow-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {job.matchScore}% Match
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 py-4 border-y" style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Salary</p>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ₹{(job.salaryMin / 100000).toFixed(1)} - {(job.salaryMax / 100000).toFixed(1)} LPA
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Experience</p>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.experience}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Job Type</p>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.jobType}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Matched Skills</p>
                      <p className={`font-bold text-green-600`}>{job.matchedSkills?.length || 0} matched</p>
                    </div>
                  </div>

                  {/* Matched Skills */}
                  {job.matchedSkills && job.matchedSkills.length > 0 && (
                    <div className="mb-4">
                      <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your Matched Skills:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.matchedSkills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-full"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                        {job.matchedSkills.length > 5 && (
                          <span className={`px-3 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                            +{job.matchedSkills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {job.description}
                  </p>

                  {/* Action Button */}
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                    Apply Now →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIJobSuggester;
