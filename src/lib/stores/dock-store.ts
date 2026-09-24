import { create } from 'zustand';

/**
 * Kolor dolnego doku, ustawiany przez aktualnie otwarty ekran.
 *
 * Dok miał jedną zieleń niezależnie od tego, co pod nim leży, i na jasnych
 * planszach — Arktyce przede wszystkim — odcinał się jak doklejony pasek.
 * Ekran, który wypełnia sobą tło, podaje więc kolor pasujący do swojego dołu,
 * a przy wyjściu przywraca domyślny.
 *
 * Stan siedzi w store, a nie w kontekście, bo ustawia go ekran zakładki,
 * a czyta układ ZAKŁADEK, czyli jego rodzic — przez drzewo Reacta nie da się
 * tego przekazać w dół.
 */
export type DockTint = {
  /** Tło paska. */
  bg: string;
  /** Kolor podpisów — biały albo ciemny, zależnie od jasności tła. */
  fg: string;
};

type DockState = {
  /** null = domyślna zieleń z `UI.panel` i białe podpisy. */
  tint: DockTint | null;
  setTint: (tint: DockTint | null) => void;
};

export const useDockStore = create<DockState>((set) => ({
  tint: null,
  setTint: (tint) => set({ tint }),
}));
