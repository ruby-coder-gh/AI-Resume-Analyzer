import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateMockAnalysis } from './mockAnalysis.js';

// ── Provider Clients ──────────────────────────────────────────

let openaiClient = null;
let genAIClient = null;

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith('sk-') === false) return null;
  if (!openaiClient) openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 10) return null;
  if (!genAIClient) genAIClient = new GoogleGenerativeAI(apiKey);
  return genAIClient;
}

// ── Shared Prompt ─────────────────────────────────────────────

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

// ── Response Normalizer ───────────────────────────────────────

function normalizeResponse(parsed) {
  parsed.overall_score = Math.max(0, Math.min(100, parsed.overall_score ?? 50));
  parsed.ats_compatibility_score = Math.max(0, Math.min(100, parsed.ats_compatibility_score ?? 50));
  parsed.hiring_readiness = ['Poor', 'Fair', 'Good', 'Excellent'].includes(parsed.hiring_readiness)
    ? parsed.hiring_readiness
    : 'Fair';

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

  ['skills_identified', 'missing_keywords', 'strengths', 'areas_for_improvement', 'recommendations'].forEach(field => {
    if (!Array.isArray(parsed[field])) parsed[field] = [];
  });

  return parsed;
}

// ── Provider Implementations ──────────────────────────────────

async function analyzeWithOpenAI(text) {
  const openai = getOpenAI();
  if (!openai) return null;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Please analyze this resume text:\n\n${text}` },
    ],
    temperature: 0.3,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('AI returned an empty response.');
  return normalizeResponse(JSON.parse(content));
}

async function analyzeWithGemini(text) {
  const genAI = getGemini();
  if (!genAI) return null;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 3000 },
  });

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: `Please analyze this resume text and return ONLY valid JSON:\n\n${text}` },
  ]);

  let content = result.response.text();
  if (!content) throw new Error('AI returned an empty response.');

  // Strip markdown code fences if present
  content = content.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();
  return normalizeResponse(JSON.parse(content));
}

// ── Public API ────────────────────────────────────────────────

export async function analyzeResume(resumeText) {
  if (!resumeText || resumeText.trim().length < 20) {
    throw Object.assign(
      new Error('Resume text is too short. Please upload a valid resume PDF with sufficient content.'),
      { status: 400 }
    );
  }

  const truncatedText = resumeText.slice(0, 15000);
  const useDemo = process.env.DEMO_MODE === 'true' || process.env.DEMO_MODE === '1';

  // DEMO_MODE=true → skip API calls entirely, return mock instantly
  if (useDemo) {
    console.log('[AI] Demo mode active — generating mock analysis');
    return generateMockAnalysis(resumeText);
  }

  const provider = process.env.AI_PROVIDER || 'auto';
  let lastError = null;

  const providers = provider === 'openai'
    ? ['openai']
    : provider === 'gemini'
      ? ['gemini']
      : ['openai', 'gemini'];

  for (const name of providers) {
    try {
      if (name === 'openai') {
        const result = await analyzeWithOpenAI(truncatedText);
        if (result) return result;
      }
      if (name === 'gemini') {
        const result = await analyzeWithGemini(truncatedText);
        if (result) return result;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[AI] ${name} failed:`, err.message);
    }
  }

  // All providers failed — throw the error
  if (lastError) throw lastError;

  throw Object.assign(
    new Error('No AI provider configured. Set an API key in .env or enable DEMO_MODE=true for demo data.'),
    { status: 500 }
  );
}
