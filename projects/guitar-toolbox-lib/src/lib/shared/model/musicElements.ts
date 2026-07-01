export interface ToolboxSearchQuery {
  musicElements: string | number[];
  keys: string;
  type: QueryTypes;
}
export type QueryTypes = 'scale' | 'chord' | 'basic' | 'custom';
