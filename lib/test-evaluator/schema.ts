import { z } from "zod";

export const QuestionEvalSchema = z.object({
  questionNumber: z.number().int().min(1),
  questionText: z.string(),
  studentAnswer: z.string(),
  correctAnswer: z.string(),
  marksAwarded: z.number().min(0),
  maxMarks: z.number().min(1),
  feedback: z.string(),
  isCorrect: z.boolean(),
});

export const EvaluationAIResponseSchema = z.object({
  testName: z.string().min(1),
  subject: z.string().min(1),
  totalMarks: z.number().min(1),
  marksObtained: z.number().min(0),
  percentage: z.number().min(0).max(100),
  grade: z.string(),
  questions: z.array(QuestionEvalSchema).min(1),
  overallFeedback: z.string().min(5),
  strengths: z.array(z.string()).min(1),
  areasToImprove: z.array(z.string()).min(1),
});
export type EvaluationAIResponse = z.infer<typeof EvaluationAIResponseSchema>;

export const EvaluateRequestSchema = z.object({
  studentId: z.string().min(1),
  testName: z.string().min(1),
  subject: z.string().min(1),
  chapter: z.string().optional(),
  classNum: z.number().int().min(1).max(12),
  totalMarks: z.number().int().min(1),
  imageBase64: z.string().min(100),
  language: z.enum(["English", "Hindi", "Marathi"]).default("English"),
});
export type EvaluateRequest = z.infer<typeof EvaluateRequestSchema>;
