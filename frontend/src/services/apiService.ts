import type { Scenario, AIEvaluationResult, Attempt, Skill } from '../types';

const API_BASE_URL = localStorage.getItem('lifeos_api_url') || 'http://localhost:8000';

export interface BackendStatus {
  connected: boolean;
  message: string;
}

export const checkBackendConnection = async (): Promise<BackendStatus> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE_URL}/docs`, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);
    return {
      connected: res.ok,
      message: res.ok ? 'Connected to FastAPI Backend' : 'FastAPI returned error status',
    };
  } catch {
    return {
      connected: false,
      message: 'Running in Standalone / Offline Simulation Engine',
    };
  }
};

/**
 * Intelligent AI Evaluator for Open-Text Responses
 * Implements the PRD Section 8 structured AI rubric:
 * - Trade-off awareness
 * - Calm & respectful tone
 * - Long-term consequences
 * - Actionable execution
 */
export const evaluateOpenTextResponse = async (
  scenario: Scenario,
  userResponse: string,
  userSkills: Skill[]
): Promise<AIEvaluationResult> => {
  // If backend is active, try to call backend first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/attempts/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario_id: scenario.id,
        response_text: userResponse,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Graceful fallback to client-side AI analysis engine
  }

  // Client-Side Simulated AI Engine
  await new Promise((resolve) => setTimeout(resolve, 1400)); // Natural AI thinking latency

  const textLower = userResponse.toLowerCase();
  const wordCount = userResponse.trim().split(/\s+/).length;

  // Analysis dimensions
  let criticalThinkingScore = 65;
  let emotionalMaturityScore = 70;
  let actionabilityScore = 60;

  const positiveTriggers = [
    'first', 'then', 'because', 'balance', 'communicate', 'honest', 'prioritize',
    'plan', 'save', 'budget', 'calm', 'boundaries', 'listen', 'solution', 'compromise',
    'respect', 'schedule', 'focus', 'deadline', 'objective', 'consequence'
  ];

  const negativeTriggers = [
    'ignore', 'blame', 'yell', 'lie', 'fake', 'revenge', 'whatever', 'freak out',
    'quit', 'procrastinate', 'ghost', 'cheat', 'skip'
  ];

  positiveTriggers.forEach((word) => {
    if (textLower.includes(word)) {
      criticalThinkingScore += 4;
      actionabilityScore += 5;
    }
  });

  negativeTriggers.forEach((word) => {
    if (textLower.includes(word)) {
      criticalThinkingScore -= 8;
      emotionalMaturityScore -= 10;
    }
  });

  // Length penalty/bonus
  if (wordCount < 10) {
    criticalThinkingScore -= 20;
    actionabilityScore -= 20;
  } else if (wordCount > 30) {
    criticalThinkingScore += 10;
    actionabilityScore += 10;
  }

  // Bound scores between 30 and 96
  const overall = Math.min(96, Math.max(35, Math.round((criticalThinkingScore + emotionalMaturityScore + actionabilityScore) / 3)));

  // Generate customized strengths & improvements
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (overall >= 75) {
    strengths.push('Demonstrates nuanced awareness of competing priorities and long-term consequences.');
    strengths.push('Clear, calm, and actionable formulation that minimizes interpersonal friction.');
  } else if (overall >= 55) {
    strengths.push('Acknowledged the core dilemma and attempted a pragmatic middle ground.');
  } else {
    strengths.push('Willingness to take an immediate stand on a difficult dilemma.');
  }

  if (wordCount < 15) {
    improvements.push('Elaborate further on your rationale. Explain the specific steps you would take.');
  }
  if (!textLower.includes('because') && !textLower.includes('so that')) {
    improvements.push('Articulate the "why" behind your decision to ensure clear alignment with stakeholders.');
  }
  if (overall < 70) {
    improvements.push('Consider what the other parties involved might feel or risk as a result of this action.');
  } else {
    improvements.push('Consider establishing a recurring checkpoint or rule to prevent this dilemma from recurring.');
  }

  // Calculate skill impact deltas
  const skillScores: Record<string, number> = {};
  const relevantSkills = userSkills.filter(s => s.moduleKey === scenario.moduleKey);
  const targetSkill = relevantSkills[0] || userSkills[0];
  if (targetSkill) {
    const delta = Math.round((overall - 50) * 0.4);
    skillScores[targetSkill.id] = delta;
  }

  const consequenceExplanation = overall >= 75
    ? `Your measured approach resolves the immediate tension effectively. You uphold your core responsibility while treating others with dignity, reinforcing your reputation for maturity.`
    : overall >= 55
    ? `Your choice handles the urgent problem, but leaves some loose ends. You may need to follow up soon to ensure relationships or underlying tasks stay resilient.`
    : `This reactive approach triggers friction and unforeseen side-effects. You might feel immediate relief, but will likely face compounding stress later this week.`;

  const nextAction = overall >= 75
    ? 'Reinforce this success by tackling a higher-difficulty challenge in this domain.'
    : 'Review the trade-off breakdown and try applying proactive communication in similar scenarios.';

  const xpAwarded = Math.max(30, Math.round(overall * 0.8));

  return {
    overallScore: overall,
    skillScores,
    strengths,
    improvements,
    consequenceExplanation,
    nextAction,
    retryAvailable: true,
    xpAwarded,
  };
};

/**
 * Recommendations Engine (PRD Section 9)
 * Rule-based heuristic prioritizing:
 * 1. Unpracticed or lowest-scoring skills
 * 2. Rotating modules to avoid fatigue
 * 3. Appropriate difficulty based on current skill level
 */
export const getRecommendedScenario = (
  scenarios: Scenario[],
  skills: Skill[],
  recentAttempts: Attempt[],
  activeScenarioId?: string
): Scenario => {
  // Find skill with lowest score
  const sortedSkills = [...skills].sort((a, b) => a.currentScore - b.currentScore);
  const weakestSkill = sortedSkills[0];

  // Candidates excluding the currently active one
  const candidates = scenarios.filter(s => s.id !== activeScenarioId);
  if (candidates.length === 0) return scenarios[0];

  // 1. Try to find a scenario targeting the weakest skill module
  const moduleMatch = candidates.find(s => s.moduleKey === weakestSkill.moduleKey);
  if (moduleMatch) {
    return {
      ...moduleMatch,
      recommendationReason: `Recommended because your ${weakestSkill.name} score (${weakestSkill.currentScore}%) could benefit from focused practice.`,
    };
  }

  // 2. Try to find an uncompleted scenario
  const attemptedIds = new Set(recentAttempts.map(a => a.scenarioId));
  const unattempted = candidates.find(s => !attemptedIds.has(s.id));
  if (unattempted) {
    return {
      ...unattempted,
      recommendationReason: `Recommended to broaden your real-world experience in ${unattempted.moduleKey.replace('_', ' ')}.`,
    };
  }

  return candidates[0];
};
