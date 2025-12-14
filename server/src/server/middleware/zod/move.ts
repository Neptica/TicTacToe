import * as z from "zod";

export const Move = z.object({
  i: z.number().min(0).max(2),
  j: z.number().min(0).max(2),
  trueId: z.string(),
});

export type move = z.infer<typeof Move>;
