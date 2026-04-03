import { z } from "zod";

export const LessonPhaseSchema = z.object({
  phase: z.string().min(1),
  duration: z.string().min(1),
  activity: z.string().min(10),
  teacherActions: z.string().min(5),
  studentActions: z.string().min(5),
  tips: z.string().optional(),
});
export type LessonPhase = z.infer<typeof LessonPhaseSchema>;

export const DifferentiatedInstructionSchema = z.object({
  slowLearners: z.string().min(5),
  advancedLearners: z.string().min(5),
  visualLearners: z.string().optional(),
  kinestheticLearners: z.string().optional(),
});

export const LessonPlanAIResponseSchema = z.object({
  title: z.string().min(3),
  learningObjectives: z.array(z.string().min(5)).min(2).max(6),
  prerequisites: z.array(z.string()).min(1),
  materialsNeeded: z.array(z.string()).min(1),
  lessonFlow: z.array(LessonPhaseSchema).min(3).max(8),
  differentiatedInstruction: DifferentiatedInstructionSchema,
  boardWork: z.string().min(5),
  homework: z.string().min(5),
  assessmentCriteria: z.array(z.string().min(3)).min(2).max(8),
  crossCurricularLinks: z.string().optional(),
  teacherReflection: z.string().optional(),
});
export type LessonPlanAIResponse = z.infer<typeof LessonPlanAIResponseSchema>;

export const GenerateLessonPlanRequestSchema = z.object({
  classNum: z.number().int().min(1).max(12),
  subject: z.string().min(1),
  chapter: z.string().min(1),
  topic: z.string().optional(),
  duration: z.enum(["1 Period (40 min)", "2 Periods (80 min)", "Full Day Project"]),
  teachingMethod: z.enum([
    "Lecture",
    "Activity-Based",
    "Discussion",
    "Demonstration",
    "Project-Based",
    "Blended",
  ]),
  language: z.enum(["English", "Hindi", "Marathi", "Bilingual"]).default("English"),
  includeReflection: z.boolean().default(true),
});
export type GenerateLessonPlanRequest = z.infer<typeof GenerateLessonPlanRequestSchema>;
