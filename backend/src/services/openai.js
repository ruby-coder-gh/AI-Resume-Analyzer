import OpenAI from 'openai';

let openai = null;

function getClient() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'sk-your-openai-api-key-here' || apiKey.startsWith('sk-') === false) {
      throw Object.assign(new Error('Invalid or missing OPENAI_API_KEY. Please set it in your .env file.'), { status: 500 });
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

const SYSTEM_PROMPT = `You are ResumeIQ AI — an elite executive resume advisor and talent intelligence system with 20+ years in HR tech, talent acquisition, and ATS optimization.

Analyze the provided resume text and return **valid JSON only** — no markdown, no fences. Use this exact schema:

{
  "parsed_info": {
    "name": "Candidate Name or null",
    "email": "email@example.com or null",
    "phone": "+1-555-555-5555 or null",
    "skills_extracted": ["Skill 1", "Skill 2"],
    "experience_years": 5,
    "top_roles": ["Software Engineer", "Full Stack Developer"],
    "education": "Bachelor's in Computer Science or null"
  },
  "summary": "2-3 sentence executive summary of the candidate.",
  "overall_score": 75,
  "ats_compatibility_score": 70,
  "hiring_readiness": "Good",
  "ats_breakdown": {
    "formatting_score": 80,
    "keyword_optimization": 65,
    "section_completeness": 70,
    "readability": 85,
    "achievement_focus": 60
  },
  "skills_identified": [
    { "name": "React", "category": "Frontend", "proficiency": "Advanced", "market_demand": 95 }
  ],
  "missing_keywords": [
    { "keyword": "Docker", "category": "DevOps", "importance": "High", "reason": "Standard for containerization in modern stacks" }
  ],
  "keyword_gap_analysis": {
    "strong_categories": ["Frontend", "Programming Languages"],
    "weak_categories": ["DevOps", "Cloud"],
    "missing_critical": ["Kubernetes", "CI/CD"],
    "industry_benchmark_coverage": 62
  },
  "strengths": [
    { "text": "Strong engineering background with quantified achievements", "impact": "High" }
  ],
  "areas_for_improvement": [
    { "text": "Add a professional summary section", "priority": "High", "effort": "Low" }
  ],
  "recommendations": [
    { "text": "Add Docker and CI/CD experience", "category": "Skills", "priority": "High" }
  ],
  "skills_radar": {
    "categories": [
      { "label": "Technical", "score": 85 },
      { "label": "Experience", "score": 70 },
      { "label": "Education", "score": 60 },
      { "label": "Formatting", "score": 90 },
      { "label": "Keywords", "score": 65 },
      { "label": "Achievements", "score": 55 }
    ]
  }
}

Scoring guidelines:
- overall_score (0-100): Holistic evaluation of formatting, content, achievements, relevance.
- ats_compatibility_score (0-100): How well it will pass ATS parsers.
- hiring_readiness: "Poor" | "Fair" | "Good" | "Excellent"
- ats_breakdown sub-scores all 0-100.
- Missing Keywords: Identify 5-10 critical missing keywords with categories (e.g., "DevOps", "Cloud", "Soft Skills", "Methodology").
- skills_identified: List 5-15 skills with category and market_demand (0-100).
- skill_radar categories should cover: Technical, Experience, Education, Formatting, Keywords, Achievements (each 0-100).
- importance/priority: "High" | "Medium" | "Low"
- effort: "High" | "Medium" | "Low"`;

export async function analyzeResume(resumeText) {
  if (!resumeText || resumeText.trim().length < 20) {
    throw Object.assign(
      new Error('Resume text is too short. Please upload a valid resume PDF with sufficient content.'),
      { status: 400 }
    );
  }

  const client = getClient();
  const truncatedText = resumeText.slice(0, 15000);

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Please analyze this resume text:\n\n${truncatedText}` },
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI returned an empty response. Please try again.');
    }

    const parsed = JSON.parse(content);

    // Ensure all required fields exist with defaults
    parsed.overall_score = Math.max(0, Math.min(100, parsed.overall_score ?? 50));
    parsed.ats_compatibility_score = Math.max(0, Math.min(100, parsed.ats_compatibility_score ?? 50));
    parsed.hiring_readiness = ['Poor', 'Fair', 'Good', 'Excellent'].includes(parsed.hiring_readiness) ? parsed.hiring_readiness : 'Fair';

    // Nested defaults
    if (!parsed.ats_breakdown) {
      parsed.ats_breakdown = { formatting_score: 50, keyword_optimization: 50, section_completeness: 50, readability: 50, achievement_focus: 50 };
    }
    if (!parsed.parsed_info) {
      parsed.parsed_info = { name: null, email: null, phone: null, skills_extracted: [], experience_years: 0, top_roles: [], education: null };
    }
    if (!parsed.skills_radar) {
      parsed.skills_radar = { categories: [
        { label: 'Technical', score: 50 }, { label: 'Experience', score: 50 },
        { label: 'Education', score: 50 }, { label: 'Formatting', score: 50 },
        { label: 'Keywords', score: 50 }, { label: 'Achievements', score: 50 },
      ]};
    }
    if (!parsed.keyword_gap_analysis) {
      parsed.keyword_gap_analysis = { strong_categories: [], weak_categories: [], missing_critical: [], industry_benchmark_coverage: 50 };
    }

    // Ensure array fields
    ['skills_identified', 'missing_keywords', 'strengths', 'areas_for_improvement', 'recommendations'].forEach(field => {
      if (!Array.isArray(parsed[field])) parsed[field] = [];
    });

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('[OpenAI] JSON parse error:', error);
      throw new Error('Failed to parse AI response. Please try again.');
    }
    if (error.status === 401) throw Object.assign(new Error('Invalid OpenAI API key.'), { status: 500 });
    if (error.status === 429) throw Object.assign(new Error('Rate limit exceeded. Please wait.'), { status: 429 });
    console.error('[OpenAI] Error:', error);
    throw error;
  }
}
