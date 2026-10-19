# SwapIt — app móvil

React Native + Expo (SDK 58) con Expo Router, TypeScript estricto y React Compiler.
El diseño replica el canvas **SwapIt aurora claro** (tema claro).

## Correr la app

```bash
npm install
npx expo start
```

Presiona `i` (simulador iOS), `a` (Android) o escanea el QR con Expo Go.

Calidad: `npx tsc --noEmit` y `npx expo lint` deben pasar sin errores.

## Arquitectura

```
src/
├── app/              Rutas de Expo Router. Archivos delgados: solo re-exportan pantallas.
├── core/             Infraestructura transversal
│   ├── config/       env.ts: URL por microservicio (EXPO_PUBLIC_*)
│   ├── di/           Composition root: elige adaptador local o HTTP por dominio
│   ├── http/         HttpClient (puerto) + FetchHttpClient (adaptador)
│   ├── errors/       AppError normalizado
│   ├── query/        React Query: cliente y fábrica de query keys
│   └── providers/    Todos los providers globales
├── design-system/    Tokens (color, tipografía, espaciado, motion) y componentes globales
├── features/         Un módulo por dominio de negocio
│   └── <dominio>/
│       ├── domain/   Tipos, reglas puras e interfaz del repositorio
│       ├── data/     Adaptadores (mock-*.repository / http-*.repository)
│       ├── hooks/    Casos de uso con React Query
│       ├── store/    Estado de cliente (zustand) cuando aplica
│       ├── components/
│       └── screens/
└── shared/lib/       Utilidades sin dependencia de UI (formato, haptics)
```

Principios aplicados:

- **SOLID / Clean Architecture**: las pantallas dependen de interfaces (`ListingsRepository`, `ChatRepository`…), nunca de `fetch`. Cambiar de datos locales a microservicios se hace solo en `core/di/repositories.ts`.
- **Feature-first**: cada dominio es independiente y mapea a un microservicio de `../services`.
- **Imports con `@/`**: `@/design-system`, `@/features/...`, `@/core/...`.
- **Reglas de negocio puras** y testeables (`trades/domain/offer-balance.ts`).
- **Accesibilidad**: labels en todos los botones de ícono, roles y estados, objetivos táctiles ≥ 44 pt, respeto a "Reducir movimiento".
- **Motion**: Reanimated 4 + Gesture Handler 3 (entradas escalonadas, swipe con física, resortes, haptics).

## Conectar el backend

Copia `.env.example` a `.env`, cambia `EXPO_PUBLIC_DATA_SOURCE=http` y define las URLs.
Contratos de cada servicio: `../services/<servicio>/README.md`.
