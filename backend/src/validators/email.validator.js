import { z } from 'zod';

const emailPayloadSchema = z.object({
  to: z.string().email('A valid recipient email is required'),
  subject: z.string().min(1, 'Subject is required').max(200),
  firstName: z.string().min(1, 'First name is required').max(100),
  emailTitle: z.string().min(1, 'Email title is required').max(200),
  emailSubtitle: z.string().max(300).optional().default(''),
  contentHtml: z.string().min(1, 'Email body is required').max(10000),
  ctaLabel: z.string().max(100).optional(),
  ctaUrl: z.union([z.string().url('CTA URL must be valid'), z.literal('')]).optional(),
});

export function validateEmailPayload(body) {
  return emailPayloadSchema.safeParse(body);
}

export function validatePreviewPayload(body) {
  return emailPayloadSchema.omit({ to: true }).safeParse(body);
}
