import { z } from "zod";
import { investigationOutputSchema } from "./investigation.schema";

// The server adds status only after normal, validated completion.
export const investigationResponseSchema = z.object({
  analysis: investigationOutputSchema,
  status: z.literal("complete"),
});
