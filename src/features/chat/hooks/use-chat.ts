import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRepositories } from '@/core/di/RepositoriesProvider';
import { queryKeys } from '@/core/query/keys';

import type { Conversation, ConversationFilter, OutgoingMessage } from '../domain/chat';

export function useConversations(filter: ConversationFilter) {
  const { chat } = useRepositories();
  return useQuery({ queryKey: queryKeys.chat.list(filter), queryFn: () => chat.listConversations(filter) });
}

export function useConversation(id: string) {
  const { chat } = useRepositories();
  return useQuery({ queryKey: queryKeys.chat.conversation(id), queryFn: () => chat.getConversation(id) });
}

/** Optimistic send: the bubble appears instantly and reconciles when the service answers. */
export function useSendMessage(conversationId: string) {
  const { chat } = useRepositories();
  const client = useQueryClient();
  const key = queryKeys.chat.conversation(conversationId);

  return useMutation({
    mutationFn: (outgoing: OutgoingMessage) => chat.sendMessage(conversationId, outgoing),
    onMutate: async (outgoing) => {
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<Conversation>(key);
      client.setQueryData<Conversation>(
        key,
        (current) =>
          current && {
            ...current,
            isTyping: false,
            messages: [...current.messages, { id: `optimistic-${Date.now()}`, from: 'me', ...outgoing }],
          },
      );
      return { previous };
    },
    onError: (_error, _outgoing, context) => context?.previous && client.setQueryData(key, context.previous),
  });
}
