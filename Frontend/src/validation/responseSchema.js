import { z } from "zod";

const answerSchema = z.object({
  questionId: z.string().min(1, "Question ID required"),
  selectedOption: z.string().min(1, "Option selection required"),
});

export const submitResponseSchema = z.object({
  pollId: z.string().min(1, "Poll ID required"),
  answers: z.array(answerSchema).min(1, "At least 1 answer required"),
});
