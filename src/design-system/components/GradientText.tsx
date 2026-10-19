import RNMaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentType, ReactElement, ReactNode } from 'react';
import { Platform } from 'react-native';

import { colors, gradients } from '../tokens';
import { Text, type TextProps } from './Text';

// The library's class typings predate React 19's JSX types; the runtime component is unchanged.
const MaskedView = RNMaskedView as unknown as ComponentType<{ maskElement: ReactElement; children: ReactNode }>;

type GradientTextProps = TextProps & { stops?: readonly [string, string, ...string[]] };

/** Text filled with a horizontal gradient (the "cambio" accent in headlines). */
export function GradientText({ stops = gradients.headline, children, ...textProps }: GradientTextProps) {
  // Masking is native-only; the web falls back to the brand ink.
  if (Platform.OS === 'web') {
    return (
      <Text {...textProps} color={colors.primaryInk}>
        {children}
      </Text>
    );
  }
  return (
    <MaskedView maskElement={<Text {...textProps}>{children}</Text>}>
      <LinearGradient colors={stops} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text {...textProps} style={[textProps.style, { opacity: 0 }]}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}
