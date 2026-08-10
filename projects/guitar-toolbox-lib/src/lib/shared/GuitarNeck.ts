/**
 * Represents a guitar neck.
 */

import { NeckConfig } from "guitar-neck-shared";
// TODO: Possiblu should be moved to GUI shell
class GuitarNeck {

  constructor(private readonly neckConfig: NeckConfig) { }
  /**
   * Creates a two-dimensional array representing the guitar neck.
   * Each element in the array represents a fret on a string of the guitar.
   * @returns The guitar neck array.
   */
  private createGuitarNeckArray(): string[][] {
    const neck: string[][] = [];
    for (let i = 0; i < this.neckConfig.stringNotes.length; i++) {
      const stringNote = this.neckConfig.stringNotes[i];
      const string: string[] = [];
      const startNoteIndex = this.neckConfig.chromaticNotes.indexOf(stringNote);
      for (let j = 0; j < this.neckConfig.numberOfFrets; j++) {
        const noteIndex = (startNoteIndex + j) % this.neckConfig.chromaticNotes.length;
        const note = this.neckConfig.chromaticNotes[noteIndex];
        string.push(note);
      }
      neck.push(string);
    }
    return neck;
  }
}

export default GuitarNeck;
