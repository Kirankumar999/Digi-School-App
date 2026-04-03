interface SubjectData {
  subject: string;
  testsCount: number;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  grade: string;
}

interface PromptInput {
  studentName: string;
  classNum: number;
  section: string;
  term: string;
  academicYear: string;
  subjects: SubjectData[];
  overallPercentage: number;
  overallGrade: string;
}

export function buildReportCardPrompt(input: PromptInput): string {
  const subjectLines = input.subjects
    .map(
      (s) =>
        `- ${s.subject}: ${s.marksObtained}/${s.totalMarks} (${s.percentage.toFixed(1)}%, Grade ${s.grade}, ${s.testsCount} tests)`
    )
    .join("\n");

  return `You are an experienced primary school teacher writing a report card for a student.

STUDENT:
- Name: ${input.studentName}
- Class: ${input.classNum}${input.section ? `-${input.section}` : ""}
- Term: ${input.term}, Academic Year: ${input.academicYear}
- Overall: ${input.overallPercentage.toFixed(1)}% (Grade ${input.overallGrade})

SUBJECT-WISE PERFORMANCE:
${subjectLines}

TASK:
1. Write a warm, encouraging overall remark (2-3 sentences).
2. List 2-4 specific strengths based on performance data.
3. List 1-3 specific, actionable areas to improve.
4. List 2-4 practical recommendations for parents/guardians.
5. For EACH subject, write a brief 1-sentence remark reflecting the student's performance.
6. Suggest 3-5 co-scholastic activity grades (e.g. Art, Music, Sports, Discipline, Cleanliness) using A/B/C grading.

IMPORTANT:
- These are primary school children (ages ${input.classNum + 5}-${input.classNum + 6}). Be encouraging and positive.
- Use simple language that parents can understand.
- Be specific — reference actual subjects and performance, not generic phrases.
- Output ONLY valid JSON, no markdown, no backticks, no explanation outside JSON.

REQUIRED JSON SCHEMA:
{
  "aiRemarks": "string — warm overall teacher remark, 2-3 sentences",
  "strengths": ["string — specific strength based on data"],
  "areasToImprove": ["string — specific, encouraging improvement area"],
  "recommendations": ["string — practical tip for parents"],
  "subjectRemarks": [
    { "subject": "string — subject name exactly as given", "remarks": "string — 1-sentence remark" }
  ],
  "coScholastic": [
    { "activity": "string — activity name", "grade": "string — A, B, or C" }
  ]
}

Generate the report card JSON now:`;
}

export function buildReportCardRetryPrompt(original: string, error: string): string {
  return `${original}

PREVIOUS ATTEMPT FAILED VALIDATION:
${error}

Fix the JSON and output ONLY the corrected JSON:`;
}
