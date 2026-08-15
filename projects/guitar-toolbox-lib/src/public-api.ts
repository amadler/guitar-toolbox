/*
 * Public API Surface of guitar-toolbox-lib
 */

// Komponenty
export * from './lib/toolbox-forms/scale-or-chord/scale-or-chord.component';
export * from './lib/toolbox-forms/custom-pattern/custom-pattern.component';
export * from './lib/toolbox-forms/toolbox-forms/toolbox.builder/toolbox.builder.component';

// Serwisy
export * from './lib/api.service';
export { API_BASE_URL } from './lib/api-config.token';

// Modele
export type { ToolboxSearchQuery, QueryTypes, ScaleChordRelation } from './lib/shared/model/musicElements';

export {
  ScaleOrChordComponent,
  ScaleOrChordComponent as ToolboxFormComponent,
} from './lib/toolbox-forms/scale-or-chord/scale-or-chord.component';

export { FormsWrapperComponent } from './lib/toolbox-forms/forms-wrapper.component';


export type { FretboardCommand } from './lib/toolbox-forms/toolbox-forms/toolbox.builder/model';
