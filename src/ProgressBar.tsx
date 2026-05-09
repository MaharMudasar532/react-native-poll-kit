import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export type PollResultProgressBarProps = {
  active: boolean;
  fraction: number;
  rowWidth: number;
  backgroundColor: string;
  duration: number;
  animate: boolean;
};

/**
 * Results-mode fill behind an option row ([react-native-poll](https://www.npmjs.com/package/react-native-poll)-style timing).
 * Restarts animation only when `fraction` or `rowWidth` changes meaningfully.
 */
export function PollResultProgressBar({
  active,
  fraction,
  rowWidth,
  backgroundColor,
  duration,
  animate,
}: PollResultProgressBarProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const prevFractionRef = useRef<number | null>(null);
  const prevRowWidthRef = useRef(0);

  const targetW = active && rowWidth > 0 ? Math.max(0, rowWidth * fraction) : 0;

  useEffect(() => {
    if (!animate) {
      return;
    }
    if (!active || rowWidth <= 0 || targetW <= 0) {
      progress.setValue(0);
      prevFractionRef.current = null;
      return;
    }

    const prevFrac = prevFractionRef.current;
    if (
      prevFrac !== null &&
      Math.abs(prevFrac - fraction) < 0.01 &&
      prevRowWidthRef.current === rowWidth
    ) {
      return;
    }

    prevFractionRef.current = fraction;
    prevRowWidthRef.current = rowWidth;

    progress.setValue(0);
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [active, animate, duration, fraction, progress, rowWidth, targetW]);

  if (targetW <= 0) {
    return null;
  }

  const shell = {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor,
  };

  if (!animate) {
    return <View pointerEvents="none" style={[shell, { width: targetW }]} />;
  }

  const animatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, targetW],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[shell, { width: animatedWidth }]}
    />
  );
}
