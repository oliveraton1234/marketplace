import type { IconName } from '@/design-system';
import { palette } from '@/design-system/tokens';

import type { ListingKind } from '../domain/listing';

/**
 * Visual identity per listing kind while real photos are not uploaded:
 * a glyph plus a soft two-stop wash (inner → outer) and an ink color.
 */
export const listingArt: Record<ListingKind, { icon: IconName; wash: readonly [string, string]; ink: string; tile: string }> = {
  camera: { icon: 'camera', wash: ['#E3D6FF', '#F6F2FF'], ink: palette.violetInk, tile: palette.violetNight },
  headphones: { icon: 'headphones', wash: ['#CFF3E3', '#EFFAF5'], ink: palette.teal, tile: palette.violetDeep },
  guitar: { icon: 'music', wash: ['#F7D9F2', '#FFF8FD'], ink: palette.orchid, tile: palette.plum },
  bike: { icon: 'bike', wash: ['#D3F5E6', '#EFFAF5'], ink: palette.mintInk, tile: palette.forestDeep },
  service: { icon: 'wrench', wash: ['#E3D6FF', '#F6F2FF'], ink: palette.violetInk, tile: palette.violetNight },
};
