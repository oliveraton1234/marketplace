import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { Button, CheckboxRow, colors, Icon, RadioCard, Reveal, Screen, ScreenHeader, Text, TextArea } from '@/design-system';
import { mockUsers } from '@/features/users/data/users.mock';

import { reportReasons, type ReportReason } from '../domain/safety';
import { useReportUser } from '../hooks/use-safety';
import { goBack } from '@/shared/lib/navigation';

export function ReportScreen() {
  const target = mockUsers.mariana;
  const [reason, setReason] = useState<ReportReason>('fraud');
  const [details, setDetails] = useState('');
  const [block, setBlock] = useState(true);
  const report = useReportUser();

  const submit = () =>
    report.mutate(
      { userId: target.id, reason, details, block },
      {
        onSuccess: () => {
          Alert.alert('Gracias por avisarnos', 'Nuestro equipo revisará tu reporte en menos de 24 horas.');
          goBack();
        },
      },
    );

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen
        aurora={[{ tint: 'pink', size: 420, right: -150, top: -160 }]}
        gap={16}
        footer={
          <View style={styles.footer}>
            <View style={styles.anon}>
              <Icon name="lock" size={14} color={colors.textTertiary} strokeWidth={2.25} />
              <Text variant="footnote" color={colors.textTertiary}>
                Tu reporte es anónimo
              </Text>
            </View>
            <Button
              label={report.isPending ? 'Enviando…' : 'Enviar reporte'}
              size="md"
              disabled={report.isPending}
              onPress={submit}
            />
          </View>
        }>
        <ScreenHeader
          leading="close"
          subtitle={
            <Text variant="callout" color={colors.textSecondary}>
              Reportar a <Text variant="calloutStrong">{target.name}</Text>
            </Text>
          }
        />
        <Text variant="title2" accessibilityRole="header" style={styles.title}>
          ¿Qué pasó?
        </Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Motivo" style={styles.reasons}>
          {reportReasons.map((r, i) => (
            <Reveal key={r.id} index={i}>
              <RadioCard label={r.label} selected={reason === r.id} onPress={() => setReason(r.id)} />
            </Reveal>
          ))}
        </View>
        <TextArea placeholder="Cuéntanos más (opcional)" value={details} onChangeText={setDetails} maxLength={500} />
        <CheckboxRow label={`También bloquear a ${target.shortName}`} checked={block} onChange={setBlock} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { marginTop: 4 },
  reasons: { gap: 8 },
  footer: { gap: 10 },
  anon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
