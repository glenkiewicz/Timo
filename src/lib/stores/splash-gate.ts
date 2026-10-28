import { create } from 'zustand';

/** Ekrany startowe z polaną, na które może czekać splash. */
export type SplashScreenKey = 'start' | 'home';

/**
 * Które ekrany startowe narysowały już polanę (`SceneBackdrop`). Splash czeka
 * w `_layout.tsx` na ten, który ma być widoczny — inaczej po splashu mignęło
 * zielone tło albo Menu spod ekranu „Cześć!”.
 */
type SplashGate = {
  shown: SplashScreenKey[];
  markShown: (key: SplashScreenKey) => void;
};

export const useSplashGate = create<SplashGate>((set, get) => ({
  shown: [],
  markShown: (key) => {
    if (!get().shown.includes(key)) set({ shown: [...get().shown, key] });
  },
}));
