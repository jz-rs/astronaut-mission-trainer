import Phaser from 'phaser';

/**
 * Short sound effects, also real NASA recordings (docs/DATA_SOURCES.md):
 *   - tap: one note of a star, from the sonification of Webb's Cosmic Cliffs, an octave lower
 *     and soft, so it fits under the calm music. It plays for anything the kid touches that
 *     reacts (buttons, rooms, molecules, tools), so every touch answers (AGENTS.md §4);
 *   - landing: a real Martian dust devil passing over Perseverance, while the cabin zooms
 *     toward the window (its last gust lands with the touchdown);
 *   - alert: two Quindar beeps, the radio tones of Apollo's Mission Control, when a message
 *     from Earth arrives;
 *   - error: two low "donks" (InSight's seismometer "dink", an octave lower), an "uh-oh" for
 *     wrong choices (wrongChoice.ts).
 * The sound button (soundButton.ts) mutes these too.
 */
const TAP_KEY = 'sfxTap';
const LANDING_KEY = 'sfxLanding';
const ALERT_KEY = 'sfxAlert';
const ERROR_KEY = 'sfxError';
const TAP_VOLUME = 0.15;
/** One octave lower: warmer and closer to the calm music. */
const TAP_DETUNE_CENTS = -1_200;
const LANDING_VOLUME = 0.7;
const ALERT_VOLUME = 0.3;
const ERROR_VOLUME = 0.45;

export function preloadSoundEffects(load: Phaser.Loader.LoaderPlugin): void {
  load.audio(TAP_KEY, 'assets/audio/sfx-tap-webb-star.m4a');
  load.audio(LANDING_KEY, 'assets/audio/sfx-landing-mars-dust-devil.m4a');
  load.audio(ALERT_KEY, 'assets/audio/sfx-alert-apollo-quindar.m4a');
  load.audio(ERROR_KEY, 'assets/audio/sfx-error-insight-donk.m4a');
}

/**
 * Every scene, each time it starts, plays the tap for touches on its interactive objects. So
 * no scene has to remember it, and new scenes get it too.
 */
export function startTapSounds(game: Phaser.Game): void {
  const playTap = () => game.sound.play(TAP_KEY, { volume: TAP_VOLUME, detune: TAP_DETUNE_CENTS });
  for (const scene of game.scene.scenes) {
    scene.sys.events.on(Phaser.Scenes.Events.START, () => {
      scene.input.off(Phaser.Input.Events.GAMEOBJECT_DOWN, playTap); // never twice per touch
      scene.input.on(Phaser.Input.Events.GAMEOBJECT_DOWN, playTap);
    });
  }
}

export function playLandingRumble(scene: Phaser.Scene): void {
  scene.sound.play(LANDING_KEY, { volume: LANDING_VOLUME });
}

export function playErrorSound(scene: Phaser.Scene): void {
  scene.sound.play(ERROR_KEY, { volume: ERROR_VOLUME });
}

export function playAlertSound(scene: Phaser.Scene): void {
  scene.sound.play(ALERT_KEY, { volume: ALERT_VOLUME });
}
