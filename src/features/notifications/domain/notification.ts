import type { Href } from 'expo-router';

export type NotificationKind = 'trade_accepted' | 'new_matches' | 'provider_on_way' | 'credits' | 'level_up';
export type NotificationFilter = 'all' | 'offers' | 'services';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  /** Rich text: `**bold**` segments are emphasized. */
  body: string;
  timeLabel: string;
  section: 'today' | 'week';
  unread: boolean;
  target: Href;
};

export interface NotificationsRepository {
  list(filter: NotificationFilter): Promise<AppNotification[]>;
  markAllRead(): Promise<void>;
}
