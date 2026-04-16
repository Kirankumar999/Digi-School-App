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

RULES:
- Be encouraging, positive, specific. Simple language for parents. Output ONLY valid JSON.

ALL of these fields are REQUIRED:
- "aiRemarks": string (warm overall remark, 2-3 sentences)
- "strengths": array of strings (2-4 specific strengths)
- "areasToImprove": array of strings (1-3 areas)
- "recommendations": array of strings (2-4 tips for parents)
- "subjectRemarks": array of {"subject":"exact subject name","remarks":"1-sentence remark"} for EACH subject
- "coScholastic": array of {"activity":"string","grade":"A or B or C"} (3-5 activities)

Output ONLY the JSON object, nothing else:`;
}

export function buildReportCardRetryPrompt(original: string, error: string): string {
  return `${original}

PREVIOUS ATTEMPT FAILED VALIDATION:
${error}

Fix the JSON and output ONLY the corrected JSON:`;
}
