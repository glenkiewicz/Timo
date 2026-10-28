import { create } from 'zustand';

/**
 * Czy pierwsza polana (`SceneBackdrop`) już się narysowała. Na Androidzie
 * splash czeka na to w `_layout.tsx` — inaczej pierwsze Menu pokazywało przez
 * chwilę samo zielone tło, zanim polana się doczytała.
 */
type SplashGate = {
  sceneShown: boolean;
  markSceneShown: () => void;
};

export const useSplashGate = create<SplashGate>((set, get) => ({
  sceneShown: false,
  markSceneShown: () => {
    if (!get().sceneShown) set({ sceneShown: true });
  },
}));
