import { simulateLatency } from '@/core/data/simulate';
import { AppError } from '@/core/errors/app-error';
import { mockUsers } from '@/features/users/data/users.mock';

import type {
  OutgoingMessage,
  ChatRepository,
  Conversation,
  ConversationFilter,
  ConversationPreview,
  Message,
} from '../domain/chat';

const previews: ConversationPreview[] = [
  {
    id: 'c-mariana',
    title: 'Mariana R.',
    counterpart: mockUsers.mariana,
    lastMessage: '¡Va! ¿Nos vemos en el Zócalo?',
    timeLabel: 'ahora',
    unread: 2,
    kind: 'offer',
    offerLabel: 'Oferta: bici por cámara',
    highlight: true,
  },
  {
    id: 'c-joseluis',
    title: 'José Luis · plomero',
    counterpart: mockUsers.joseLuis,
    lastMessage: 'Llego en 12 minutos, ya voy en camino',
    timeLabel: '10:42',
    unread: 0,
    kind: 'service',
  },
  {
    id: 'c-carlos',
    title: 'Carlos A.',
    counterpart: mockUsers.carlos,
    lastMessage: 'Te ofrezco mi patineta por la bici',
    timeLabel: '9:15',
    unread: 1,
    kind: 'offer',
  },
  {
    id: 'c-ana',
    title: 'Ana G.',
    counterpart: mockUsers.ana,
    lastMessage: '¡Gracias! Te dejé 5 estrellas',
    timeLabel: 'Ayer',
    unread: 0,
    kind: 'general',
  },
  {
    id: 'c-support',
    title: 'Soporte SwapIt',
    counterpart: 'support',
    lastMessage: 'Tu verificación quedó lista',
    timeLabel: 'Lun',
    unread: 0,
    kind: 'support',
  },
];

const conversations: Record<string, Conversation> = {
  'c-mariana': {
    id: 'c-mariana',
    counterpart: mockUsers.mariana,
    online: true,
    isTyping: true,
    offer: { give: 'bike', receive: 'camera', title: 'Bici por Canon AE-1', status: 'Cambio justo' },
    quickReplies: ['Sí, a las 17:30', 'Compartir ubicación', 'Mejor otro día'],
    messages: [
      { id: 'm1', from: 'them', type: 'text', text: '¡Hola! ¿La bici tiene algún detalle?' },
      { id: 'm2', from: 'me', type: 'text', text: 'Está como nueva, solo le cambié las llantas.' },
      { id: 'm3', from: 'me', type: 'photo', kind: 'bike' },
      { id: 'm4', from: 'them', type: 'text', text: '¡Va! ¿Nos vemos en el Zócalo?' },
    ],
  },
};

conversations['c-support'] = {
  id: 'c-support',
  counterpart: mockUsers.support,
  online: true,
  isTyping: false,
  quickReplies: ['Tengo un problema con un cambio', 'Duda sobre pagos', 'Reportar a alguien'],
  messages: [
    { id: 's1', from: 'them', type: 'text', text: 'Tu verificación quedó lista' },
    { id: 's2', from: 'them', type: 'text', text: 'Hola, soy Valeria del equipo de SwapIt. ¿En qué te ayudo?' },
  ],
};

const fallbackConversation = (id: string): Conversation => {
  const preview = previews.find((p) => p.id === id);
  if (!preview || preview.counterpart === 'support') throw new AppError('not_found', `Conversation ${id} not found`, 404);
  return {
    id,
    counterpart: preview.counterpart,
    online: false,
    isTyping: false,
    quickReplies: ['¡Gracias!', '¿Sigue disponible?'],
    messages: [{ id: `${id}-1`, from: 'them', type: 'text', text: preview.lastMessage }],
  };
};

export class MockChatRepository implements ChatRepository {
  listConversations(filter: ConversationFilter) {
    const result = previews.filter((p) => {
      if (filter === 'offers') return p.kind === 'offer';
      if (filter === 'services') return p.kind === 'service';
      return true;
    });
    return simulateLatency(result, 350);
  }

  getConversation(id: string) {
    return simulateLatency(conversations[id] ?? fallbackConversation(id), 250);
  }

  sendMessage(conversationId: string, outgoing: OutgoingMessage) {
    const message: Message = { id: `m-${Date.now()}`, from: 'me', ...outgoing };
    conversations[conversationId]?.messages.push(message);
    return simulateLatency(message, 200);
  }
}
