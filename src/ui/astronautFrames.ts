import type Phaser from 'phaser';

/**
 * Crew sprites of the art kit: one suit color per crew member, seen from the front or the back,
 * standing or in one of two steps (STYLE_GUIDE "Tripulación").
 */
export type SuitColor = 'violet' | 'red' | 'green' | 'yellow';
export type Facing = 'front' | 'back';
type Pose = 'idle' | 'step1' | 'step2';

const SUIT_COLORS: readonly SuitColor[] = ['violet', 'red', 'green', 'yellow'];
const FACINGS: readonly Facing[] = ['front', 'back'];
const POSES: readonly Pose[] = ['idle', 'step1', 'step2'];
const WALK_CYCLE: readonly Pose[] = ['step1', 'idle', 'step2', 'idle'];
const WALK_FRAME_RATE = 8;

/** Words used in the file names (`astronauta-violeta-frente-paso1.png`). */
const FILE_WORDS: Record<SuitColor | Facing | Pose, string> = {
  violet: 'violeta',
  red: 'rojo',
  green: 'verde',
  yellow: 'amarillo',
  front: 'frente',
  back: 'espalda',
  idle: 'quieto',
  step1: 'paso1',
  step2: 'paso2',
};

/** Violet is always the player; bots match their visor color in CREW_COLORS. */
export const CREW_SUIT_COLORS: Record<string, SuitColor> = {
  player: 'violet',
  'bot-red': 'red',
  'bot-green': 'green',
  'bot-yellow': 'yellow',
};

export function astronautFrameKey(color: SuitColor, facing: Facing, pose: Pose = 'idle'): string {
  return `astronaut-${color}-${facing}-${pose}`;
}

export function walkAnimationKey(color: SuitColor, facing: Facing): string {
  return `astronaut-${color}-${facing}-walk`;
}

export function astronautFiles(): { key: string; file: string }[] {
  return SUIT_COLORS.flatMap((color) =>
    FACINGS.flatMap((facing) =>
      POSES.map((pose) => ({
        key: astronautFrameKey(color, facing, pose),
        file: `astronauta/astronauta-${FILE_WORDS[color]}-${FILE_WORDS[facing]}-${FILE_WORDS[pose]}.png`,
      })),
    ),
  );
}

export function createWalkAnimations(anims: Phaser.Animations.AnimationManager): void {
  for (const color of SUIT_COLORS) {
    for (const facing of FACINGS) {
      anims.create({
        key: walkAnimationKey(color, facing),
        frames: WALK_CYCLE.map((pose) => ({ key: astronautFrameKey(color, facing, pose) })),
        frameRate: WALK_FRAME_RATE,
        repeat: -1,
      });
    }
  }
}
