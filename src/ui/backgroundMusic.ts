import Phaser from 'phaser';
import type { MusicMood } from '../core/musicMood';

/**
 * The background music of the whole game: real NASA data sonifications (docs/DATA_SOURCES.md).
 *   - calm: the center of the Milky Way (Chandra + Hubble + Spitzer), always looping;
 *   - night: the Pillars of Creation, windy, from second 10 (its opening is too quiet to
 *     notice), only while it is night in the base (core/musicMood.ts).
 * Only one plays at a time: changing mood crossfades for a moment, then the other one stops.
 * It plays softly under the game, and the kid can mute it (and the sound effects) with the
 * sound on/off button of the base's top bar and the start screen (soundToggle.ts). Browsers
 * only allow sound after the first tap: Phaser waits.
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

/**
 * The volume is kept here and never read back from Phaser: its WebAudio volume changes on the
 * next audio tick, so reading it gives an old value and a fade would never reach silence.
 */
interface Track {
  sound: Phaser.Sound.BaseSound;
  volume: number;
}

class BackgroundMusic {
  private mood: MusicMood = 'calm';
  private isMuted = false;
  private readonly calm: Track;
  private readonly tense: Track;

  constructor(private readonly game: Phaser.Game) {
    this.calm = { sound: game.sound.add(CALM_KEY, { loop: true, volume: VOLUME }), volume: VOLUME };
    this.tense = { sound: game.sound.add(TENSE_KEY, { volume: 0 }), volume: 0 };
    this.tense.sound.addMarker({
      name: TENSE_MARKER,
      start: TENSE_START_SECONDS,
      duration: this.tense.sound.duration - TENSE_START_SECONDS,
      config: { loop: true },
    });
    this.calm.sound.play();
    game.events.on(Phaser.Core.Events.STEP, this.fade, this);
  }

  setMood(mood: MusicMood): void {
    if (mood === this.mood) return;
    this.mood = mood;
    // The night track starts from second 10 each time; the calm one picks up where it was.
    if (mood === 'calm') this.calm.sound.resume();
    else if (!this.tense.sound.isPlaying) this.tense.sound.play(TENSE_MARKER, { volume: 0 });
  }

  /** Every frame, the music of the current mood gets louder and the other one softer. */
  private fade(_time: number, deltaMs: number): void {
    const step = (VOLUME * deltaMs) / FADE_MS;
    const isCalm = this.mood === 'calm';
    moveVolume(this.calm, isCalm ? VOLUME : 0, step);
    moveVolume(this.tense, isCalm ? 0 : VOLUME, step);
    // Silent tracks stop for real, so two songs never play together.
    if (this.calm.volume === 0 && this.calm.sound.isPlaying) this.calm.sound.pause();
    if (this.tense.volume === 0 && this.tense.sound.isPlaying) this.tense.sound.stop();
  }

  /**
   * Kept here: Phaser's WebAudio mute changes on the next audio tick, so reading it right after
   * setting it still gives the old value.
   */
  get muted(): boolean {
    return this.isMuted;
  }

  set muted(muted: boolean) {
    this.isMuted = muted;
    this.game.sound.mute = muted;
  }
}

function moveVolume(track: Track, target: number, step: number): void {
  if (track.volume === target) return;
  track.volume =
    target > track.volume
      ? Math.min(target, track.volume + step)
      : Math.max(target, track.volume - step);
  // BaseSound has no volume; the WebAudio and HTML5 sounds Phaser creates both do.
  const { sound } = track;
  if ('setVolume' in sound && typeof sound.setVolume === 'function') sound.setVolume(track.volume);
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
