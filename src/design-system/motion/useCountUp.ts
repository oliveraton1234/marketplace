import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Animates a number from 0 to `target` with an ease-out curve (skipped with Reduce Motion). */
export function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    const start = Date.now();

    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) return setValue(target);
      const tick = () => {
        const t = Math.min(1, (Date.now() - start) / durationMs);
        setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [target, durationMs]);

  return value;
}
