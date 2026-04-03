import { z } from "zod";

export const SubjectGradeAISchema = z.object({
  subject: z.string().min(1),
  remarks: z.string().min(3),
});

export const ReportCardAIResponseSchema = z.object({
  aiRemarks: z.string().min(10),
  strengths: z.array(z.string().min(3)).min(2),
  areasToImprove: z.array(z.string().min(3)).min(1),
  recommendations: z.array(z.string().min(3)).min(2),
  subjectRemarks: z.array(SubjectGradeAISchema).min(1),
  coScholastic: z.array(
    z.object({ activity: z.string(), grade: z.string() })
  ).min(1),
});
export type ReportCardAIResponse = z.infer<typeof ReportCardAIResponseSchema>;

export const GenerateReportCardRequestSchema = z.object({
  studentId: z.string().min(1),
  term: z.enum(["Term 1", "Term 2", "Annual"]),
  academicYear: z.string().min(4),
  attendance: z
    .object({
      totalDays: z.number().int().min(0),
      presentDays: z.number().int().min(0),
    })
    .optional(),
  teacherComments: z.string().optional(),
  principalComments: z.string().optional(),
});
export type GenerateReportCardRequest = z.infer<typeof GenerateReportCardRequestSchema>;
