export interface ToolboxSearchQuery {
  musicElements: string | number[];
  keys: string;
  type: QueryTypes;
}

// TODO możliwa nieścisłość z appMode
export type QueryTypes = 'scale' | 'chord' | 'basic' | 'custom';


export interface ScaleChordRelation {
  scaleName: string;
  scaleRoot: string;
  chordName: string;
  chordRoot: string;
}
