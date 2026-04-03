import { z } from "zod";

export const QuestionTypeEnum = z.enum([
  "mcq",
  "short_answer",
  "long_answer",
  "fill_in_the_blank",
  "true_false",
  "match_the_following",
]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

const MCQQuestionSchema = z.object({
  id: z.number(),
  type: z.literal("mcq"),
  question: z.string().min(5),
  options: z.array(z.string()).length(4),
  answer: z.string(),
  explanation: z.string().optional(),
  marks: z.number().min(1),
});

const ShortAnswerSchema = z.object({
  id: z.number(),
  type: z.literal("short_answer"),
  question: z.string().min(5),
  answer: z.string(),
  explanation: z.string().optional(),
  marks: z.number().min(1),
});

const LongAnswerSchema = z.object({
  id: z.number(),
  type: z.literal("long_answer"),
  question: z.string().min(5),
  answer: z.string(),
  explanation: z.string().optional(),
  marks: z.number().min(1),
});

const FillInBlankSchema = z.object({
  id: z.number(),
  type: z.literal("fill_in_the_blank"),
  question: z.string().min(5),
  answer: z.string(),
  explanation: z.string().optional(),
  marks: z.number().min(1),
});

const TrueFalseSchema = z.object({
  id: z.number(),
  type: z.literal("true_false"),
  question: z.string().min(5),
  answer: z.boolean(),
  explanation: z.string().optional(),
  marks: z.number().min(1),
});

const MatchPairSchema = z.object({ left: z.string(), right: z.string() });

const MatchTheFollowingSchema = z.object({
  id: z.number(),
  type: z.literal("match_the_following"),
  question: z.string().min(5),
  pairs: z.array(MatchPairSchema).min(3).max(6),
  explanation: z.string().optional(),
  marks: z.number().min(1),
});

export const QuestionSchema = z.discriminatedUnion("type", [
  MCQQuestionSchema,
  ShortAnswerSchema,
  LongAnswerSchema,
  FillInBlankSchema,
  TrueFalseSchema,
  MatchTheFollowingSchema,
]);
export type Question = z.infer<typeof QuestionSchema>;

export const WorksheetAIResponseSchema = z.object({
  title: z.string().min(3),
  instructions: z.string(),
  questions: z.array(QuestionSchema).min(1),
  totalMarks: z.number().min(1),
  estimatedTime: z.string(),
});
export type WorksheetAIResponse = z.infer<typeof WorksheetAIResponseSchema>;

export const GenerateRequestSchema = z.object({
  classNum: z.number().int().min(1).max(12),
  subject: z.string().min(1),
  chapter: z.string().min(1),
  topic: z.string().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  questionTypes: z.array(QuestionTypeEnum).min(1),
  numQuestions: z.number().int().min(3).max(30),
  includeAnswerKey: z.boolean().default(true),
  language: z.enum(["English", "Hindi", "Marathi", "Bilingual"]).default("English"),
});
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
