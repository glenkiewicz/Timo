/**
 * Klipy liska jako animowane WebP — tylko na Androidzie.
 *
 * Wideo przez Skię kopiuje tam każdą klatkę na wątku UI i czeka na dekoder,
 * przez co lisek się rwał, a z nim całe Menu. WebP dekoduje `expo-image`
 * w tle. Plik `.android.ts`, żeby te ~9 MB nie trafiły do paczki iOS.
 * Przebrania z wypraw mają tylko wideo — te zostają przy `AlphaVideo`.
 */
export const WEBP_CLIPS = {
  idle: require('../../../assets/timo/character/timo-idle.webp'),
  talk: require('../../../assets/timo/character/timo-talk.webp'),
  'talk-happy': require('../../../assets/timo/character/timo-talk-happy.webp'),
  wave: require('../../../assets/timo/character/timo-wave.webp'),
} as const;
