import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, colors, LogoMark, Text } from '@/design-system';

export default function NotFound() {
  return (
    <View style={styles.root}>
      <LogoMark size={96} />
      <Text variant="title3" align="center">
        Esta pantalla no existe
      </Text>
      <Button label="Ir al inicio" onPress={() => router.replace('/')} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24, backgroundColor: colors.background },
  button: { alignSelf: 'stretch' },
});
