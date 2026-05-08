import { z } from "zod";
import { PRICING } from "./pricing";

const toolIds = Object.keys(PRICING) as [keyof typeof PRICING, ...Array<keyof typeof PRICING>];

export const useCaseSchema = z.enum(["coding", "writing", "data", "research", "mixed"]);

export const spendInputSchema = z
  .object({
    tool: z.enum(toolIds),
    plan: z.string().min(1),
    monthlySpend: z.number().finite().min(0).max(1_000_000),
    seats: z.number().int().min(1).max(10_000)
  })
  .superRefine((input, context) => {
    if (!PRICING[input.tool].plans.some((plan) => plan.id === input.plan)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Plan is not valid for the selected tool.",
        path: ["plan"]
      });
    }
  });

export const auditRequestSchema = z.object({
  teamSize: z.number().int().min(1).max(10_000),
  primaryUseCase: useCaseSchema,
  tools: z.array(spendInputSchema).min(1).max(20)
});

export const leadCaptureSchema = z.object({
  auditSlug: z.string().min(6).max(80),
  email: z.string().email(),
  companyName: z.string().max(120).optional().or(z.literal("")),
  role: z.string().max(120).optional().or(z.literal("")),
  teamSize: z.number().int().min(1).max(10_000).optional(),
  website: z.string().max(0).optional().or(z.literal(""))
});
