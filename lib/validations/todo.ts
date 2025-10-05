import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  completed: z.boolean().default(false),
});

export type TodoInput = z.infer<typeof todoSchema>;
