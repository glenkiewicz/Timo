import { create } from 'zustand';

/**
 * Stan jednego uruchomienia aplikacji — celowo BEZ `persist`.
 *
 * Ekran startowy pokazujemy przy każdym uruchomieniu, jak ekran tytułowy
 * w grach: dziecko samo mówi „Gramy!”, zanim Timo się odezwie. Zapamiętanie
 * tej flagi na dysku zabiłoby właśnie to — dlatego żyje tylko w pamięci
 * i znika razem z procesem.
 */
type SessionState = {
  /**
   * Profil, dla którego w tym uruchomieniu minął już ekran startowy. Po
   * zmianie dziecka flaga przestaje pasować, więc nowe dziecko też go zobaczy.
   */
  startSeenFor: string | null;
  markStartSeen: (profileId: string) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  startSeenFor: null,
  markStartSeen: (profileId) => set({ startSeenFor: profileId }),
}));

/** Czy aktywne dziecko minęło już w tym uruchomieniu ekran startowy. */
export function useStartSeen(activeProfileId: string | null): boolean {
  return useSessionStore((s) => activeProfileId !== null && s.startSeenFor === activeProfileId);
}
