/**
 * Normalize AI output before Zod validation.
 * Handles common model quirks: arrays where strings expected, missing optional fields, etc.
 */

function arrayToString(val: unknown): string {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val.map((v) => (typeof v === "string" ? v : JSON.stringify(v))).join(". ");
  if (val == null) return "";
  return String(val);
}

function ensureArray(val: unknown): unknown[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.length > 0) return [val];
  return [];
}

export function normalizeLessonPlan(raw: Record<string, unknown>): Record<string, unknown> {
  if (Array.isArray(raw.lessonFlow)) {
    raw.lessonFlow = raw.lessonFlow.map((phase: Record<string, unknown>) => ({
      ...phase,
      teacherActions: arrayToString(phase.teacherActions),
      studentActions: arrayToString(phase.studentActions),
      activity: arrayToString(phase.activity),
      tips: arrayToString(phase.tips),
    }));
  }

  if (raw.differentiatedInstruction && typeof raw.differentiatedInstruction === "object") {
    const di = raw.differentiatedInstruction as Record<string, unknown>;
    for (const key of ["slowLearners", "advancedLearners", "visualLearners", "kinestheticLearners"]) {
      di[key] = arrayToString(di[key]);
    }
  }

  raw.boardWork = arrayToString(raw.boardWork);
  raw.homework = arrayToString(raw.homework) || "Revise the chapter and complete textbook exercises.";
  raw.assessmentCriteria = ensureArray(raw.assessmentCriteria);
  if ((raw.assessmentCriteria as unknown[]).length === 0) {
    raw.assessmentCriteria = ["Student can demonstrate understanding of key concepts", "Student participates in class activities"];
  }
  raw.crossCurricularLinks = arrayToString(raw.crossCurricularLinks);
  raw.teacherReflection = arrayToString(raw.teacherReflection);

  return raw;
}

export function normalizeWorksheet(raw: Record<string, unknown>): Record<string, unknown> {
  if (Array.isArray(raw.questions)) {
    raw.questions = raw.questions.map((q: Record<string, unknown>) => ({
      ...q,
      question: arrayToString(q.question),
      explanation: arrayToString(q.explanation),
    }));
  }
  return raw;
}

export function normalizeEvaluation(raw: Record<string, unknown>): Record<string, unknown> {
  if (Array.isArray(raw.questions)) {
    raw.questions = raw.questions.map((q: Record<string, unknown>) => ({
      ...q,
      questionText: arrayToString(q.questionText),
      studentAnswer: arrayToString(q.studentAnswer),
      correctAnswer: arrayToString(q.correctAnswer),
      feedback: arrayToString(q.feedback),
    }));
  }
  raw.overallFeedback = arrayToString(raw.overallFeedback);
  raw.strengths = ensureArray(raw.strengths);
  raw.areasToImprove = ensureArray(raw.areasToImprove);
  return raw;
}

export function normalizeReportCard(raw: Record<string, unknown>): Record<string, unknown> {
  raw.aiRemarks = arrayToString(raw.aiRemarks);
  raw.strengths = ensureArray(raw.strengths);
  raw.areasToImprove = ensureArray(raw.areasToImprove);
  raw.recommendations = ensureArray(raw.recommendations);
  raw.subjectRemarks = ensureArray(raw.subjectRemarks);
  raw.coScholastic = ensureArray(raw.coScholastic);
  return raw;
}
