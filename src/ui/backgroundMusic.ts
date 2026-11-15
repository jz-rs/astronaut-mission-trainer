import Phaser from 'phaser';
import type { MusicMood } from '../core/musicMood';

/**
 * The background music of the whole game: real NASA data sonifications (docs/DATA_SOURCES.md).
 *   - calm: the center of the Milky Way (Chandra + Hubble + Spitzer), always looping;
 *   - tense: the Pillars of Creation, from second 10 (its opening is too quiet to notice), for
 *     night, storms and problems in the base (core/musicMood.ts).
 * Changing mood crossfades, so it never cuts. It plays softly under the game, and the kid can
 * mute it from the start screen. Browsers only allow sound after the first tap: Phaser waits.
 */
const CALM_KEY = 'musicCalm';
const TENSE_KEY = 'musicTense';
const TENSE_MARKER = 'fromSecondTen';
const TENSE_START_SECONDS = 10;
const VOLUME = 0.35;
const FADE_MS = 1_500;

export function preloadMusic(load: Phaser.Loader.LoaderPlugin): void {
  load.audio(CALM_KEY, 'assets/audio/music-galactic-center.m4a');
  load.audio(TENSE_KEY, 'assets/audio/music-pillars-of-creation.m4a');
}

class BackgroundMusic {
  private mood: MusicMood = 'calm';
  private readonly calm: Phaser.Sound.BaseSound;
  private readonly tense: Phaser.Sound.BaseSound;

  constructor(private readonly game: Phaser.Game) {
    this.calm = game.sound.add(CALM_KEY, { loop: true, volume: VOLUME });
    this.tense = game.sound.add(TENSE_KEY, { volume: 0 });
    this.tense.addMarker({
      name: TENSE_MARKER,
      start: TENSE_START_SECONDS,
      duration: this.tense.duration - TENSE_START_SECONDS,
      config: { loop: true },
    });
    this.calm.play();
    game.events.on(Phaser.Core.Events.STEP, this.fade, this);
  }

  setMood(mood: MusicMood): void {
    if (mood === this.mood) return;
    this.mood = mood;
    // The tense track starts over each time; the calm one picks up where it was.
    if (mood === 'tense') this.tense.play(TENSE_MARKER, { volume: 0 });
    else this.calm.resume();
  }

  /** Every frame, the music of the current mood gets louder and the other one softer. */
  private fade(_time: number, deltaMs: number): void {
    const step = (VOLUME * deltaMs) / FADE_MS;
    const [rising, falling] =
      this.mood === 'tense' ? [this.tense, this.calm] : [this.calm, this.tense];
    setVolume(rising, Math.min(VOLUME, volumeOf(rising) + step));
    const softer = Math.max(0, volumeOf(falling) - step);
    setVolume(falling, softer);
    if (softer === 0 && falling.isPlaying) {
      if (falling === this.calm) falling.pause();
      else falling.stop();
    }
  }

  get muted(): boolean {
    return this.game.sound.mute;
  }

  set muted(muted: boolean) {
    this.game.sound.mute = muted;
  }
}

/** BaseSound has no volume; the WebAudio and HTML5 sounds Phaser creates both do. */
function volumeOf(sound: Phaser.Sound.BaseSound): number {
  return 'volume' in sound && typeof sound.volume === 'number' ? sound.volume : 0;
}

function setVolume(sound: Phaser.Sound.BaseSound, volume: number): void {
  if ('setVolume' in sound && typeof sound.setVolume === 'function') sound.setVolume(volume);
}

let music: BackgroundMusic | null = null;

/** Called once, after the music is loaded. */
export function startBackgroundMusic(game: Phaser.Game): void {
  music ??= new BackgroundMusic(game);
}

export function setMusicMood(mood: MusicMood): void {
  music?.setMood(mood);
}

export function isMusicMuted(): boolean {
  return music?.muted ?? false;
}

export function setMusicMuted(muted: boolean): void {
  if (music) music.muted = muted;
}
