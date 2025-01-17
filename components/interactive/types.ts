import { z } from 'zod';

const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  default: z.boolean(),
  companyId: z.string(),
  status: z.string(),
  settings: z.record(z.unknown()),
  commands: z.array(z.unknown()),
  agentExtensions: z.array(z.unknown()),
  agentProviders: z.array(z.unknown()),
});
export type Agent = z.infer<typeof AgentSchema>;
const MessageSchema = z.object({
  id: z.string(),
  message: z.string(),
  role: z.string(),
  timestamp: z.string(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
  feedbackReceived: z.boolean().optional(),
});
export type Message = z.infer<typeof MessageSchema>;
const ConversationSchema = z.object({
  conversationId: z.string(),
  messages: z.array(MessageSchema),
  metadata: z.record(z.unknown()).optional(),
  extensions: z.array(z.unknown()).optional(),
  extensionSettings: z.record(z.unknown()).optional(),
  externalSources: z.array(z.unknown()).optional(),
});
export type Conversation = z.infer<typeof ConversationSchema>;
const ChainStepPromptSchema = z.object({
  chainName: z.string(),
  commandName: z.string(),
  promptCategory: z.string(),
  promptName: z.string(),
});
export type ChainStepPrompt = z.infer<typeof ChainStepPromptSchema>;

const ChainStepSchema = z.object({
  agentName: z.string(),
  prompt: ChainStepPromptSchema,
  promptType: z.string(),
  step: z.number(),
});
export type ChainStep = z.infer<typeof ChainStepSchema>;

const ChainSchema = z.object({
  id: z.string(),
  chainName: z.string(),
  description: z.string().optional(),
  steps: z.array(ChainStepSchema),
});
export type Chain = z.infer<typeof ChainSchema>;

const InvitationSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  email: z.string(),
  createdAt: z.string(),
  inviterId: z.string(),
  isAccepted: z.boolean(),
  roleId: z.string(),
});
export type Invitation = z.infer<typeof InvitationSchema>;

const PromptSchema = z.object({
  name: z.string(),
  category: z.string(),
  content: z.string(),
  description: z.string().optional(),
  arguments: z.array(z.unknown()),
});
export type Prompt = z.infer<typeof PromptSchema>;

const ProviderSchema = z.object({
  name: z.string(),
  friendlyName: z.string(),
  description: z.string(),
  services: z.array(z.unknown()),
  settings: z.record(z.unknown()),
});
export type Provider = z.infer<typeof ProviderSchema>;

const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  companyId: z.string(),
  name: z.string(),
  primary: z.boolean(),
  roleId: z.string(),
  preferences: z.record(z.unknown()),
  userExists: z.boolean(),
  companies: z.object({
    agents: z.array(AgentSchema),
  }),
});
export type User = z.infer<typeof UserSchema>;

export {
  PromptSchema,
  ProviderSchema,
  UserSchema,
  AgentSchema,
  MessageSchema,
  ChainSchema,
  InvitationSchema,
  ConversationSchema,
};
