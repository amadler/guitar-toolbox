
export type ToolboxIntent = 'show' | 'compare';

export interface ToolboxState {
  intent: ToolboxIntent,
  show: ShowCommand,
  compare: CompareCommand
}

export type ShowKind = 'chord' | 'scale' | 'intervalPattern';
export type MusicKey =
  | 'C' | 'Db' | 'D' | 'Eb' | 'E' | 'F'
  | 'F#' | 'G' | 'Ab' | 'A' | 'Bb' | 'B';

export type Interval =
  | '1' | 'b2' | '2' | 'b3' | '3' | '4'
  | 'b5' | '5' | 'b6' | '6' | 'b7' | '7';

export interface ShowScaleCommand {
  kind: Extract<ShowKind, 'scale'>;
  key: MusicKey | null,
  scaleType?: string | null,
}

export interface ShowChordCommand {
  kind: Extract<ShowKind, 'chord'>,
  key: MusicKey | null,
  chordType: string | null,
}

export interface ShowIntervalPatternCommand {
  kind: Extract<ShowKind, 'intervalPattern'>,
  key: MusicKey | null,
  intervals: Interval[] | null;
}

export type ShowCommand = ShowScaleCommand | ShowChordCommand | ShowIntervalPatternCommand;


export interface CompareCommand {
  kind: 'scaleChordRelation';

  scaleKey: MusicKey;
  scaleType: string;

  chordKey: MusicKey;
  chordType: string;
}


export type FretboardCommand =
  | ShowScaleCommand
  | ShowChordCommand
  | ShowIntervalPatternCommand
  | CompareCommand;

