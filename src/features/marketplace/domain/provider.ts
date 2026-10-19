import type { UserSummary } from '@/features/users/domain/user';

export const serviceCategories = [
  { id: 'plumbing', label: 'Plomería', icon: 'drop' },
  { id: 'carpentry', label: 'Carpintería', icon: 'hammer' },
  { id: 'electrical', label: 'Electricidad', icon: 'bolt' },
  { id: 'painting', label: 'Pintura', icon: 'paintRoller' },
  { id: 'locksmith', label: 'Cerrajería', icon: 'key' },
  { id: 'masonry', label: 'Albañilería', icon: 'bricks' },
  { id: 'gardening', label: 'Jardinería', icon: 'leaf' },
  { id: 'cleaning', label: 'Limpieza', icon: 'sparkleSolo' },
  { id: 'moving', label: 'Mudanzas', icon: 'truck' },
  { id: 'appliances', label: 'Aparatos', icon: 'plug' },
  { id: 'welding', label: 'Herrería', icon: 'wrench' },
] as const;

export type ServiceCategory = (typeof serviceCategories)[number]['id'];

export type GeoPoint = { lat: number; lng: number };

/** `near` = the person's location; results are ranked and placed around it. */
export type ProviderFilter = { category?: ServiceCategory; query?: string; near?: GeoPoint };

export type ServiceOffering = { id: string; name: string; price: string };
export type Review = { id: string; author: UserSummary; stars: number; text: string };

export type Provider = UserSummary & {
  category: ServiceCategory;
  trade: string;
  experience: string;
  available: boolean;
  availableToday: boolean;
  reviewsCount: number;
  onTimeRate: number;
  distanceKm: number;
  /** Approximate work-zone location (never a home address). */
  location: { lat: number; lng: number };
  jobsDone: number;
  services: ServiceOffering[];
  featuredReview: Review;
  hireFrom: number;
};

export type JobStage = 'confirmed' | 'on_the_way' | 'working' | 'done';

export type JobTracking = {
  id: string;
  provider: Provider;
  etaMinutes: number;
  arrivalCode: string;
  stage: JobStage;
  /** Fraction of the current stage completed (drives the segmented bar). */
  stageProgress: number;
  updatedSecondsAgo: number;
};

export type ProviderRequest = { id: string; title: string; client: UserSummary; distanceKm: number; when: string; price: number };
export type AgendaItem = { id: string; time: string; title: string; client: string; price: number; color: string };

export type ProviderDashboard = {
  receivingJobs: boolean;
  weekEarnings: number;
  weekDelta: number;
  dailyEarnings: { day: string; amount: number }[];
  bestDayIndex: number;
  requests: ProviderRequest[];
  agenda: AgendaItem[];
};

export interface MarketplaceRepository {
  listProviders(filter?: ProviderFilter): Promise<Provider[]>;
  getProvider(id: string): Promise<Provider>;
  getTracking(jobId: string): Promise<JobTracking>;
  getDashboard(): Promise<ProviderDashboard>;
  hire(providerId: string, serviceId: string): Promise<{ jobId: string }>;
}
