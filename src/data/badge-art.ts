/**
 * Ilustracje odznak z `assets/badges/` — pocięte z dwóch arkuszy przez
 * `scripts/generate-badges.py`. `require` chce literałów, stąd ręczna mapa.
 */
export const BADGE_ART: Record<string, number> = {
  first_win: require('../../assets/badges/first_win.png'),
  first_loss: require('../../assets/badges/first_loss.png'),
  streak_3: require('../../assets/badges/streak_3.png'),
  streak_5: require('../../assets/badges/streak_5.png'),
  streak_10: require('../../assets/badges/streak_10.png'),
  daily_streak_7: require('../../assets/badges/daily_streak_7.png'),
  daily_streak_14: require('../../assets/badges/daily_streak_14.png'),
  daily_streak_30: require('../../assets/badges/daily_streak_30.png'),
  collector_5: require('../../assets/badges/collector_5.png'),
  collector_10: require('../../assets/badges/collector_10.png'),
  collector_25: require('../../assets/badges/collector_25.png'),
  collector_50: require('../../assets/badges/collector_50.png'),
  collector_100: require('../../assets/badges/collector_100.png'),
  fast_thinker: require('../../assets/badges/fast_thinker.png'),
  lightning: require('../../assets/badges/lightning.png'),
  explorer_1: require('../../assets/badges/explorer_1.png'),
  explorer_5: require('../../assets/badges/explorer_5.png'),
  explorer_10: require('../../assets/badges/explorer_10.png'),
  explorer_all: require('../../assets/badges/explorer_all.png'),
  night_owl: require('../../assets/badges/night_owl.png'),
  early_bird: require('../../assets/badges/early_bird.png'),
};
