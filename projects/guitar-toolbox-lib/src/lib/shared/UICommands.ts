/**
 * NoteSelector interface that the consumer app implements.
 * The library defines this contract; the consumer provides the implementation.
 */
export interface NoteSelector {
  selectChord(triadName: string, rootNote: string): any;
  selectScale(scaleName: string, rootNote: string): any;
  selectNote(noteName: string): void;
  selectAllNotes(): void;
  selectNotes(notes: string[], rootNote: string): any;
}

export interface Command {
  execute(): void;
}

export class DisplaySingleNoteCommand implements Command {
  constructor(
    private noteSelector: NoteSelector,
    private keys: string) {}

  execute(): void {
    this.noteSelector.selectNote(this.keys);
  }
}

export class DisplayAllNotesCommand implements Command {
  constructor(private noteSelector: NoteSelector) {}

  execute(): void {
    this.noteSelector.selectAllNotes();
  }
}

export class DisplayScaleCommand implements Command {
  constructor(
    private noteSelector: NoteSelector,
    private scaleName: string,
    private rootNote: string
  ) {}

  execute(): void {
    this.noteSelector.selectScale(this.scaleName, this.rootNote)
      .subscribe({
        next: (notes:any) => console.log('Scale displayed:', notes),
        error: (error:any) => console.error('Error displaying scale:', error)
      });
  }
}

export class DisplayChordCommand implements Command {
  constructor(
    private noteSelector: NoteSelector,
    private triadName: string,
    private rootNote: string
  ) {}

  execute(): void {
    this.noteSelector.selectChord(this.triadName, this.rootNote)
      .subscribe({
        next: (notes:any) => console.log('Chord displayed:', notes),
        error: (error:any) => console.error('Error displaying chord:', error)
      });
  }
}

export class DisplayCustomPatternCommand implements Command {
  constructor(
    private noteSelector: NoteSelector,
    private intervals: number[],
    private rootNote: string
  ) {}

  execute(): void {
    const notes = this.calculateNotesFromIntervals();
    this.noteSelector.selectNotes(notes, this.rootNote).subscribe();
  }

  private calculateNotesFromIntervals(): string[] {
    const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = chromaticScale.indexOf(this.rootNote);
    const notes = [this.rootNote];

    let currentIndex = rootIndex;
    for (const interval of this.intervals) {
      currentIndex = (currentIndex + interval) % 12;
      notes.push(chromaticScale[currentIndex]);
    }

    return notes;
  }
}

