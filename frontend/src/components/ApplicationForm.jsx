import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import API from '../lib/api.js';

export const ApplicationForm = ({ jobId, jobTitle, company, onSubmit, onCancel }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Experience, 2: Education, 3: Details, 4: Cover Letter

  const [formData, setFormData] = useState({
    experienceLevel: 'fresher', // fresher, experienced, senior
    yearsOfExperience: 0,
    currentCompany: '',
    currentDesignation: '',
    educationLevel: '', // 10th, 12th, diploma, bachelor, masters, phd
    university: '',
    fieldOfStudy: '',
    graduationYear: new Date().getFullYear(),
    skills: '',
    resume: null,
    coverLetter: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      setError('');
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.coverLetter.trim()) {
      setError('Please add a cover letter');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const applicationData = {
        jobId,
        experienceLevel: formData.experienceLevel,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        currentCompany: formData.currentCompany,
        currentDesignation: formData.currentDesignation,
        educationLevel: formData.educationLevel,
        university: formData.university,
        fieldOfStudy: formData.fieldOfStudy,
        graduationYear: parseInt(formData.graduationYear),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        coverLetter: formData.coverLetter
      };

      const res = await API.post(`/applications/${jobId}`, applicationData);
      
      if (res.data.success || res.status === 201) {
        onSubmit(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const containerClasses = `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto`;
  const formClasses = `${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full my-8`;
  const labelClasses = `block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const inputClasses = `w-full px-4 py-2.5 border ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all`;
  const selectClasses = `w-full px-4 py-2.5 border ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all`;
  const buttonClasses = `px-6 py-2.5 rounded-lg font-medium transition-all duration-200`;
  const primaryButtonClasses = `${buttonClasses} bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105`;
  const secondaryButtonClasses = `${buttonClasses} bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:opacity-80`;

  return (
    <div className={containerClasses}>
      <div className={formClasses}>
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Apply for {jobTitle}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                at {company}
              </p>
            </div>
            <button
              onClick={onCancel}
              className={`text-xl ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              disabled={loading}
            >
              ✕
            </button>
          </div>
          {/* Progress Indicator */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className={`p-4 rounded-lg border-l-4 ${isDark ? 'bg-red-900 bg-opacity-20 border-red-500 text-red-300' : 'bg-red-50 border-red-500 text-red-700'}`}>
              {error}
            </div>
          )}

          {/* Step 1: Experience Level */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  👤 Experience Level
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {['fresher', 'experienced', 'senior'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.experienceLevel === level
                          ? 'border-blue-600 bg-blue-600 bg-opacity-20'
                          : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-semibold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {level === 'fresher' ? '🎓 Fresher' : level === 'experienced' ? '💼 Experienced' : '🌟 Senior'}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {level === 'fresher' ? '0-1 yrs' : level === 'experienced' ? '1-5 yrs' : '5+ yrs'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {formData.experienceLevel !== 'fresher' && (
                <div>
                  <label className={labelClasses}>Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    min="0"
                    max="60"
                    className={inputClasses}
                    placeholder="e.g., 3"
                    required
                  />
                </div>
              )}

              {formData.experienceLevel !== 'fresher' && (
                <>
                  <div>
                    <label className={labelClasses}>Current Company</label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="e.g., Infosys Technologies"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Current Designation</label>
                    <input
                      type="text"
                      name="currentDesignation"
                      value={formData.currentDesignation}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="e.g., Senior Developer"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Education */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🎓 Educational Background
              </h3>

              <div>
                <label className={labelClasses}>Education Level</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  className={selectClasses}
                  required
                >
                  <option value="">Select Education Level</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>University / Institute</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="e.g., IIT Bombay"
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Field of Study</label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="e.g., Computer Science & Engineering"
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  min="1990"
                  max={new Date().getFullYear()}
                  className={inputClasses}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                💡 Skills & Resume
              </h3>

              <div>
                <label className={labelClasses}>Your Skills (comma-separated)</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className={`${inputClasses} resize-none`}
                  rows="3"
                  placeholder="e.g., React, JavaScript, Node.js, MongoDB, AWS"
                  required
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  List your technical and professional skills
                </p>
              </div>

              <div>
                <label className={labelClasses}>Upload Resume (PDF)</label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx"
                  className={`w-full px-4 py-2.5 ${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Optional: PDF, DOC, or DOCX format
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Cover Letter */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ✍️ Cover Letter
              </h3>

              <div>
                <label className={labelClasses}>Why are you interested in this role?</label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className={`${inputClasses} resize-none`}
                  rows="6"
                  placeholder="Share why you're a great fit for this position..."
                  required
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Minimum 50 characters • {formData.coverLetter.length} characters
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3 pt-6 border-t" style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
            <button
              type="button"
              onClick={step === 1 ? onCancel : handlePrev}
              className={secondaryButtonClasses}
              disabled={loading}
            >
              {step === 1 ? 'Cancel' : '← Previous'}
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className={primaryButtonClasses}
                disabled={loading}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className={primaryButtonClasses}
                disabled={loading}
              >
                {loading ? '⏳ Submitting...' : '✓ Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
