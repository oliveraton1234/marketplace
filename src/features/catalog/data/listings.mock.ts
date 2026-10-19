import { mockUsers } from '@/features/users/data/users.mock';

import type { Listing } from '../domain/listing';

export const mockListings: Listing[] = [
  {
    id: 'l-canon-ae1',
    title: 'Canon AE-1',
    description: 'Cámara de rollo · lente 50 mm · muy buen estado',
    kind: 'camera',
    category: 'tech',
    condition: 'like_new',
    intents: ['sell', 'trade'],
    price: 3200,
    fairRange: { min: 2900, max: 3500 },
    distanceKm: 2.1,
    matchScore: 92,
    owner: mockUsers.mariana,
    wants: ['Bicis', 'Audífonos', 'Consolas'],
    interestNote: 'Le interesa tu bici',
    photos: 3,
  },
  {
    id: 'l-sony-headphones',
    title: 'Audífonos Sony',
    description: 'Cancelación de ruido · estuche original',
    kind: 'headphones',
    category: 'tech',
    condition: 'used',
    intents: ['trade'],
    price: null,
    fairRange: { min: 2100, max: 2600 },
    distanceKm: 3,
    matchScore: 87,
    owner: mockUsers.luis,
    wants: ['Ciclismo', 'Cámaras'],
    interestNote: 'Busca algo de ciclismo',
    photos: 2,
  },
  {
    id: 'l-yamaha-guitar',
    title: 'Guitarra Yamaha',
    description: 'Acústica · cuerdas nuevas · funda incluida',
    kind: 'guitar',
    category: 'music',
    condition: 'used',
    intents: ['sell', 'trade'],
    price: 2900,
    fairRange: { min: 2600, max: 3200 },
    distanceKm: 4.5,
    matchScore: 78,
    owner: mockUsers.sofia,
    wants: ['Bicis', 'Efectivo'],
    interestNote: 'Acepta cambio + efectivo',
    photos: 4,
  },
];

/** Value the signed-in user's bike is estimated at (used by fair-price meters). */
export const myOfferedItemValue = 3000;
