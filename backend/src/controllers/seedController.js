import User from '../models/User.js';
import Job from '../models/Job.js';

const seedDatabase = async (req, res) => {
  try {
    // If force query param provided, clear existing jobs and seeded employers
    const force = req.query?.force === 'true';
    if (!force) {
      const existingJobs = await Job.countDocuments();
      if (existingJobs > 0) {
        return res.status(400).json({ success: false, error: 'Database already seeded (use ?force=true to reseed)' });
      }
    } else {
      // delete only jobs and employer users created by previous seeds to avoid removing job seekers
      await Job.deleteMany({});
      await User.deleteMany({ userType: 'employer' });
      console.log('Force reseed: cleared previous jobs and employer users');
    }

    // Create employers
    const employers = [
      {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh@infotech.com',
        password: 'password123',
        userType: 'employer',
        company: 'Infosys Technologies',
        location: 'Bangalore, Karnataka',
        bio: 'Global IT solutions and consulting company'
      },
      {
        firstName: 'Priya',
        lastName: 'Singh',
        email: 'priya@softtech.com',
        password: 'password123',
        userType: 'employer',
        company: 'SoftTech Innovations',
        location: 'Pune, Maharashtra',
        bio: 'Leading software development and design agency'
      },
      {
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit@fintech.com',
        password: 'password123',
        userType: 'employer',
        company: 'FinServe India',
        location: 'Mumbai, Maharashtra',
        bio: 'Financial technology and digital banking solutions'
      },
      {
        firstName: 'Neha',
        lastName: 'Sharma',
        email: 'neha@cloudind.com',
        password: 'password123',
        userType: 'employer',
        company: 'CloudIndia Systems',
        location: 'Hyderabad, Telangana',
        bio: 'Cloud infrastructure and enterprise solutions'
      },
      {
        firstName: 'Vikram',
        lastName: 'Menon',
        email: 'vikram@ecomind.com',
        password: 'password123',
        userType: 'employer',
        company: 'EcomIndia Solutions',
        location: 'Delhi, National Capital Region',
        bio: 'E-commerce platform and digital solutions'
      }
    ];

    const createdEmployers = await User.insertMany(employers);
    console.log(`✓ Created ${createdEmployers.length} employers`);

    // Create jobs - ALL WITH 10 LPA MINIMUM AVERAGE
    const jobs = [
      {
        title: 'Senior React Developer',
        description: 'We are looking for an experienced React developer to join our growing team. You will work on building scalable web applications with modern technologies. Ideal candidate should have 5+ years of experience with React and JavaScript.',
        company: 'Infosys Technologies',
        location: 'Bangalore, Karnataka',
        salaryMin: 1500000,
        salaryMax: 2200000,
        jobType: 'full-time',
        category: 'Technology',
        skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Docker'],
        experience: '5+ years',
        requirements: ['Bachelor in CS', 'Experience with Redux', 'Git proficiency'],
        employerId: createdEmployers[0]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'UX/UI Designer',
        description: 'Join our creative team as a UX/UI Designer. You will create beautiful and intuitive user interfaces for web and mobile applications. We are looking for someone passionate about design thinking and user-centered design.',
        company: 'SoftTech Innovations',
        location: 'Pune, Maharashtra',
        salaryMin: 1000000,
        salaryMax: 1500000,
        jobType: 'full-time',
        category: 'Design',
        skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping'],
        experience: '3+ years',
        requirements: ['Portfolio required', 'Design thinking mindset', 'Communication skills'],
        employerId: createdEmployers[1]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Full Stack Developer',
        description: 'We are seeking a Full Stack Developer to build and maintain our web applications. You will work with both frontend and backend technologies in an agile environment. Experience with modern frameworks is essential.',
        company: 'Infosys Technologies',
        location: 'Bangalore, Karnataka',
        salaryMin: 1200000,
        salaryMax: 1800000,
        jobType: 'full-time',
        category: 'Technology',
        skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
        experience: '4+ years',
        requirements: ['Strong problem solving', 'Team player', 'Database knowledge'],
        employerId: createdEmployers[0]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Data Scientist',
        description: 'Looking for a Data Scientist to analyze large datasets and develop machine learning models. You will work with Python, machine learning frameworks, and big data technologies. Help us make data-driven decisions.',
        company: 'FinServe India',
        location: 'Mumbai, Maharashtra',
        salaryMin: 1600000,
        salaryMax: 2500000,
        jobType: 'full-time',
        category: 'Data Science',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
        experience: '3+ years',
        requirements: ['MS in Statistics/CS', 'ML experience', 'Data visualization skills'],
        employerId: createdEmployers[2]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'DevOps Engineer',
        description: 'Join our infrastructure team as a DevOps Engineer. You will design, build, and maintain cloud infrastructure. Experience with containerization, orchestration, and CI/CD pipelines is crucial.',
        company: 'CloudIndia Systems',
        location: 'Hyderabad, Telangana',
        salaryMin: 1400000,
        salaryMax: 2000000,
        jobType: 'full-time',
        category: 'Technology',
        skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Terraform'],
        experience: '4+ years',
        requirements: ['Linux expertise', 'Cloud platform knowledge', 'Scripting skills'],
        employerId: createdEmployers[3]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Backend Developer',
        description: 'We need a talented Backend Developer to build robust APIs and server-side logic. You will work with microservices architecture and modern backend frameworks. Strong problem-solving skills required.',
        company: 'EcomIndia Solutions',
        location: 'Delhi, National Capital Region',
        salaryMin: 1100000,
        salaryMax: 1600000,
        jobType: 'full-time',
        category: 'Technology',
        skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'API Design'],
        experience: '3+ years',
        requirements: ['RESTful API knowledge', 'Database design', 'Testing frameworks'],
        employerId: createdEmployers[4]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Frontend Developer',
        description: 'Build beautiful, responsive web interfaces as a Frontend Developer. We use modern JavaScript frameworks and follow best practices for performance and accessibility.',
        company: 'SoftTech Innovations',
        location: 'Pune, Maharashtra',
        salaryMin: 1000000,
        salaryMax: 1500000,
        jobType: 'full-time',
        category: 'Technology',
        skills: ['React', 'Vue.js', 'CSS', 'Webpack', 'Testing'],
        experience: '2+ years',
        requirements: ['Strong HTML/CSS', 'JavaScript proficiency', 'Portfolio'],
        employerId: createdEmployers[1]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Product Manager',
        description: 'Lead product strategy and development as a Product Manager. You will work with engineering and design teams to deliver innovative solutions. Experience with fintech is a plus.',
        company: 'FinServe India',
        location: 'Mumbai, Maharashtra',
        salaryMin: 1500000,
        salaryMax: 2200000,
        jobType: 'full-time',
        category: 'Product',
        skills: ['Product Strategy', 'Analytics', 'Leadership', 'Agile', 'Communication'],
        experience: '5+ years',
        requirements: ['MBA preferred', 'Industry experience', 'Stakeholder management'],
        employerId: createdEmployers[2]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'QA Engineer',
        description: 'Ensure quality and reliability as a QA Engineer. You will develop test strategies, execute tests, and identify bugs. Experience with automation testing is valuable.',
        company: 'Infosys Technologies',
        location: 'Bangalore, Karnataka',
        salaryMin: 1000000,
        salaryMax: 1400000,
        jobType: 'full-time',
        category: 'Quality Assurance',
        skills: ['Selenium', 'JIRA', 'Test Planning', 'Automation', 'SQL'],
        experience: '2+ years',
        requirements: ['Testing knowledge', 'Attention to detail', 'Problem solving'],
        employerId: createdEmployers[0]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Cloud Architect',
        description: 'Design scalable cloud solutions as a Cloud Architect. You will work on infrastructure design, security, and optimization. Experience with multi-cloud environments preferred.',
        company: 'CloudIndia Systems',
        location: 'Hyderabad, Telangana',
        salaryMin: 2000000,
        salaryMax: 3000000,
        jobType: 'full-time',
        category: 'Technology',
        skills: ['AWS', 'Azure', 'Architecture', 'Security', 'Compliance'],
        experience: '7+ years',
        requirements: ['Cloud certifications', 'Enterprise experience', 'Leadership skills'],
        employerId: createdEmployers[3]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Mobile Developer',
        description: 'Develop iOS and Android applications as a Mobile Developer. You will work with React Native or native technologies. Passion for creating great mobile experiences required.',
        company: 'EcomIndia Solutions',
        location: 'Delhi, National Capital Region',
        salaryMin: 1100000,
        salaryMax: 1600000,
        jobType: 'full-time',
        category: 'Technology',
        skills: ['React Native', 'Swift', 'Kotlin', 'Mobile UI', 'APIs'],
        experience: '3+ years',
        requirements: ['App store experience', 'Performance optimization', 'Testing knowledge'],
        employerId: createdEmployers[4]._id,
        status: 'active',
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ];

    await Job.insertMany(jobs);
    console.log(`✓ Created ${jobs.length} jobs`);

    res.status(200).json({
      success: true,
      message: `Database seeded successfully! Created ${createdEmployers.length} employers and ${jobs.length} jobs`
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export { seedDatabase };
