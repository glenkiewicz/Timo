import { useState } from 'react';
import type { TextInputProps } from 'react-native';

import { UI } from '@/theme/ui';
import { Text, TextInput, View } from '@/tw';

type FieldProps = TextInputProps & {
  label: string;
};

/** Pole formularza — etykieta nad polem, wyraźna ramka, focus na kolor marki. */
export function Field({ label, ...inputProps }: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-1.5">
      <Text
        style={{
          color: UI.textSoft,
          fontFamily: 'Fredoka-Bold',
          fontSize: 12,
          letterSpacing: 0.4,
        }}>
        {label}
      </Text>
      <TextInput
        {...inputProps}
        onFocus={(e) => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
        placeholderTextColor={UI.textFaint}
        style={{
          backgroundColor: UI.canvas,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: focused ? UI.sky : UI.line,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontFamily: 'Nunito-Bold',
          fontSize: 15,
          color: UI.text,
        }}
      />
    </View>
  );
}
