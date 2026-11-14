import { SCORING } from '../config/balance';
import { averageStat } from './stats';
import type { RunState } from './types';

export interface RunResult {
  score: number;
  stars: StarResults;
}

/** Each star is an objective shown with icons before the run starts. */
export interface StarResults {
  survived: boolean;
  samplesGoalReached: boolean;
  challengeCompleted: boolean;
}

export function calculateResult(state: RunState): RunResult {
  return {
    score: calculateScore(state),
    stars: calculateStars(state),
  };
}

function calculateScore(state: RunState): number {
  const healthPoints = averageStat(state.stats) * SCORING.pointsPerAverageStatPoint;
  const samplePoints = state.samples * SCORING.pointsPerSample;
  return Math.round(healthPoints + samplePoints);
}

function calculateStars(state: RunState): StarResults {
  const { challenge, samplesGoal } = state.location;
  return {
    survived: state.status === 'survived',
    samplesGoalReached: state.samples >= samplesGoal,
    challengeCompleted: state.lowestStats[challenge.stat] >= challenge.minimum,
  };
}

export function countStars(stars: StarResults): number {
  return Object.values(stars).filter(Boolean).length;
}
