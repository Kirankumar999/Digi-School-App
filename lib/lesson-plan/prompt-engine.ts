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

RULES:
1. Output ONLY valid JSON — no markdown, no backticks.
2. Curriculum-accurate for ${chapterContext}. Age-appropriate for Class ${req.classNum}.
3. Indian context (₹, Indian names). Low-cost materials. Board work = actual content.
4. Homework references MSCERT textbook. Differentiated instruction must be specific, not vague.
5. Each lessonFlow phase needs: phase, duration, activity, teacherActions, studentActions, tips.
${req.includeReflection ? "6. Include teacherReflection with 2-3 reflective questions." : "6. Set teacherReflection to empty string."}

ALL of these fields are REQUIRED in the JSON output:
- "title": string
- "learningObjectives": array of strings (2-6 items)
- "prerequisites": array of strings
- "materialsNeeded": array of strings
- "lessonFlow": array of objects, each with: "phase", "duration", "activity", "teacherActions", "studentActions", "tips"
- "differentiatedInstruction": object with keys: "slowLearners", "advancedLearners", "visualLearners", "kinestheticLearners"
- "boardWork": string
- "homework": string (REQUIRED — specific assignment with textbook reference)
- "assessmentCriteria": array of strings (REQUIRED — 2-8 observable criteria)
- "crossCurricularLinks": string
- "teacherReflection": string

Output ONLY the JSON object, nothing else:`;
}

export function buildLessonPlanRetryPrompt(original: string, error: string): string {
  return `${original}

PREVIOUS ATTEMPT FAILED VALIDATION WITH ERROR:
${error}

Fix the JSON output to comply with the schema. Output ONLY the corrected JSON:`;
}
