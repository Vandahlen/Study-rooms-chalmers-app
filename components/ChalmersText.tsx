// study-rooms/components/ChalmersText.tsx
/**
 * components/ChalmersText.tsx
 *
 * Typography primitive mapping onto the profile's named text styles
 * (Titel, Heading 1/2, Paragraph 1/2, etc). Defaults to the current
 * theme's text color; variants with a fixed brand color (e.g.
 * `label`) keep it unless the `color` prop overrides it.
 */
import React from 'react';
import { Text, TextProps, TextStyle, StyleProp } from 'react-native';
import { typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export type ChalmersTextVariant = keyof typeof typography;

export interface ChalmersTextProps extends TextProps {
  variant?: ChalmersTextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const ChalmersText: React.FC<ChalmersTextProps> = ({
  variant = 'paragraph1',
  color,
  style,
  children,
  ...rest
}) => {
  const baseStyle = typography[variant];
  const theme = useTheme();
  const resolvedColor = color ?? baseStyle.color ?? theme.text;

  return (
    <Text style={[baseStyle, { color: resolvedColor }, style]} {...rest}>
      {children}
    </Text>
  );
};

export default ChalmersText;
