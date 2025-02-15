import useSWR, { SWRResponse } from 'swr';

// Import all types from the centralized schema file
import { RoleSchema, UserSchema } from '@/components/jrg/auth/types/types';
import { z } from 'zod';
import log from '../../jrg/next-log/log';
import { createGraphQLClient } from './lib';

export const ConversationMetadataSchema = z.object({
  agentId: z.string().uuid(),
  attachmentCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  hasNotifications: z.boolean(),
  id: z.string().uuid(),
  name: z.string().min(1),
  summary: z.unknown(),
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
});

export const ConversationEdgeSchema = z.object({
  attachmentCount: z.number().int().nonnegative(),
  createdAt: z.string(), // TODO Figure out why this errors: .datetime(),
  hasNotifications: z.boolean(),
  id: z.string().uuid(),
  name: z.string().min(1),
  summary: z.unknown(),
  updatedAt: z.string(), // TODO Figure out why this errors: .datetime(),.datetime(),
});

export const AppStateSchema = z.object({
  state: z.object({
    conversations: z.object({
      edges: z.array(ConversationEdgeSchema),
    }),
    currentConversation: z.object({
      messages: z.array(MessageSchema),
      metadata: ConversationMetadataSchema,
    }),
    notifications: z.array(
      z.object({
        conversationId: z.string().uuid(),
        conversationName: z.string(),
        message: z.string(),
        messageId: z.string().uuid(),
        timestamp: z.string().datetime(),
        role: z.string(),
      }),
    ),
    user: UserSchema,
  }),
});

export type Conversation = z.infer<typeof AppStateSchema>;
export type ConversationEdge = z.infer<typeof ConversationEdgeSchema>;
export type ConversationMetadata = z.infer<typeof ConversationMetadataSchema>;
export type Message = z.infer<typeof MessageSchema>;

// ============================================================================
// Conversation Related Hooks
// ============================================================================

// /**
//  * Hook to fetch and manage conversation data with real-time updates
//  * @param conversationId - Conversation ID to fetch
//  * @returns SWR response containing conversation data
//  */
// export function useAppState(conversationId: string): SWRResponse<Conversation | null> {
//   const client = createGraphQLClient();

//   return useSWR<Conversation | null>(
//     conversationId ? [`/conversation`, conversationId] : null,
//     async (): Promise<Conversation | null> => {
//       try {
//         const query = AppStateSchema.toGQL('subscription', 'appState', { conversationId });
//         log(['GQL useAppState() Query', query], {
//           client: 3,
//         });
//         const response = await client.request<Conversation>(query, { conversationId });
//         return response.conversation;
//       } catch (error) {
//         log(['GQL useAppState() Error', error], {
//           client: 1,
//         });
//         return null;
//       }
//     },
//     {
//       fallbackData: null,
//       refreshInterval: 1000, // Real-time updates
//     },
//   );
// }
// export function useConversation(conversationId: string): SWRResponse<Conversation | null> {
//   const client = createGraphQLClient();

//   return useSWR<Conversation | null>(
//     conversationId ? [`/conversation`, conversationId] : null,
//     async (): Promise<Conversation | null> => {
//       try {
//         const query = ConversationSchema.toGQL('query', 'conversation', { conversationId });
//         log(['GQL useConversation() Query', query], {
//           client: 3,
//         });
//         const response = await client.request<Conversation>(query, { conversationId });
//         return response.conversation;
//       } catch (error) {
//         log(['GQL useConversation() Error', error], {
//           client: 1,
//         });
//         return null;
//       }
//     },
//     {
//       fallbackData: null,
//       refreshInterval: 1000, // Real-time updates
//     },
//   );
// }
/**
 * Hook to fetch and manage all conversations with real-time updates
 * @returns SWR response containing array of conversation edges
 */
export function useConversations(): SWRResponse<ConversationEdge[]> {
  const client = createGraphQLClient();

  return useSWR<ConversationEdge[]>(
    '/conversations',
    async (): Promise<ConversationEdge[]> => {
      try {
        const query = z.object({ edges: ConversationEdgeSchema }).toGQL('query', 'GetConversations');
        log(['GQL useConversations() Query', query], {
          client: 3,
        });
        const response = await client.request<{ conversations: { edges: ConversationEdge[] } }>(query);
        return z
          .array(ConversationEdgeSchema)
          .parse(response.conversations.edges.filter((conv) => !conv.name.startsWith('PROMPT_TEST')));
      } catch (error) {
        log(['GQL useConversations() Error', error], {
          client: 1,
        });
        return [];
      }
    },
    { fallbackData: [] },
  );
}
