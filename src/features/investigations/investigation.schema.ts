import { z } from 'zod';

export enum IssueCategory {
  FailedPayment = 'failed_payment',
  PossibleDuplicate = 'possible_duplicate',
  RefundIssue = 'refund_issue',
  Unknown = 'unknown',
};

export const investigationOutputSchema = z.object({
  transactionId: z.string().nullable(),
  issueCategory: z.enum(IssueCategory),
  findings: z.array(z.string()),
  missingEvidence: z.array(z.string()),
  recommendedNextSteps: z.array(z.string()),
});

export type InvestigationOutput = z.infer<typeof investigationOutputSchema>;
