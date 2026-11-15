import type { Point } from '../../ui/layout';

/**
 * Spec 09 — Where things are in the greenhouse room picture (in picture pixels; every location
 * uses the same room layout). Measured on `sala-invernadero-*.png`.
 */

/**
 * Where each lettuce stands in one of the 6 beds, back row first so the front plants are drawn
 * over the back ones. Each spot is the middle of the soil of its bed, found by its brown color.
 */
export const BEDS_IN_PICTURE: readonly Point[] = [
  { x: 384, y: 358 },
  { x: 560, y: 402 },
  { x: 740, y: 440 },
  { x: 302, y: 444 },
  { x: 467, y: 490 },
  { x: 646, y: 535 },
];

/**
 * Parts of the room that are in front of the beds: the two lamps that hang low over the back
 * beds and the green pillar on the right. They are drawn again over the plants, so the plants
 * grow under the lamps and behind the pillar instead of on top of them.
 */
export const IN_FRONT_OF_BEDS: readonly (readonly Point[])[] = [
  [
    { x: 394, y: 345 },
    { x: 475, y: 302 },
    { x: 495, y: 312 },
    { x: 495, y: 330 },
    { x: 420, y: 372 },
    { x: 395, y: 365 },
  ],
  [
    { x: 589, y: 402 },
    { x: 670, y: 352 },
    { x: 690, y: 362 },
    { x: 690, y: 382 },
    { x: 615, y: 422 },
    { x: 590, y: 417 },
  ],
  [
    { x: 755, y: 437 },
    { x: 777, y: 430 },
    { x: 800, y: 437 },
    { x: 800, y: 600 },
    { x: 777, y: 610 },
    { x: 755, y: 600 },
  ],
];
