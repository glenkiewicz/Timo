import { Link as RouterLink } from 'expo-router';
import React from 'react';
import {
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableHighlight as RNTouchableHighlight,
  View as RNView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { uiScaleFor } from '@/lib/layout';
import {
  useCssElement,
  useNativeVariable as useFunctionalVariable,
} from 'react-native-css';

export const Link = (
  props: React.ComponentProps<typeof RouterLink> & { className?: string }
) => {
  return useCssElement(RouterLink, props, { className: 'style' });
};

Link.Trigger = RouterLink.Trigger;
Link.Menu = RouterLink.Menu;
Link.MenuAction = RouterLink.MenuAction;
Link.Preview = RouterLink.Preview;

export const useCSSVariable =
  process.env.EXPO_OS !== 'web'
    ? useFunctionalVariable
    : (variable: string) => `var(${variable})`;

export type ViewProps = React.ComponentProps<typeof RNView> & {
  className?: string;
};

export const View = (props: ViewProps) => {
  return useCssElement(RNView, props, { className: 'style' });
};
View.displayName = 'CSS(View)';

/**
 * Tekst powiększany na iPadzie (`uiScaleFor` w lib/layout) — rozmiary
 * czcionek są dobrane pod telefon, a na 13" ekranie wychodziły maleńkie.
 * Skalujemy rozmiar, interlinię i rozstrzelenie, nic więcej.
 */
const ScaledText = React.forwardRef<RNText, React.ComponentProps<typeof RNText>>((props, ref) => {
  const { width } = useWindowDimensions();
  const k = uiScaleFor(width);
  if (k === 1) return <RNText ref={ref} {...props} />;
  const flat = StyleSheet.flatten(props.style) ?? {};
  const scaled: Record<string, number> = {};
  if (typeof flat.fontSize === 'number') scaled.fontSize = flat.fontSize * k;
  if (typeof flat.lineHeight === 'number') scaled.lineHeight = flat.lineHeight * k;
  if (typeof flat.letterSpacing === 'number') scaled.letterSpacing = flat.letterSpacing * k;
  if (scaled.fontSize === undefined) scaled.fontSize = 14 * k;
  return <RNText ref={ref} {...props} style={[props.style, scaled]} />;
});
ScaledText.displayName = 'ScaledText';

export const Text = (
  props: React.ComponentProps<typeof RNText> & { className?: string }
) => {
  return useCssElement(ScaledText, props, { className: 'style' });
};
Text.displayName = 'CSS(Text)';

export const ScrollView = (
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  }
) => {
  return useCssElement(RNScrollView, props, {
    className: 'style',
    contentContainerClassName: 'contentContainerStyle',
  });
};
ScrollView.displayName = 'CSS(ScrollView)';

export const Pressable = (
  props: React.ComponentProps<typeof RNPressable> & { className?: string }
) => {
  return useCssElement(RNPressable, props, { className: 'style' });
};
Pressable.displayName = 'CSS(Pressable)';

export const TextInput = (
  props: React.ComponentProps<typeof RNTextInput> & { className?: string }
) => {
  return useCssElement(RNTextInput, props, { className: 'style' });
};
TextInput.displayName = 'CSS(TextInput)';

export const AnimatedScrollView = (
  props: React.ComponentProps<typeof Animated.ScrollView> & {
    className?: string;
    contentClassName?: string;
    contentContainerClassName?: string;
  }
) => {
  return useCssElement(Animated.ScrollView, props, {
    className: 'style',
    contentClassName: 'contentContainerStyle',
    contentContainerClassName: 'contentContainerStyle',
  });
};

function XXTouchableHighlight(
  props: React.ComponentProps<typeof RNTouchableHighlight>
) {
  const { underlayColor, ...style } =
    (StyleSheet.flatten(props.style) as { underlayColor?: string }) || {};
  return (
    <RNTouchableHighlight
      underlayColor={underlayColor}
      {...props}
      style={style}
    />
  );
}

export const TouchableHighlight = (
  props: React.ComponentProps<typeof RNTouchableHighlight>
) => {
  return useCssElement(XXTouchableHighlight, props, { className: 'style' });
};
TouchableHighlight.displayName = 'CSS(TouchableHighlight)';
