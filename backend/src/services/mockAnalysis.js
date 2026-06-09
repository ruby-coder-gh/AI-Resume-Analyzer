/**
 * Mock analysis data for demo purposes when no valid API key is available.
 * Generates realistic-looking resume feedback without calling any AI service.
 */

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, min, max) {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateMockAnalysis(resumeText) {
  const nameMatch = resumeText.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
  const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = resumeText.match(/[\+]?[\d\s\-\(\)]{7,}/);
  const yearsMatch = resumeText.match(/(\d+)\+?\s*years/i);
  const experienceYears = yearsMatch ? parseInt(yearsMatch[1]) : 2 + Math.floor(Math.random() * 8);

  const allSkills = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java',
    'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL', 'REST APIs',
    'Git', 'CI/CD', 'Agile', 'Scrum', 'CSS', 'Tailwind CSS', 'Figma',
    'System Design', 'Microservices', 'Redis', 'PostgreSQL', 'Linux',
  ];

  const missingKeywordsList = [
    { keyword: 'Docker', category: 'DevOps', importance: 'High', reason: 'Containerization is now standard across modern tech stacks' },
    { keyword: 'CI/CD', category: 'DevOps', importance: 'High', reason: 'Continuous integration is expected for most engineering roles' },
    { keyword: 'Kubernetes', category: 'Cloud', importance: 'Medium', reason: 'Orchestration skills are increasingly important' },
    { keyword: 'System Design', category: 'Architecture', importance: 'High', reason: 'Critical for senior engineering interviews' },
    { keyword: 'TypeScript', category: 'Languages', importance: 'Medium', reason: 'Adopted by most modern web projects' },
    { keyword: 'GraphQL', category: 'API', importance: 'Medium', reason: 'Growing adoption for modern API development' },
    { keyword: 'Redis', category: 'Databases', importance: 'Low', reason: 'Useful for caching and performance optimization' },
    { keyword: 'Microservices', category: 'Architecture', importance: 'Medium', reason: 'Standard architectural pattern in tech companies' },
    { keyword: 'AWS/GCP/Azure', category: 'Cloud', importance: 'High', reason: 'Cloud platforms are fundamental to modern infrastructure' },
    { keyword: 'Terraform', category: 'DevOps', importance: 'Medium', reason: 'Infrastructure as code is industry standard' },
  ];

  // Detect likely job roles from resume text
  const roleKeywords = {
    'Frontend': ['React', 'Angular', 'Vue', 'CSS', 'HTML', 'JavaScript', 'TypeScript', 'UI', 'UX', 'Frontend', 'Web'],
    'Backend': ['Node', 'Python', 'Java', 'Go', 'Rust', 'API', 'Backend', 'Server', 'Database', 'SQL'],
    'Full Stack': ['React', 'Node', 'Python', 'Full Stack', 'Fullstack', 'Frontend', 'Backend', 'API', 'Database'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Jenkins', 'DevOps', 'Infrastructure'],
    'Data Science': ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Data', 'SQL', 'Analytics', 'Statistics'],
    'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Mobile'],
  };

  let topRole = 'Software Engineer';
  let roleScores = {};
  for (const [role, keywords] of Object.entries(roleKeywords)) {
    const score = keywords.filter(kw => resumeText.toLowerCase().includes(kw.toLowerCase())).length;
    roleScores[role] = score;
  }
  const bestRole = Object.entries(roleScores).sort((a, b) => b[1] - a[1])[0];
  if (bestRole && bestRole[1] > 0) {
    topRole = bestRole[0] + ' Engineer';
  }

  const overallScore = 55 + Math.floor(Math.random() * 35);
  const atsScore = Math.max(30, overallScore - 10 + Math.floor(Math.random() * 20));

  const skillsCount = 5 + Math.floor(Math.random() * 8);
  const detectedSkills = pickN(allSkills, skillsCount, skillsCount);

  const missingCount = 4 + Math.floor(Math.random() * 4);
  const missingKw = pickN(missingKeywordsList, missingCount, missingCount);

  const strengths = [
    { text: 'Clear and consistent formatting makes the resume easy to scan', impact: 'High' },
    { text: 'Strong technical foundation with relevant programming languages', impact: 'High' },
    { text: 'Good use of bullet points for readability', impact: 'Medium' },
    { text: 'Relevant work experience is highlighted effectively', impact: 'High' },
    { text: 'Education section is well-structured and complete', impact: 'Medium' },
    { text: 'Quantifiable achievements in recent roles', impact: 'High' },
    { text: 'Relevant certifications are prominently listed', impact: 'Medium' },
  ];

  const improvements = [
    { text: 'Add a professional summary section at the top to provide context', priority: 'High', effort: 'Low' },
    { text: 'Include more quantified achievements with specific metrics', priority: 'High', effort: 'Medium' },
    { text: 'Tailor the skills section to match target job descriptions', priority: 'High', effort: 'Medium' },
    { text: 'Add links to GitHub, LinkedIn, or personal portfolio', priority: 'Medium', effort: 'Low' },
    { text: 'Use action verbs (Led, Developed, Implemented) consistently', priority: 'Medium', effort: 'Low' },
    { text: 'Reduce white space and ensure content fits on 1-2 pages', priority: 'Medium', effort: 'Medium' },
    { text: 'Add relevant keywords from the job description to pass ATS filters', priority: 'High', effort: 'Low' },
  ];

  const recommendations = [
    { text: 'Add a strong professional summary highlighting years of experience and key skills', category: 'Content', priority: 'High' },
    { text: 'Incorporate industry keywords like Docker, CI/CD, and cloud platforms', category: 'Keywords', priority: 'High' },
    { text: 'Quantify achievements with percentages, dollar amounts, or time saved', category: 'Content', priority: 'High' },
    { text: 'Use a clean, ATS-friendly format with standard section headings', category: 'Formatting', priority: 'Medium' },
    { text: 'Add a skills section with proficiency levels and technologies used', category: 'Content', priority: 'Medium' },
  ];

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return {
    parsed_info: {
      name: nameMatch ? nameMatch[1] : null,
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0].trim() : null,
      skills_extracted: detectedSkills,
      experience_years: experienceYears,
      top_roles: [topRole, 'Senior ' + topRole],
      education: 'Bachelor of Technology in Computer Science',
    },
    summary: `This candidate presents a solid profile as a ${topRole} with ${experienceYears}+ years of experience. The resume demonstrates strong technical skills in ${detectedSkills.slice(0, 3).join(', ')} with a well-structured work history. Key strengths include clear formatting and relevant project experience. To improve, consider adding more industry-specific keywords and quantifying achievements with specific metrics.`,
    overall_score: overallScore,
    ats_compatibility_score: atsScore,
    hiring_readiness: overallScore >= 80 ? 'Excellent' : overallScore >= 65 ? 'Good' : 'Fair',
    ats_breakdown: {
      formatting_score: Math.min(95, 60 + Math.floor(Math.random() * 35)),
      keyword_optimization: Math.min(90, 40 + Math.floor(Math.random() * 40)),
      section_completeness: Math.min(95, 55 + Math.floor(Math.random() * 35)),
      readability: Math.min(95, 65 + Math.floor(Math.random() * 30)),
      achievement_focus: Math.min(85, 35 + Math.floor(Math.random() * 40)),
    },
    skills_identified: detectedSkills.map((skill, i) => ({
      name: skill,
      category: i % 2 === 0 ? 'Engineering' : 'Infrastructure',
      proficiency: i < 3 ? 'Advanced' : i < 5 ? 'Intermediate' : 'Beginner',
      market_demand: 60 + Math.floor(Math.random() * 35),
    })),
    missing_keywords: missingKw,
    keyword_gap_analysis: {
      strong_categories: ['Programming Languages', 'Frontend', 'Version Control'],
      weak_categories: ['DevOps', 'Cloud Infrastructure', 'System Design'],
      missing_critical: missingKw.filter(k => k.importance === 'High').map(k => k.keyword),
      industry_benchmark_coverage: 45 + Math.floor(Math.random() * 30),
    },
    strengths: pickN(strengths, 3, 5),
    areas_for_improvement: pickN(improvements, 3, 5),
    recommendations: pickN(recommendations, 3, 5),
    skills_radar: {
      categories: [
        { label: 'Technical', score: 55 + Math.floor(Math.random() * 35) },
        { label: 'Experience', score: 50 + Math.floor(Math.random() * 35) },
        { label: 'Education', score: 60 + Math.floor(Math.random() * 30) },
        { label: 'Formatting', score: 65 + Math.floor(Math.random() * 30) },
        { label: 'Keywords', score: 40 + Math.floor(Math.random() * 35) },
        { label: 'Achievements', score: 35 + Math.floor(Math.random() * 35) },
      ],
    },
  };
}
