/**
 * Singleton controller dla głosu Timo.
 *
 * - Zarządza pojedynczym `AudioPlayer` z expo-audio (poza React lifecycle, żeby
 *   route changes mogły przerywać audio).
 * - `playLine(voiceKey)`     — odtwarza jeden klip MP3 z bundle.
 * - `playSequence(keys[])`   — gra kolejno (np. guess intro + nazwa zwierzęcia).
 * - `stop()`                 — natychmiast pauzuje + zwalnia player.
 * - Respektuje `audioMuted` z `useProfileStore`: gdy true, wszystkie play* są no-op.
 * - `useIsTimoSpeaking()`    — hook React zwracający aktualny stan mówienia.
 */

import {
	createAudioPlayer,
	type AudioPlayer,
	type AudioStatus,
} from "expo-audio";
import { useEffect, useState } from "react";

import { voiceFor } from "@/data/voice-manifest";
import { useProfileStore } from "@/lib/stores/profile-store";

/**
 * Tempo głosu Timo — JEDYNE pokrętło do strojenia. ElevenLabs generuje klipy
 * z `speed: 1.0` (ok. 110 słów/min, 11 znaków/s — dla dziecka trochę ślamazarnie);
 * tu przyspieszamy je w runtime na urządzeniu.
 *
 * 21.10.2026: po zmianie głosu na nowy (ElevenLabs) właściciel wybrał tempo
 * naturalne 1.0 — nowy głos mówi żwawiej sam z siebie. Wysokość tonu i tak
 * zostaje (patrz `applyPlaybackRate`), gdyby tempo miało znów rosnąć.
 * Rozsądny zakres: 1.05–1.25; powyżej ~1.3 korekcja tonu zaczyna być słyszalna
 * (metaliczny pogłos).
 *
 * Uwaga historyczna: wcześniej stała wynosiła 1.75, ale ustawiana była przez
 * `player.playbackRate = …`, a w natywnym expo-audio (iOS i Android) ta
 * właściwość jest TYLKO DO ODCZYTU — przypisanie przepadało w `catch` i głos
 * zawsze grał w tempie 1.0. Stąd wrażenie „za wolno” mimo 1.75 w kodzie.
 */
const TIMO_PLAYBACK_RATE = 1.0;

/**
 * Domyślny fallback timeout — używany dopóki nie poznamy `duration` klipu. Po
 * pierwszym status update z `duration > 0` ustawiamy dokładniejszy, dynamiczny
 * timeout: (duration / playbackRate) * 1.2s + 1.5s buffer.
 *
 * Najdłuższe MP3 w bundle to ~11s; przy TIMO_PLAYBACK_RATE=1.0 gra ~11s,
 * więc default 15s ma zapas.
 */
const CLIP_TIMEOUT_DEFAULT_MS = 15000;

/**
 * Pauza między klipami w `playSequence` (np. między prefiksem a pytaniem).
 * Brzmi naturalnie jak oddech + daje natywnemu audio session iOS/Android czas
 * na zwolnienie zasobów poprzedniego playera (redukuje race "klip nie startuje").
 * 200 zamiast 250 ms — pauza skrócona mniej więcej w tej samej proporcji co
 * przyspieszony głos; niżej nie schodzimy ze względu na ten race.
 */
const INTER_CLIP_GAP_MS = 200;

/**
 * Po jakim czasie od pierwszego validnego status update z `duration > 0`
 * sprawdzamy czy klip faktycznie się rozkręcił (currentTime > 0). Jeśli nie,
 * próbujemy `player.play()` jeszcze raz — czasem natywna warstwa expo-audio
 * cicho gubi pierwszy start.
 */
const RETRY_PLAY_AFTER_MS = 600;
/** Po tylu ms odtwarzacze z `preload` są zwalniane. */
const PRELOAD_RELEASE_MS = 8000;

/**
 * Aktualne parametry runtime głosu — exportowane do DebugOverlay (DEV).
 * Jeśli edytujesz wartości powyżej, ten obiekt automatycznie odzwierciedla zmianę.
 */
export const TIMO_VOICE_DEBUG_PARAMS = {
	playbackRate: TIMO_PLAYBACK_RATE,
	interClipGapMs: INTER_CLIP_GAP_MS,
	retryPlayAfterMs: RETRY_PLAY_AFTER_MS,
	clipTimeoutDefaultMs: CLIP_TIMEOUT_DEFAULT_MS,
};

