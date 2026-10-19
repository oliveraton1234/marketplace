import { router } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Chip,
  colors,
  Field,
  GlassDock,
  gradients,
  Icon,
  IconButton,
  Reveal,
  Screen,
  SectionLabel,
  Skeleton,
  Text,
} from '@/design-system';
import { LinearGradient } from 'expo-linear-gradient';

import { ListingCard } from '../components/ListingCard';
import { useNearbyListings } from '../hooks/use-listings';
import { goBack } from '@/shared/lib/navigation';

const recent = ['consola retro', 'cámara', 'guitarra', 'audífonos'];

function NoResults({ query }: { query: string }) {
  return (
    <Reveal from="fade" style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon name="searchX" size={64} color={colors.primaryInk} strokeWidth={1.5} />
      </View>
      <Text variant="title3" align="center" accessibilityRole="header">
        Aún no hay {query} cerca
      </Text>
      <Text variant="body" color={colors.textSecondary} align="center" style={styles.emptyCopy}>
        Prueba ampliando la distancia o déjanos avisarte cuando alguien publique una.
      </Text>
      <View style={styles.row}>
        <Chip label="Buscar a 25 km" />
        <Chip label="Quitar filtros" />
      </View>
    </Reveal>
  );
}

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query.trim());
  const results = useNearbyListings({ query: deferred || undefined });
  const searching = deferred.length > 0;
  const noResults = searching && !results.isPending && results.data?.length === 0;

  return (
    <Screen
      aurora={[{ tint: 'violet', size: 350, left: 20, top: 140, falloff: 0.64 }]}
      gap={18}
      footer={
        noResults ? (
          <GlassDock radius={26} style={styles.alert}>
            <View style={styles.alertBody}>
              <View style={styles.row}>
                <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bell}>
                  <Icon name="bell" size={22} color={colors.surfaceSolid} />
                </LinearGradient>
                <View style={styles.flex}>
                  <Text variant="bodyBold">Crear alerta</Text>
                  <Text variant="footnote" color={colors.textSecondary}>
                    Te avisamos en cuanto aparezca una
                  </Text>
                </View>
              </View>
              <Button label="Activar alerta" size="sm" onPress={() => router.push('/notifications')} />
            </View>
          </GlassDock>
        ) : undefined
      }>
      <View style={styles.row}>
        <IconButton icon="chevronLeft" label="Regresar" onPress={() => goBack()} />
        <Field
          autoFocus
          shape="pill"
          icon="search"
          height={52}
          placeholder="¿Qué buscas?"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          containerStyle={styles.flex}
        />
      </View>

      {!searching ? (
        <View style={styles.section}>
          <SectionLabel>Búsquedas populares</SectionLabel>
          <View style={styles.wrap}>
            {recent.map((r) => (
              <Chip key={r} size="sm" label={r} onPress={() => setQuery(r)} />
            ))}
          </View>
        </View>
      ) : results.isPending ? (
        <View style={styles.wrap}>
          <Skeleton height={190} width="48%" radius={24} />
          <Skeleton height={190} width="48%" radius={24} />
        </View>
      ) : noResults ? (
        <NoResults query={deferred} />
      ) : (
        <View style={styles.wrap}>
          {results.data?.map((l, i) => (
            <Reveal key={l.id} index={i}>
              <ListingCard listing={l} />
            </Reveal>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  section: { gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  empty: { alignItems: 'center', gap: 10, marginTop: 40 },
  emptyIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCopy: { maxWidth: 300, marginBottom: 6 },
  alert: {},
  alertBody: { padding: 16, gap: 12 },
  bell: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
