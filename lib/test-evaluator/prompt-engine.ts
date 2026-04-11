import type { EvaluateRequest } from "./schema";

export function buildEvaluationPrompt(req: EvaluateRequest): string {
  const chapterStr = req.chapter ? `, Chapter: "${req.chapter}"` : "";

  return `You are an expert MSCERT (Maharashtra State Board) answer sheet evaluator for Indian schools.

CONTEXT:
- Subject: ${req.subject}${chapterStr}
- Class: ${req.classNum}
- Test: "${req.testName}"
- Total Marks: ${req.totalMarks}
- Language: ${req.language}

TASK:
Examine the uploaded image of a student's handwritten answer sheet. For each question visible:
1. Read the student's handwritten answer carefully.
2. Determine the correct answer based on the MSCERT Class ${req.classNum} ${req.subject} curriculum.
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

RULES:
1. Output ONLY valid JSON — no markdown, no backticks.
2. Read EVERY visible question. Interpret unclear handwriting and note it.
3. marksAwarded <= maxMarks per question. marksObtained = sum of marksAwarded.
4. percentage = (marksObtained/totalMarks)*100, 1 decimal. Be encouraging — these are school children.
5. Unclear answers: studentAnswer="[Unclear handwriting]", 0 marks. Distribute totalMarks (${req.totalMarks}) across questions.

JSON SCHEMA:
{"testName":"string","subject":"string","totalMarks":number,"marksObtained":number,"percentage":number,"grade":"A+|A|B+|B|C|D|F","questions":[{"questionNumber":number,"questionText":"string","studentAnswer":"string","correctAnswer":"string","marksAwarded":number,"maxMarks":number,"feedback":"string","isCorrect":boolean}],"overallFeedback":"string","strengths":["string"],"areasToImprove":["string"]}

Output pure JSON:`;
}

export function buildEvaluationRetryPrompt(original: string, error: string): string {
  return `${original}

PREVIOUS ATTEMPT FAILED VALIDATION:
${error}

Fix the JSON and output ONLY the corrected JSON:`;
}
