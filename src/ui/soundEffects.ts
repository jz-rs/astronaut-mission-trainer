import Phaser from 'phaser';

/**
 * Short sound effects, also real NASA recordings (docs/DATA_SOURCES.md):
 *   - tap: one soft note of a star, from the sonification of Webb's Cosmic Cliffs. It plays
 *     for anything the kid touches that reacts (buttons, rooms, molecules, tools), so every
 *     touch answers with a sound (AGENTS.md §4);
 *   - landing: the rumble of the Artemis I launch, while the cabin zooms toward the window.
 * The sound button (soundButton.ts) mutes these too.
 */
const TAP_KEY = 'sfxTap';
const LANDING_KEY = 'sfxLanding';
const TAP_VOLUME = 0.5;
const LANDING_VOLUME = 0.6;

export function preloadSoundEffects(load: Phaser.Loader.LoaderPlugin): void {
  load.audio(TAP_KEY, 'assets/audio/sfx-tap-webb-star.m4a');
  load.audio(LANDING_KEY, 'assets/audio/sfx-landing-artemis-liftoff.m4a');
}

/**
 * Every scene, each time it starts, plays the tap for touches on its interactive objects. So
 * no scene has to remember it, and new scenes get it too.
 */
export function startTapSounds(game: Phaser.Game): void {
  const playTap = () => game.sound.play(TAP_KEY, { volume: TAP_VOLUME });
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
