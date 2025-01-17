import { z } from 'zod';

export const AgentSchema = z.object({
  companyId: z.string(),
  default: z.boolean(),
  id: z.string(),
  name: z.string(),
  status: z.union([z.boolean(), z.literal(null)]),
});
// Prompt Types
export const PromptSchema = z.object({
  name: z.string(),
  category: z.string(),
  content: z.string(),
  description: z.string().optional(),
  arguments: z.array(z.unknown()),
});

export const PromptResponseSchema = z.object({
  data: z.object({
    prompt: PromptSchema,
  }),
});

export const PromptsResponseSchema = z.object({
  data: z.object({
    prompts: z.array(PromptSchema),
  }),
});
export const PromptCategorySchema = z.string();
export const PromptCategoriesResponseSchema = z.object({
  data: z.object({
    promptCategories: z.array(z.string()),
  }),
});

export type Prompt = z.infer<typeof PromptSchema>;
export type Agent = z.infer<typeof AgentSchema>;
export const CompanySchema = z.object({
  agents: z.array(AgentSchema),
  id: z.string(),
  companyId: z.union([z.string(), z.null()]),
  name: z.string(),
  primary: z.boolean(),
  roleId: z.number(),
});

export type Company = z.infer<typeof CompanySchema>;
export const UserSchema = z.object({
  companies: z.array(CompanySchema),
  email: z.string(),
  firstName: z.string(),
  id: z.string(),
  lastName: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const UserResponseSchema = z.object({
  data: z.object({
    user: UserSchema,
  }),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
// Additional type definitions

export const ProviderSchema = z.object({
  name: z.string(),
  friendlyName: z.string(),
  description: z.string(),
  services: z.array(z.unknown()),
  settings: z.record(z.unknown()),
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

export const InvitationSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  email: z.string(),
  createdAt: z.string(),
  inviterId: z.string(),
  isAccepted: z.boolean(),
  roleId: z.string(),
});

export const InvitationsResponseSchema = z.object({
  data: z.object({
    invitations: z.array(InvitationSchema),
  }),
});
// Enhanced types for command arguments
export const CommandArgValueSchema = z.object({
  value: z.string(),
});

export const CommandArgSchema = z.object({
  name: z.string(),
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

// Enhanced types for chains
export const ChainStepPromptSchema = z.object({
  chainName: z.string(),
  commandName: z.string(),
  promptCategory: z.string(),
  promptName: z.string(),
});

export const ChainStepSchema = z.object({
  agentName: z.string(),
  prompt: ChainStepPromptSchema,
  promptType: z.string(),
  step: z.number(),
});

export const ChainSchema = z.object({
  id: z.string(),
  chainName: z.string(),
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

// Enhanced types for conversations
export const ConversationMetadataSchema = z.object({
  agentId: z.string(),
  attachmentCount: z.number(),
  createdAt: z.string(),
  hasNotifications: z.boolean(),
  id: z.string(),
  name: z.string(),
  summary: z.string().optional(),
  updatedAt: z.string(),
});

export const MessageSchema = z.object({
  id: z.string(),
  message: z.string(),
  role: z.string(),
  timestamp: z.string(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
  feedbackReceived: z.boolean().optional(),
});

export const ConversationSchema = z.object({
  messages: z.array(MessageSchema),
  metadata: ConversationMetadataSchema,
});

export const ConversationEdgeSchema = z.object({
  attachmentCount: z.number(),
  agentId: z.string(),
  createdAt: z.string(),
  hasNotifications: z.boolean(),
  id: z.string(),
  name: z.string(),
  summary: z.string().optional(),
  updatedAt: z.string(),
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

export type ChainStepPrompt = z.infer<typeof ChainStepPromptSchema>;

export type ChainStep = z.infer<typeof ChainStepSchema>;

export type Invitation = z.infer<typeof InvitationSchema>;
