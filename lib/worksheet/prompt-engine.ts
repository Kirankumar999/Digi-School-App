import { getChapterContext, getTopics } from "@/lib/data/mscert-syllabus";
import type { GenerateRequest, QuestionType } from "./schema";

const TYPE_LABELS: Record<QuestionType, string> = {
  mcq: "Multiple Choice Questions (4 options, exactly 1 correct)",
  short_answer: "Short Answer Questions (2–3 sentences)",
  long_answer: "Long Answer Questions (5–8 sentences with step-by-step for math)",
  fill_in_the_blank: "Fill in the Blanks (use ___ for the blank)",
  true_false: "True or False Questions (answer must be boolean true/false)",
  match_the_following: "Match the Following (3–5 pairs, left and right columns)",
};

const DIFFICULTY_GUIDELINES: Record<string, string> = {
  Easy: "Use direct recall, simple application, and basic comprehension. Suitable for below-average to average students.",
  Medium: "Mix recall with analysis and application. Include some multi-step problems. Suitable for average students.",
  Hard: "Focus on higher-order thinking: analysis, evaluation, multi-step reasoning, and real-world application. Suitable for advanced students.",
};

export function buildPrompt(req: GenerateRequest): string {
  const chapterContext = getChapterContext(req.classNum, req.subject, req.chapter);
  const topics = getTopics(req.classNum, req.subject, req.chapter);

  const topicKeywords = req.topic
    ? topics.find((t) => t.name === req.topic)?.keywords.join(", ") || ""
    : topics.flatMap((t) => t.keywords).join(", ");

  const typeBreakdown = req.questionTypes.map((t) => `- ${TYPE_LABELS[t]}`).join("\n");

  const topicStr = req.topic ? `, Topic: "${req.topic}"` : "";

  return `You are an expert MSCERT (Maharashtra State Board) curriculum worksheet generator for Indian schools.

CONTEXT:
- ${chapterContext}${topicStr}
- Difficulty: ${req.difficulty}
- Key concepts/keywords: ${topicKeywords}
- Language: ${req.language}
${req.language === "Marathi" ? "- IMPORTANT: Generate ALL questions, options, answers, and explanations in Marathi (मराठी) script. The title and instructions should also be in Marathi." : ""}${req.language === "Hindi" ? "- IMPORTANT: Generate ALL questions, options, answers, and explanations in Hindi (हिन्दी) script. The title and instructions should also be in Hindi." : ""}${req.language === "Bilingual" ? "- IMPORTANT: Generate each question in both English and Hindi. Format: English text first, then Hindi translation in parentheses." : ""}

TASK:
Generate a worksheet with EXACTLY ${req.numQuestions} questions.

QUESTION TYPES TO INCLUDE:
${typeBreakdown}

Distribute questions roughly evenly across the requested types. If ${req.numQuestions} doesn't divide evenly, prioritize MCQ and short_answer.

DIFFICULTY GUIDELINE:
${DIFFICULTY_GUIDELINES[req.difficulty]}

MARKS ALLOCATION:
- mcq: 1 mark each
- fill_in_the_blank: 1 mark each
- true_false: 1 mark each
- short_answer: 2 marks each
- match_the_following: 3 marks each
- long_answer: 4–5 marks each

RULES:
1. Output ONLY valid JSON — no markdown, no backticks.
2. Curriculum-accurate for ${chapterContext}. MCQ options must be plausible.
3. true_false answer = JSON boolean. match_the_following = array of {left,right} pairs.
4. Sequential numbering from 1. Brief explanation per question.

JSON SCHEMA:
{"title":"string","instructions":"string","questions":[{"id":number,"type":"mcq|short_answer|long_answer|fill_in_the_blank|true_false|match_the_following","question":"string","options":["string"](mcq only,4),"pairs":[{"left":"string","right":"string"}](match only),"answer":"string|boolean","explanation":"string","marks":number}],"totalMarks":number,"estimatedTime":"string"}

Output pure JSON:`;
}

export function buildRetryPrompt(originalPrompt: string, error: string): string {
  return `${originalPrompt}

PREVIOUS ATTEMPT FAILED VALIDATION WITH ERROR:
${error}

Fix the JSON output to comply with the schema. Output ONLY the corrected JSON:`;
}
