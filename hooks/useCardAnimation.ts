import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface UseCardAnimationOptions {
  scaleDown?: number;
  fadeDuration?: number;
}

export function useCardAnimation(options: UseCardAnimationOptions = {}) {
  const { scaleDown = 0.96, fadeDuration = 260 } = options;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: fadeDuration });
  }, [fadeDuration, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(scaleDown, {
      damping: 15,
      stiffness: 300,
    });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  return { animatedStyle, onPressIn, onPressOut };
}
