import Phaser from 'phaser';
import { t } from '../../i18n';
import { FONT_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';

/** "YOU" over the player's astronaut, so a kid knows which of the 4 astronauts is theirs. */
const OFFSET_Y = 50;
const DEPTH = 30;

export function addYouTag(scene: Phaser.Scene, astronaut: Phaser.GameObjects.Sprite): void {
  const tag = addText(scene, astronaut.x, astronaut.y - OFFSET_Y, t('hud.you'), {
    size: FONT_SIZE.small,
    color: PALETTE.sun,
  }).setDepth(DEPTH);
  const follow = () => tag.setPosition(astronaut.x, astronaut.y - OFFSET_Y);
  scene.events.on(Phaser.Scenes.Events.UPDATE, follow);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.events.off(Phaser.Scenes.Events.UPDATE, follow);
  });
}
