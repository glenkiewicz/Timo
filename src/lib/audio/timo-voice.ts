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
 * Tempo odtwarzania głosu Timo. ElevenLabs generuje audio z tempem 1.0;
 * `playbackRate` skaluje to w runtime na urządzeniu.
 *
 * 0.98 ≈ prawie natywne tempo (test: 0.85 było za wolne, ten poziom brzmi
 * dynamicznie ale nadal naturalnie).
 */
const TIMO_PLAYBACK_RATE = 1.75;

/**
 * Domyślny fallback timeout — używany dopóki nie poznamy `duration` klipu. Po
 * pierwszym status update z `duration > 0` ustawiamy dokładniejszy, dynamiczny
 * timeout: (duration / playbackRate) * 1.2s + 1.5s buffer.
 *
 * Najdłuższe MP3 w bundle to ~10s (linia "outside_category"); przy
 * playbackRate=0.85 to ~11.8s, więc default 15s ma zapas.
 */
const CLIP_TIMEOUT_DEFAULT_MS = 15000;

/**
 * Pauza między klipami w `playSequence` (np. między prefiksem a pytaniem).
 * Brzmi naturalnie jak oddech + daje natywnemu audio session iOS/Android czas
 * na zwolnienie zasobów poprzedniego playera (redukuje race "klip nie startuje").
 */
const INTER_CLIP_GAP_MS = 250;

/**
 * Po jakim czasie od pierwszego validnego status update z `duration > 0`
 * sprawdzamy czy klip faktycznie się rozkręcił (currentTime > 0). Jeśli nie,
 * próbujemy `player.play()` jeszcze raz — czasem natywna warstwa expo-audio
 * cicho gubi pierwszy start.
 */
const RETRY_PLAY_AFTER_MS = 600;

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

function applyPlaybackRate(player: AudioPlayer): void {
	try {
		player.playbackRate = TIMO_PLAYBACK_RATE;
	} catch {
		/* niektóre platformy mogą rzucić jeśli player nie jest jeszcze załadowany */
	}
}

type Listener = (speaking: boolean) => void;

class TimoVoiceController {
	private player: AudioPlayer | null = null;
	private subscription: { remove: () => void } | null = null;
	private timeoutId: ReturnType<typeof setTimeout> | null = null;
	/** Token kasujący aktualną sekwencję, gdy wystartuje nowa. */
	private sequenceToken = 0;
	private listeners = new Set<Listener>();
	private speakingState = false;

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
				this.player.remove();
			} catch {
				/* player może być już w niestabilnym stanie */
			}
			this.player = null;
		}
	}

	stop(): void {
		this.sequenceToken += 1;
		this.cleanupCurrent();
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
					try {
						player.remove();
					} catch {
						/* ignore */
					}
					if (this.player === player) this.player = null;
				}
				resolve();
			};

			try {
				player = createAudioPlayer(source);
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
						// iOS AVPlayer clampuje playbackRate, ale faktyczne odtwarzanie
						// bywa wolniejsze niż 2.0 (np. 1.5-1.8x w praktyce). Konserwatywnie
						// używamy 1.5 jako worst-case + 50% margines + 2.5s bufora.
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
		await this.playOne(voiceKey, myToken);
		if (myToken === this.sequenceToken) {
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
