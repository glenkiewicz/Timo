import type { ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const TIMO = require('../../assets/timo/character/timo.png');

/**
 * Ekran po błędzie w kodzie — zamiast znikającej aplikacji lisek i
 * „Spróbuj ponownie”. Celowo na gołych komponentach React Native, bez
 * motywu, czcionek i stanu gry: cokolwiek z nich mogło właśnie zawieść.
 */
export function ErrorScreen({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    // Błąd przy starcie — splash systemowy nie może zostać na zawsze.
    void SplashScreen.hideAsync().catch(() => undefined);
    if (__DEV__) console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <View style={styles.root}>
      <Image source={TIMO} style={styles.timo} resizeMode="contain" accessibilityLabel="Timo" />
      <Text style={styles.title}>Ups! Coś się poplątało.</Text>
      <Text style={styles.lead}>Timo już to rozplątuje. Spróbuj jeszcze raz.</Text>
      <Pressable
        onPress={() => void retry()}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}>
        <Text style={styles.buttonText}>Spróbuj ponownie</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff1df',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  timo: { width: 180, height: 210 },
  title: { fontSize: 24, fontWeight: '700', color: '#3b2a1a', textAlign: 'center' },
  lead: { fontSize: 16, lineHeight: 22, color: '#6b5a48', textAlign: 'center' },
  button: {
    marginTop: 12,
    backgroundColor: '#ec8e30',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
});