/**
 * Ustawia tempo z korekcją wysokości tonu. Musi iść przez `setPlaybackRate` —
 * natywny setter `playbackRate` nie istnieje. Jakość 'medium' to na iOS
 * `AVAudioTimePitchAlgorithm.timeDomain`, który Apple poleca do mowy
 * ('low' = varispeed, czyli właśnie efekt „chipmunka”; 'high' = spectral,
 * lepszy do muzyki, przy głosie potrafi dodać pogłosu). Android ignoruje
 * jakość i przy `shouldCorrectPitch` trzyma ton 1.0 (ExoPlayer/Sonic).
 */
/**
 * Zwalnia player NAPRAWDĘ. `remove()` w expo-audio na Androidzie tylko wypisuje
 * go z listy modułu — ExoPlayer i jego AudioTrack żyją dalej, aż zbierze je GC.
 * Każda kwestia to nowy player, więc po 2–3 seriach gry system odmawiał
 * kolejnych ścieżek („Cannot create AudioTrack”) i Timo milkł. `release()`
 * zwalnia natywny obiekt od razu.
 */
function disposePlayer(player: AudioPlayer): void {
	try {
		player.remove();
	} catch {
		/* player może być już w niestabilnym stanie */
	}
	try {
		player.release();
	} catch {
		/* już zwolniony */
	}
}

function applyPlaybackRate(player: AudioPlayer): void {
	try {
		player.shouldCorrectPitch = true;
		player.setPlaybackRate(TIMO_PLAYBACK_RATE, "medium");
	} catch {
		/* niektóre platformy mogą rzucić jeśli player nie jest jeszcze załadowany */
	}
}

type Listener = (speaking: boolean) => void;

/**
 * Nastrój pętli mówienia — która animacja liska towarzyszy kwestii.
 * Tabela w docs/prompts-timo-talking.md.
 */
export type TalkMood = 'talk' | 'ask' | 'happy' | 'oops';

/**
 * Sekwencję klipów (np. setup + pytanie) gra JEDNA pętla — ta, którą wskazuje
 * ostatni klip, żeby lisek nie zmieniał nastroju w pół zdania. Wyjątek: nazwa
 * zwierzęcia na końcu strzału („Mój nos mówi, że to…” + „Lis”) należy do
 * wstępu, więc decyduje klip przed nią.
 */
export function talkMoodFor(keys: string[]): TalkMood {
	let key = keys[keys.length - 1] ?? '';
	if (key.startsWith('animal.') && keys.length > 1) key = keys[keys.length - 2];
	if (/^q\.[^.]+\.core\./.test(key) || key.startsWith('wyglup.') || key.startsWith('guess_intro.')) {
		return 'ask';
	}
	if (
		/^q\.[^.]+\.yes\./.test(key) ||
		key.startsWith('heat.') ||
		key.startsWith('victory.') ||
		key.startsWith('hatch.') ||
		key.startsWith('streak_milestone.')
	) {
		return 'happy';
	}
	if (key.startsWith('miss.') || key.startsWith('giveup.') || key.startsWith('guided_giveup.')) {
		return 'oops';
	}
	return 'talk';
}

class TimoVoiceController {
	private player: AudioPlayer | null = null;
	/**
	 * Kończy obietnicę bieżącego klipu. Przerwanie (`stop`, nowa kwestia)
	 * sprząta player i nasłuch, więc bez tego `await playLine(...)` czekałoby
	 * w nieskończoność — a z nim np. reakcja w grze i odblokowanie odpowiedzi.
	 */
	private finishCurrent: (() => void) | null = null;
	private subscription: { remove: () => void } | null = null;
	private timeoutId: ReturnType<typeof setTimeout> | null = null;
	/** Token kasujący aktualną sekwencję, gdy wystartuje nowa. */
	private sequenceToken = 0;
	private listeners = new Set<Listener>();
	private speakingState = false;
	/** Klucze bieżącej kwestii — z nich nastrój pętli mówienia. */
	private currentKeys: string[] = [];
	/**
	 * Dźwięk FAKTYCZNIE gra — od pierwszego postępu klipu do jego końca.
	 * Różni się od „mówi” (`speakingState`), które obejmuje też pauzę przed
	 * pytaniem i przerwy między klipami: buzia liska ma iść za dźwiękiem,
	 * nie za tą flagą.
	 */
	private audibleState = false;
	private audibleListeners = new Set<Listener>();

