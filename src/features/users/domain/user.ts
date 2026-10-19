export type UserId = string;

/** Public card of a person shown across listings, chats and trades. */
export type UserSummary = {
  id: UserId;
  name: string;
  shortName: string;
  initials: string;
  avatarColor: string;
  verified: boolean;
  rating: number;
  responseTime?: string;
};

export type ProfileBadge = { id: string; label: string; icon: 'bolt' | 'swap' | 'shield'; color: string };

/** The signed-in person's private profile. */
export type Profile = UserSummary & {
  firstName: string;
  title: string;
  city: string;
  neighborhood: string;
  level: number;
  levelProgress: number;
  tradesToNextLevel: number;
  credits: number;
  creditsValue: number;
  creditsThisWeek: number;
  stats: { trades: number; reviews: number; reusedKg: number };
  badges: ProfileBadge[];
};

export interface UsersRepository {
  getMe(): Promise<Profile>;
}
