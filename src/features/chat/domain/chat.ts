import type { ListingKind } from '@/features/catalog/domain/listing';
import type { UserSummary } from '@/features/users/domain/user';

export type ConversationFilter = 'all' | 'offers' | 'services';

export type ConversationPreview = {
  id: string;
  title: string;
  counterpart: UserSummary | 'support';
  lastMessage: string;
  timeLabel: string;
  unread: number;
  kind: 'offer' | 'service' | 'general' | 'support';
  offerLabel?: string;
  highlight?: boolean;
};

export type Message =
  | { id: string; from: 'me' | 'them'; type: 'text'; text: string }
  | { id: string; from: 'me' | 'them'; type: 'photo'; kind: ListingKind }
  | { id: string; from: 'me' | 'them'; type: 'media'; uri: string; mediaType: 'image' | 'video'; durationMs?: number };

/** What the person sends: text or an attachment from the camera / gallery. */
export type OutgoingMessage =
  { type: 'text'; text: string } | { type: 'media'; uri: string; mediaType: 'image' | 'video'; durationMs?: number };

export type AttachedOffer = { give: ListingKind; receive: ListingKind; title: string; status: string };

export type Conversation = {
  id: string;
  counterpart: UserSummary;
  online: boolean;
  offer?: AttachedOffer;
  messages: Message[];
  quickReplies: string[];
  isTyping: boolean;
};

export interface ChatRepository {
  listConversations(filter: ConversationFilter): Promise<ConversationPreview[]>;
  getConversation(id: string): Promise<Conversation>;
  sendMessage(conversationId: string, message: OutgoingMessage): Promise<Message>;
}
