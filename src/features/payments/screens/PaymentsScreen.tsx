import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import {
  auroraPresets,
  Button,
  colors,
  gradients,
  Icon,
  ListGroup,
  palette,
  PressableScale,
  radii,
  Reveal,
  Screen,
  ScreenHeader,
  SectionLabel,
  Skeleton,
  Text,
  useCountUp,
  type IconName,
} from '@/design-system';
import { formatMoney, formatNumber } from '@/shared/lib/format';

import type { PaymentMethod, Transaction } from '../domain/wallet';
import { useWallet } from '../hooks/use-wallet';

function BalanceCard({ credits, value }: { credits: number; value: number }) {
  const shown = useCountUp(credits);
  return (
    <LinearGradient
      colors={gradients.hero}
      locations={[0, 0.55, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1.1, y: 1.2 }}
      style={styles.balance}>
      <Svg width={200} height={200} style={styles.glow}>
        <Defs>
          <RadialGradient id="walletGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={palette.mint} stopOpacity={0.4} />
            <Stop offset="0.7" stopColor={palette.mint} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={100} cy={100} r={100} fill="url(#walletGlow)" />
      </Svg>
      <SectionLabel color={palette.violetHaze}>Créditos Swap</SectionLabel>
      <View
        style={styles.amount}
        accessible
        accessibilityLabel={`${formatNumber(credits)} créditos, aproximadamente ${formatMoney(value)}`}>
        <Text variant="bigNumber" color={palette.white} style={styles.big}>
          {formatNumber(shown)}
        </Text>
        <Text variant="callout" color={palette.violetHaze}>
          ≈ {formatMoney(value)}
        </Text>
      </View>
      <View style={styles.balanceActions}>
        <Button label="Usar créditos" variant="inverse" size="sm" style={styles.flex} onPress={() => router.push('/home')} />
        <Button label="Cómo ganar más" variant="onDark" size="sm" style={styles.flex} onPress={() => router.push('/help')} />
      </View>
    </LinearGradient>
  );
}

function MethodCard({ method }: { method: PaymentMethod }) {
  const card = method.type === 'card';
  return (
    <PressableScale
      accessibilityLabel={
        card ? `${method.brand} terminación ${method.last4}${method.primary ? ', principal' : ''}` : 'Efectivo al entregar'
      }
      style={[styles.method, method.primary && styles.methodPrimary]}>
      <View style={styles.methodHead}>
        <Icon name={card ? 'creditCard' : 'cash'} size={26} color={card ? palette.violetSoft : palette.mint} />
        {method.primary && (
          <Text variant="captionBold" color={colors.success}>
            Principal
          </Text>
        )}
      </View>
      <View>
        <Text variant="bodyBold">{card ? `${method.brand} ···· ${method.last4}` : 'Efectivo'}</Text>
        <Text variant="caption" color={colors.textSecondary}>
          {card ? `Vence ${method.expires}` : 'Al entregar'}
        </Text>
      </View>
    </PressableScale>
  );
}

const txIcon: Record<Transaction['icon'], IconName> = { star: 'star', wrench: 'wrench', userPlus: 'userPlus' };

function TransactionRow({ tx }: { tx: Transaction }) {
  const positive = tx.amount > 0;
  const amount =
    tx.unit === 'credits'
      ? `${positive ? '+' : '−'}${Math.abs(tx.amount)} cr`
      : `${positive ? '+' : '−'}${formatMoney(Math.abs(tx.amount))}`;
  return (
    <View style={styles.tx} accessible accessibilityLabel={`${tx.title}, ${tx.caption}, ${amount}`}>
      <View style={[styles.txIcon, { backgroundColor: positive ? colors.accentTint : colors.primaryTintBold }]}>
        <Icon name={txIcon[tx.icon]} size={18} color={positive ? colors.success : colors.primaryInk} strokeWidth={2.25} />
      </View>
      <View style={styles.flexText}>
        <Text variant="bodyStrong">{tx.title}</Text>
        <Text variant="caption" color={colors.textTertiary}>
          {tx.caption}
        </Text>
      </View>
      <Text variant="bodyBold" color={positive ? colors.success : colors.text} style={styles.txAmount}>
        {amount}
      </Text>
    </View>
  );
}

export function PaymentsScreen() {
  const { data: wallet } = useWallet();

  return (
    <Screen aurora={auroraPresets.topLeft} gap={14}>
      <ScreenHeader title="Pagos y créditos" titleVariant="title3" />
      {!wallet ? (
        <Skeleton height={170} radius={28} />
      ) : (
        <>
          <Reveal>
            <BalanceCard credits={wallet.credits} value={wallet.creditsValue} />
          </Reveal>
          <SectionLabel>Métodos de pago</SectionLabel>
          <Reveal index={1} style={styles.methods}>
            {wallet.methods.map((m) => (
              <MethodCard key={m.id} method={m} />
            ))}
            <PressableScale accessibilityLabel="Agregar método de pago" style={styles.addMethod}>
              <Icon name="plus" size={22} color={colors.primaryInk} strokeWidth={2.5} />
            </PressableScale>
          </Reveal>
          <SectionLabel>Movimientos</SectionLabel>
          <Reveal index={2}>
            <ListGroup framed={false}>
              {wallet.transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </ListGroup>
          </Reveal>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexText: { flex: 1, gap: 2 },
  balance: { padding: 18, gap: 14, borderRadius: radii.xxl, overflow: 'hidden' },
  glow: { position: 'absolute', right: -50, top: -60 },
  amount: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  big: { fontSize: 42, lineHeight: 44 },
  balanceActions: { flexDirection: 'row', gap: 8 },
  methods: { flexDirection: 'row', gap: 10 },
  method: {
    flex: 1,
    padding: 14,
    gap: 14,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodPrimary: { borderColor: palette.violetSoft },
  methodHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addMethod: {
    width: 64,
    borderRadius: 22,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: palette.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tx: { height: 60, flexDirection: 'row', alignItems: 'center', gap: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txAmount: { fontFamily: 'Rubik_700Bold' },
});
