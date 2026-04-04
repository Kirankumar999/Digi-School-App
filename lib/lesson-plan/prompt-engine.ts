import { getChapterContext, getTopics } from "@/lib/data/mscert-syllabus";
import type { GenerateLessonPlanRequest } from "./schema";

const METHOD_GUIDES: Record<string, string> = {
  Lecture: "Use structured teacher-led explanation with questioning and examples. Include checkpoints for understanding.",
  "Activity-Based": "Design hands-on activities, group work, and experiential learning. Minimize lecture time. Use manipulatives and real objects.",
  Discussion: "Structure the lesson around guided discussion, Socratic questioning, and student-driven inquiry. Teacher acts as facilitator.",
  Demonstration: "Plan live demonstrations with step-by-step explanations. Students observe first, then replicate. Ideal for science experiments and math procedures.",
  "Project-Based": "Frame the lesson around a real-world project or problem. Students work collaboratively, research, and present findings.",
  Blended: "Mix direct instruction, group activities, individual practice, and multimedia/digital resources for varied engagement.",
};

const DURATION_PHASES: Record<string, string> = {
  "1 Period (40 min)": "4 phases: Introduction/Warm-up (5-8 min), Explanation/Teaching (12-15 min), Practice/Activity (10-12 min), Assessment & Closure (5 min)",
  "2 Periods (80 min)": "6 phases: Introduction/Warm-up (8-10 min), Explanation Part 1 (15 min), Activity 1 (15 min), Explanation Part 2 (15 min), Activity 2/Practice (15 min), Assessment & Closure (10 min)",
  "Full Day Project": "7-8 phases covering: Introduction & Planning (20 min), Research/Exploration (30 min), Hands-on Work Phase 1 (40 min), Break, Hands-on Work Phase 2 (40 min), Presentation/Sharing (30 min), Reflection & Assessment (20 min)",
};

function getLanguageInstruction(lang: string): string {
  if (lang === "Hindi") return "\n- IMPORTANT: Generate the ENTIRE lesson plan in Hindi (हिन्दी) script — title, objectives, activities, everything.";
  if (lang === "Marathi") return "\n- IMPORTANT: Generate the ENTIRE lesson plan in Marathi (मराठी) script — title, objectives, activities, everything.";
  if (lang === "Bilingual") return "\n- IMPORTANT: Generate each section in both English and the regional language (Hindi). English first, then translation.";
  return "";
}

export function buildLessonPlanPrompt(req: GenerateLessonPlanRequest): string {
  const chapterContext = getChapterContext(req.classNum, req.subject, req.chapter);
  const topics = getTopics(req.classNum, req.subject, req.chapter);

  const topicKeywords = req.topic
    ? topics.find((t) => t.name === req.topic)?.keywords.join(", ") || ""
    : topics.flatMap((t) => t.keywords).join(", ");

  const topicStr = req.topic ? `, Topic: "${req.topic}"` : "";

  return `You are an expert MSCERT (Maharashtra State Board) curriculum lesson plan designer for Indian schools.

CONTEXT:
- ${chapterContext}${topicStr}
- Key concepts/keywords: ${topicKeywords}
- Duration: ${req.duration}
- Teaching Method: ${req.teachingMethod}
- Language: ${req.language}${getLanguageInstruction(req.language)}

TEACHING METHOD GUIDE:
${METHOD_GUIDES[req.teachingMethod]}

LESSON FLOW STRUCTURE:
Design exactly ${DURATION_PHASES[req.duration]}.

STRICT RULES:
1. Output ONLY valid JSON — no markdown, no backticks, no explanation outside JSON.
2. Every activity and example must be curriculum-accurate for ${chapterContext}.
3. Activities must be age-appropriate for Class ${req.classNum} students (ages ${req.classNum + 5}-${req.classNum + 6}).
4. Use Indian context for examples (₹ for money, Indian names, local references).
5. Materials should be low-cost and available in typical Indian primary schools (no expensive tech assumed).
6. Board work should include actual content the teacher writes on the blackboard.
7. Homework should reference specific MSCERT textbook exercise numbers when possible.
8. Differentiated instruction MUST have practical, specific strategies — not vague statements.
9. Each lessonFlow phase must have all fields: phase, duration, activity, teacherActions, studentActions, tips.
${req.includeReflection ? "10. Include a teacherReflection section with 2-3 reflective questions for the teacher." : "10. Set teacherReflection to an empty string."}

REQUIRED JSON SCHEMA:
{
  "title": "string — descriptive title like 'Lesson Plan: Addition of Fractions (Class 5 Mathematics)'",
  "learningObjectives": ["string — 2-6 specific, measurable objectives using Bloom's verbs"],
  "prerequisites": ["string — what students should already know"],
  "materialsNeeded": ["string — textbook, chalk, specific manipulatives, charts, etc."],
  "lessonFlow": [
    {
      "phase": "string — phase name (e.g., Introduction, Explanation, Practice, Assessment & Closure)",
      "duration": "string — e.g., '8 minutes'",
      "activity": "string — detailed description of what happens",
      "teacherActions": "string — specific teacher actions",
      "studentActions": "string — what students do",
      "tips": "string — practical teaching tips"
    }
  ],
  "differentiatedInstruction": {
    "slowLearners": "string — specific strategies with examples",
    "advancedLearners": "string — extension activities with examples",
    "visualLearners": "string — visual aids and strategies",
    "kinestheticLearners": "string — hands-on activities"
  },
  "boardWork": "string — actual content for the blackboard including diagrams described in text",
  "homework": "string — specific assignment with textbook reference",
  "assessmentCriteria": ["string — 2-8 observable criteria to check understanding"],
  "crossCurricularLinks": "string — connection to other subjects",
  "teacherReflection": "string — reflective questions for the teacher"
}

Generate the lesson plan now as pure JSON:`;
}

export function buildLessonPlanRetryPrompt(original: string, error: string): string {
  return `${original}

PREVIOUS ATTEMPT FAILED VALIDATION WITH ERROR:
${error}

Fix the JSON output to comply with the schema. Output ONLY the corrected JSON:`;
}
