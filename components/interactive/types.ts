import { z } from 'zod';
import '@/lib/zodGQL';

// ============================================================================
// Base Types and Enums
// ============================================================================

export const RoleSchema = z.enum(['user', 'system', 'assistant', 'function']);

export const PromptCategorySchema = z.enum(['system', 'user', 'assistant', 'function', 'chain']);

// ============================================================================
// Agent Related Schemas
// ============================================================================

export const AgentSchema = z.object({
  companyId: z.string().uuid(),
  default: z.boolean(),
  id: z.string().uuid(),
  name: z.string().min(1),
  status: z.union([z.boolean(), z.literal(null)]),
});

export type Agent = z.infer<typeof AgentSchema>;

// ============================================================================
// Prompt Related Schemas
// ============================================================================

export const PromptArgumentSchema = z.object({
  name: z.string(),
});

export const PromptSchema = z.object({
  name: z.string(),
  category: z.string(),
  content: z.string(),
  description: z.string().optional(),
  arguments: z.array(PromptArgumentSchema),
});

// Remove the nesting of PromptSchema inside a 'prompt' object
export const PromptResponseSchema = PromptSchema;

export const PromptsResponseSchema = z.object({
  prompts: z.array(PromptSchema),
});

export const PromptCategoriesResponseSchema = z.object({
  promptCategories: z.array(z.string()),
});

export type Prompt = z.infer<typeof PromptSchema>;
export type PromptArgument = z.infer<typeof PromptArgumentSchema>;

// ============================================================================
// Company Related Schemas
// ============================================================================

export const CompanySchema = z.object({
  agents: z.array(AgentSchema),
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

export const UserResponseSchema = z.object({
  data: z.object({
    user: UserSchema,
  }),
});

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;

// ============================================================================
// Provider Related Schemas
// ============================================================================

export const ProviderServiceSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  config: z.record(z.unknown()),
});

export const ProviderSettingSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
  type: z.enum(['string', 'number', 'boolean', 'object']),
  required: z.boolean(),
});

export const ProviderSchema = z.object({
  name: z.string().min(1),
  friendlyName: z.string().min(1),
  description: z.string(),
  services: z.array(ProviderServiceSchema),
  settings: z.record(ProviderSettingSchema),
});

export const ProviderResponseSchema = z.object({
  data: z.object({
    provider: ProviderSchema,
  }),
});

export const ProvidersResponseSchema = z.object({
  data: z.object({
    providers: z.array(ProviderSchema),
  }),
});

export type Provider = z.infer<typeof ProviderSchema>;

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

export const InvitationsResponseSchema = z.object({
  data: z.object({
    invitations: z.array(InvitationSchema),
  }),
});

export type Invitation = z.infer<typeof InvitationSchema>;

// ============================================================================
// Command Related Schemas
// ============================================================================

export const CommandArgValueSchema = z.object({
  value: z.string(),
});

export const CommandArgSchema = z.object({
  name: z.string().min(1),
  value: CommandArgValueSchema,
});

export const CommandArgsResponseSchema = z.object({
  data: z.object({
    commandArgs: z.object({
      args: z.array(CommandArgSchema),
    }),
  }),
});

export type CommandArgs = z.infer<typeof CommandArgsResponseSchema>;

// ============================================================================
// Chain Related Schemas
// ============================================================================

export const ChainStepPromptSchema = z.object({
  chainName: z.string().min(1),
  commandName: z.string().min(1),
  promptCategory: PromptCategorySchema,
  promptName: z.string().min(1),
});

export const ChainStepSchema = z.object({
  agentName: z.string().min(1),
  prompt: ChainStepPromptSchema,
  promptType: z.string().min(1),
  step: z.number().int().nonnegative(),
});

export const ChainSchema = z.object({
  id: z.string().uuid(),
  chainName: z.string().min(1),
  description: z.string().optional(),
  steps: z.array(ChainStepSchema),
});

export const ChainResponseSchema = z.object({
  data: z.object({
    chain: ChainSchema,
  }),
});

export const ChainsResponseSchema = z.object({
  data: z.object({
    chains: z.array(ChainSchema),
  }),
});

export type Chain = z.infer<typeof ChainSchema>;
export type ChainStepPrompt = z.infer<typeof ChainStepPromptSchema>;
export type ChainStep = z.infer<typeof ChainStepSchema>;

// ============================================================================
// Conversation Related Schemas
// ============================================================================

export const ConversationMetadataSchema = z.object({
  agentId: z.string().uuid(),
  attachmentCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  hasNotifications: z.boolean(),
  id: z.string().uuid(),
  name: z.string().min(1),
  summary: z.string().optional(),
  updatedAt: z.string().datetime(),
});

export const MessageSchema = z.object({
  id: z.string().uuid(),
  message: z.string().min(1),
  role: RoleSchema,
  timestamp: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  updatedBy: z.string().uuid().optional(),
  feedbackReceived: z.boolean().optional(),
});

export const ConversationSchema = z.object({
  messages: z.array(MessageSchema),
  metadata: ConversationMetadataSchema,
});

export const ConversationEdgeSchema = z.object({
  attachmentCount: z.number().int().nonnegative(),
  agentId: z.string().uuid(),
  createdAt: z.string().datetime(),
  hasNotifications: z.boolean(),
  id: z.string().uuid(),
  name: z.string().min(1),
  summary: z.string().optional(),
  updatedAt: z.string().datetime(),
});

export const ConversationsResponseSchema = z.object({
  data: z.object({
    conversations: z.object({
      edges: z.array(ConversationEdgeSchema),
      pageInfo: z.object({}).passthrough(),
    }),
  }),
});

export type Conversation = z.infer<typeof ConversationSchema>;
export type ConversationEdge = z.infer<typeof ConversationEdgeSchema>;
export type Message = z.infer<typeof MessageSchema>;
