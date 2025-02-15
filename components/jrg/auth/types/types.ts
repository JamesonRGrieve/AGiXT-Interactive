import { AgentSchema } from '@/components/interactive/hooks/useAgent';
import '@/components/jrg/zod2gql/zod2gql';
import { z } from 'zod';

export const RoleSchema = z.enum(['user', 'system', 'assistant', 'function']);
// ============================================================================
// Invitation Related Schemas
// ============================================================================

export const InvitationSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  inviterId: z.string().uuid(),
  isAccepted: z.boolean(),
  roleId: z.string().uuid(),
});

export type Invitation = z.infer<typeof InvitationSchema>;

// ============================================================================
// Company Related Schemas
// ============================================================================

export const CompanySchema = z.object({
  agents: z.array(
    AgentSchema.pick({
      companyId: true,
      default: true,
      id: true,
      name: true,
      status: true,
    }),
  ),
  id: z.string().uuid(),
  companyId: z.union([z.string().uuid(), z.null()]),
  name: z.string().min(1),
  primary: z.boolean(),
  roleId: z.number().int().positive(),
});

export type Company = z.infer<typeof CompanySchema>;

// ============================================================================
// User Related Schemas
// ============================================================================

export const UserSchema = z.object({
  companies: z.array(CompanySchema),
  email: z.string().email(),
  firstName: z.string().min(1),
  id: z.string().uuid(),
  lastName: z.string().min(1),
});

export type User = z.infer<typeof UserSchema>;