	private setAudible(value: boolean): void {
		if (this.audibleState === value) return;
		this.audibleState = value;
		for (const l of this.audibleListeners) l(value);
	}

	subscribeAudible(listener: Listener): () => void {
		this.audibleListeners.add(listener);
		listener(this.audibleState);
		return () => {
			this.audibleListeners.delete(listener);
		};
	}

	/** Nastrój bieżącej kwestii (ważny, gdy Timo mówi). */
	mood(): TalkMood {
		return talkMoodFor(this.currentKeys);
	}

	private setSpeaking(value: boolean): void {
		if (this.speakingState === value) return;
		this.speakingState = value;
		for (const l of this.listeners) l(value);
	}

	private isMuted(): boolean {
		return useProfileStore.getState().audioMuted;
	}

	subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		listener(this.speakingState);
		return () => {
			this.listeners.delete(listener);
		};
	}

	isSpeaking(): boolean {
		return this.speakingState;
	}

	/**
	 * Sprząta bieżący player + listener + timeout. NIE zmienia `speakingState` —
	 * używane gdy zaraz potem startuje nowy klip i nie chcemy migotania wait-mode.
	 */
	private cleanupCurrent(): void {
		const finish = this.finishCurrent;
		this.finishCurrent = null;
		finish?.();
		if (this.timeoutId !== null) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
		if (this.subscription) {
			try {
				this.subscription.remove();
			} catch {
				/* ignore */
			}
			this.subscription = null;
		}
		if (this.player) {
			try {
				this.player.pause();
			} catch {
				/* player może być już w niestabilnym stanie */
			}
			disposePlayer(this.player);
			this.player = null;
		}
	}

	/**
	 * Wczytuje klipy z wyprzedzeniem (bez odtwarzania). Na telefonie pierwsze
	 * odtworzenie pliku potrafiło przepaść, a drugie grało — tu to „pierwsze”
	 * dzieje się po cichu, zanim dziecko cokolwiek usłyszy. Odtwarzacze są
	 * zwalniane po kilku sekundach; pliki zostają już w pamięci systemu.
	 */
	preload(voiceKeys: string[]): void {
		const players: AudioPlayer[] = [];
		for (const key of voiceKeys) {
			const source = voiceFor(key);
			if (source == null) continue;
			try {
				const p = createAudioPlayer(source);
				// Tempo także przy podgrzaniu: każdy player z tego modułu ma tę samą
				// konfigurację, więc nic nie zagra przypadkiem w tempie 1.0.
				// (Właściwe odtwarzanie i tak tworzy własny player w `playOne`.)
				applyPlaybackRate(p);
				players.push(p);
			} catch {
				/* podgrzanie jest tylko optymalizacją */
			}
		}
		setTimeout(() => {
			for (const p of players) disposePlayer(p);
		}, PRELOAD_RELEASE_MS);
	}

	stop(): void {
		this.sequenceToken += 1;
		this.cleanupCurrent();
		this.setAudible(false);
		this.setSpeaking(false);
	}

	/**
	 * Odtwarza jeden klip. Resolve gdy klip skończy się NATURALNIE
	 * (didJustFinish), zostanie PRZERWANY (sequenceToken zmieni się), albo
	 * upłynie TIMEOUT (15s — fallback gdy expo-audio nie wystrzeli finish).
	 *
	 * `myToken` powinien być === `this.sequenceToken` w momencie wywołania.
	 */
	private playOne(voiceKey: string, myToken: number): Promise<void> {
		const source = voiceFor(voiceKey);
		if (source == null) {
			if (__DEV__)
				console.warn(`[TimoVoice] Brak MP3 dla voiceKey="${voiceKey}"`);
			return Promise.resolve();
		}

		return new Promise<void>((resolve) => {
			let resolved = false;
			let player: AudioPlayer | undefined;
			let sub: { remove: () => void } | null = null;
			let lastStatus: AudioStatus | null = null;
			let dynamicTimeoutSet = false;
			let firstValidStatusAt = 0;
			let retried = false;

			const finishOnce = (reason: string) => {
				if (resolved) return;
				resolved = true;
				if (this.finishCurrent === interrupt) this.finishCurrent = null;
				if (__DEV__) {
					if (reason === "timeout" && lastStatus) {
						console.log(
							`[TimoVoice] ⏹ ${voiceKey} (${reason}) currentTime=${lastStatus.currentTime.toFixed(2)} duration=${lastStatus.duration.toFixed(2)}`,
						);
					} else {
						console.log(`[TimoVoice] ⏹ ${voiceKey} (${reason})`);
					}
				}
				if (this.timeoutId !== null) {
					clearTimeout(this.timeoutId);
					this.timeoutId = null;
				}
				if (sub) {
					try {
						sub.remove();
					} catch {
						/* ignore */
					}
					if (this.subscription === sub) this.subscription = null;
					sub = null;
				}
				if (player) {
					disposePlayer(player);
					if (this.player === player) this.player = null;
				}
				resolve();
			};

			const interrupt = () => finishOnce("interrupted");
			this.finishCurrent = interrupt;

			try {
				// Status co 50 ms zamiast domyślnych 500 ms — z niego buzia liska
				// wie, że dźwięk ruszył; przy 500 ms usta ruszały wyraźnie po głosie.
				player = createAudioPlayer(source, { updateInterval: 50 });
			} catch (e) {
				if (__DEV__)
					console.warn(
						`[TimoVoice] createAudioPlayer failed for ${voiceKey}:`,
						e,
					);
				resolve();
				return;
			}

			this.player = player;
			applyPlaybackRate(player);
			this.setSpeaking(true);

			if (__DEV__) console.log(`[TimoVoice] ▶ ${voiceKey}`);

			sub = player.addListener(
				"playbackStatusUpdate",
				(status: AudioStatus) => {
					lastStatus = status;
					if (myToken !== this.sequenceToken) {
						finishOnce("interrupted");
						return;
					}
					// Po pierwszym validnym status update zna duration → ustaw precyzyjny
					// timeout zamiast szerokiego 15s defaultu. Mocno skraca dead time gdy
					// `didJustFinish` się zgubi.
					if (!dynamicTimeoutSet && status.duration > 0) {
						dynamicTimeoutSet = true;
						firstValidStatusAt = Date.now();
						if (this.timeoutId !== null)
							clearTimeout(this.timeoutId);
						// Czas klipu po przyspieszeniu (tempo ograniczone do 1.5 na wypadek
						// podkręcenia stałej) + 50% marginesu + 2.5s bufora — gdyby tempo
						// się nie przyjęło i klip grał w 1.0, i tak mieści się z zapasem.
						// Lepiej żeby klip pokrył się "za długim" timeoutem niż został cięty.
						const effectiveRate = Math.min(TIMO_PLAYBACK_RATE, 1.5);
						const expectedMs =
							(status.duration / effectiveRate) * 1000 * 1.5 +
							2500;
						this.timeoutId = setTimeout(
							() => finishOnce("timeout"),
							expectedMs,
						);
					}
					// Retry play() jeśli po ~600ms od pierwszego status z duration > 0 audio
					// wciąż stoi w 0 — to oznacza że natywny start cicho zawiódł.
					if (
						!retried &&
						firstValidStatusAt > 0 &&
						status.currentTime <= 0.001 &&
						Date.now() - firstValidStatusAt >=
							RETRY_PLAY_AFTER_MS &&
						player
					) {
						retried = true;
						if (__DEV__)
							console.log(`[TimoVoice] 🔄 retry ${voiceKey}`);
						try {
							player.play();
						} catch (e) {
							if (__DEV__)
								console.warn(
									`[TimoVoice] retry play() failed for ${voiceKey}:`,
									e,
								);
						}
					}
					// Buzia rusza dopiero, gdy dźwięk naprawdę popłynął — nie w chwili
					// wywołania play(), bo start potrafi się opóźnić o kilkaset ms.
					if (status.playing && status.currentTime > 0) this.setAudible(true);
					if (status.didJustFinish) {
						finishOnce("finished");
						return;
					}
					// Fallback gdy expo-audio gubi `didJustFinish` (zdarza się sporadycznie po
					// szybkim cyklu create→play→remove). Gdy currentTime dobiło do duration,
					// klip fizycznie się skończył — kończymy bez czekania na timeout.
					if (
						status.duration > 0 &&
						status.currentTime >= status.duration - 0.05
					) {
						finishOnce("completed_by_progress");
					}
				},
			);
			this.subscription = sub;

			// Ostateczny watchdog: gdyby `playbackStatusUpdate` w ogóle nie wystrzelił
			// (np. plik się nie załadował, conflict z system audio session), klip
			// kończy się po 15s zamiast wisieć w nieskończoność. Zostanie zastąpiony
			// dokładniejszym timeoutem gdy poznamy duration.
			this.timeoutId = setTimeout(
				() => finishOnce("timeout"),
				CLIP_TIMEOUT_DEFAULT_MS,
			);

			try {
				player.play();
			} catch (e) {
				// Czasem iOS rzuca "Session lookup failed" — natywny audio session
				// chwilowo niedostępny po szybkim cyklu create/remove. Spróbuj
				// jeszcze raz po 250ms, zanim się poddasz.
				if (__DEV__)
					console.warn(
						`[TimoVoice] play() failed for ${voiceKey}, retry in 250ms:`,
						e,
					);
				setTimeout(() => {
					if (resolved || myToken !== this.sequenceToken || !player) {
						return;
					}
					try {
						player.play();
					} catch (e2) {
						if (__DEV__)
							console.warn(
								`[TimoVoice] play() retry failed for ${voiceKey}:`,
								e2,
							);
						finishOnce("play_failed");
					}
				}, 250);
			}
		});
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((r) => setTimeout(r, ms));
	}

	/**
	 * Odtwarza pojedynczy klip. Zatrzymuje aktualne odtwarzanie i startuje nowy.
	 */
	async playLine(voiceKey: string): Promise<void> {
		if (this.isMuted()) return;
		const myToken = ++this.sequenceToken;
		this.cleanupCurrent();
		this.currentKeys = [voiceKey];
		this.setAudible(false);
		await this.playOne(voiceKey, myToken);
		if (myToken === this.sequenceToken) {
			this.setAudible(false);
			this.setSpeaking(false);
		}
	}

	/**
	 * Gra klipy po kolei. Nowy `playSequence` przerywa poprzedni przez sequenceToken.
	 * Między klipami pauza `INTER_CLIP_GAP_MS`.
	 *
	 * `options.initialDelayMs` — opcjonalna pauza PRZED pierwszym klipem (np. żeby
	 * po reakcji "Tak!" oddech, zanim pójdzie kolejne pytanie). Podczas tej pauzy
	 * `isSpeaking=true` — buttony pozostają zablokowane, dziecko nie kliknie za szybko.
	 */
	async playSequence(
		voiceKeys: string[],
		options?: { initialDelayMs?: number },
	): Promise<void> {
		if (this.isMuted() || voiceKeys.length === 0) return;
		const myToken = ++this.sequenceToken;
		this.cleanupCurrent();
		this.currentKeys = voiceKeys;
		// Nowa wypowiedź: buzia stoi, dopóki pierwszy klip nie zabrzmi (pauza
		// przed pytaniem to cisza). Między klipami sekwencji zostaje otwarta —
		// kończy ją dopiero ostatni klip.
		this.setAudible(false);

		const initialDelay = options?.initialDelayMs ?? 0;
		if (initialDelay > 0) {
			this.setSpeaking(true);
			await this.sleep(initialDelay);
			if (myToken !== this.sequenceToken) return;
		}

		for (let i = 0; i < voiceKeys.length; i++) {
			if (myToken !== this.sequenceToken) return;
			if (i > 0) {
				await this.sleep(INTER_CLIP_GAP_MS);
				if (myToken !== this.sequenceToken) return;
			}
			await this.playOne(voiceKeys[i], myToken);
		}
		if (myToken === this.sequenceToken) {
			this.setAudible(false);
			this.setSpeaking(false);
		}
	}
}

export const timoVoice = new TimoVoiceController();

// Gdy user wyłączy audio, przerywamy bieżące odtwarzanie.
useProfileStore.subscribe((s, prev) => {
	if (s.audioMuted && !prev.audioMuted) timoVoice.stop();
});

/**
 * Hook: aktualny stan czy Timo właśnie mówi (do disabled buttons w game.tsx itp.).
 */
export function useIsTimoSpeaking(): boolean {
	const [speaking, setSpeaking] = useState<boolean>(() =>
		timoVoice.isSpeaking(),
	);
	useEffect(() => {
		return timoVoice.subscribe(setSpeaking);
	}, []);
	return speaking;
}

/**
 * Hook: nastrój bieżącej kwestii, gdy dźwięk głosu faktycznie gra, albo
 * `null`, gdy panuje cisza. Z niego scena wybiera pętlę mówienia liska.
 */
export function useTalkMood(): TalkMood | null {
	const [audible, setAudible] = useState<boolean>(false);
	useEffect(() => timoVoice.subscribeAudible(setAudible), []);
	return audible ? timoVoice.mood() : null;
}
