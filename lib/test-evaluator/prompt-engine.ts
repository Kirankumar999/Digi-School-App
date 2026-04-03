import type { EvaluateRequest } from "./schema";

export function buildEvaluationPrompt(req: EvaluateRequest): string {
  const chapterStr = req.chapter ? `, Chapter: "${req.chapter}"` : "";

  return `You are an expert NCERT answer sheet evaluator for Indian primary schools.

CONTEXT:
- Subject: ${req.subject}${chapterStr}
- Class: ${req.classNum}
- Test: "${req.testName}"
- Total Marks: ${req.totalMarks}
- Language: ${req.language}

TASK:
Examine the uploaded image of a student's handwritten answer sheet. For each question visible:
1. Read the student's handwritten answer carefully.
2. Determine the correct answer based on the NCERT Class ${req.classNum} ${req.subject} curriculum.
3. Award marks fairly — give partial credit where appropriate.
4. Provide brief, constructive feedback per question.

GRADING SCALE:
- 90-100%: A+ (Outstanding)
- 80-89%: A (Excellent)
- 70-79%: B+ (Very Good)
- 60-69%: B (Good)
- 50-59%: C (Average)
- 40-49%: D (Below Average)
- Below 40%: F (Needs Improvement)

STRICT RULES:
1. Output ONLY valid JSON — no markdown, no backticks, no explanation outside JSON.
2. Read EVERY question visible in the image. If handwriting is unclear, make your best interpretation and note it in feedback.
3. marksAwarded must never exceed maxMarks for any question.
4. marksObtained must equal the sum of all marksAwarded values.
5. percentage must be (marksObtained / totalMarks) * 100, rounded to 1 decimal.
6. Be encouraging in feedback — these are primary school children (ages ${req.classNum + 5}-${req.classNum + 6}).
7. strengths should highlight what the student did well.
8. areasToImprove should be specific and actionable, not discouraging.
9. If you cannot read a particular answer, set studentAnswer to "[Unclear handwriting]" and give 0 marks with appropriate feedback.
10. Distribute the totalMarks (${req.totalMarks}) across the questions you identify.

REQUIRED JSON SCHEMA:
{
  "testName": "string — name of the test",
  "subject": "string — subject name",
  "totalMarks": number,
  "marksObtained": number,
  "percentage": number,
  "grade": "string — A+, A, B+, B, C, D, or F",
  "questions": [
    {
      "questionNumber": number,
      "questionText": "string — the question as written/interpreted",
      "studentAnswer": "string — what the student wrote",
      "correctAnswer": "string — the correct answer",
      "marksAwarded": number,
      "maxMarks": number,
      "feedback": "string — brief, constructive feedback",
      "isCorrect": boolean
    }
  ],
  "overallFeedback": "string — 2-3 sentence encouraging summary",
  "strengths": ["string — specific things the student did well"],
  "areasToImprove": ["string — specific, actionable improvement areas"]
}

Evaluate the answer sheet now as pure JSON:`;
}

export function buildEvaluationRetryPrompt(original: string, error: string): string {
  return `${original}

PREVIOUS ATTEMPT FAILED VALIDATION:
${error}

Fix the JSON and output ONLY the corrected JSON:`;
}
