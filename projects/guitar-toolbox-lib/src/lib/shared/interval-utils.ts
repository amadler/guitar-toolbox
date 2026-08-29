import { Interval, MusicKey } from '../toolbox-forms/toolbox-forms/toolbox.builder/model';
import { CHORD_PATTERNS } from 'guitar-neck-shared';

/**
 * Map from semitone position (0-11) to Interval label.
 * 0 = root, 1 = b2, 2 = 2, ... 11 = 7
 */
const SEMITONE_TO_INTERVAL: Record<number, Interval> = {
  0: '1',
  1: 'b2',
  2: '2',
  3: 'b3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: 'b6',
  9: '6',
  10: 'b7',
  11: '7',
};

/** Chromatic scale note names (natural + sharp/flat). */
const CHROMATIC_NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

/**
 * Predefined interval patterns for the "interval pattern" show mode.
 * Generated from CHORD_PATTERNS (26 chord types) + single note.
 * Each entry has a human-readable label and the corresponding Interval[].
 */
export interface PredefinedPattern {
  label: string;
  intervals: Interval[];
}

/**
 * Convert cumulative semitone steps (e.g. [4, 3] for major chord)
 * to absolute Interval labels (e.g. ['1', '3', '5']).
 *
 * CHORD_PATTERNS.intervals are cumulative steps from the previous note.
 * The first note is always the root (position 0 → '1').
 */
function cumulativeStepsToIntervals(steps: number[]): Interval[] {
  const result: Interval[] = ['1'];
  let position = 0;
  for (const step of steps) {
    position = (position + step) % 12;
    result.push(SEMITONE_TO_INTERVAL[position]);
  }
  return result;
}

/**
 * Predefined patterns built from CHORD_PATTERNS + single note.
 */
export const PREDEFINED_PATTERNS: PredefinedPattern[] = [
  { label: 'single note', intervals: ['1'] },
  ...CHORD_PATTERNS.map(pattern => ({
    label: pattern.name,
    intervals: cumulativeStepsToIntervals(pattern.intervals),
  })),
];

/**
 * Convert an array of Interval labels (e.g. ['1', 'b3', '5']) and a root key
 * to an array of note names (e.g. ['C', 'Eb', 'G']).
 *
 * Each Interval label is an absolute semitone position relative to the root.
 */
export function intervalsToNoteNames(root: MusicKey, intervals: Interval[]): string[] {
  const rootIndex = CHROMATIC_NOTES.indexOf(root);
  if (rootIndex === -1) return [];

  const intervalToSemitone: Record<Interval, number> = {
    '1': 0, 'b2': 1, '2': 2, 'b3': 3, '3': 4,
    '4': 5, 'b5': 6, '5': 7, 'b6': 8, '6': 9,
    'b7': 10, '7': 11,
  };

  return intervals.map(interval => {
    const semitone = intervalToSemitone[interval];
    const noteIndex = (rootIndex + semitone) % 12;
    return CHROMATIC_NOTES[noteIndex];
  });
}