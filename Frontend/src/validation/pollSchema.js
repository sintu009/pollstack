import { z } from "zod";

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
});

const questionSchema = z.object({
  title: z.string().min(3, "Question must be at least 3 characters"),
  options: z.array(optionSchema).min(2, "At least 2 options required"),
  isMandatory: z.boolean().default(true),
});

export const createPollSchema = z.object({
  title: z.string().min(3, "Poll title must be at least 3 characters"),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "At least 1 question required"),
  isAnonymous: z.boolean().default(false),
  expiresAt: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Expiry must be in the future",
  }),
});
