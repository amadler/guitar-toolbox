export interface ToolboxSearchQuery {
  musicElements: string;
  keys: string;
  type: QueryTypes;
  fretRange?: { start: number; end: number };
}
export type QueryTypes = 'scale' | 'chord' | 'basic' | 'custom';
