import { Component, EventEmitter, Output } from '@angular/core';

import { ScaleChordRelation, ToolboxSearchQuery } from '../shared/model/musicElements';
import { ScaleChordFormComponent } from './scale-chord-form/scale-chord-form.component';
import { NgIf } from '@angular/common';
import { ScaleOrChordComponent } from './scale-or-chord/scale-or-chord.component';
import { CustomPatternComponent } from './custom-pattern/custom-pattern.component';

export type FromMode = 'custom-pattern' | 'scale-or-chord' | 'scale-chord';

@Component({
  selector: 'lib-forms-wrapper',
  standalone: true,
  imports: [NgIf, CustomPatternComponent, ScaleChordFormComponent, ScaleOrChordComponent],
  templateUrl: './forms-wrapper.component.html',
  styleUrl: './forms-wrapper.component.css'
})
export class FormsWrapperComponent {
  @Output() onSubmitEv: EventEmitter<ToolboxSearchQuery | ScaleChordRelation> = new EventEmitter<ToolboxSearchQuery | ScaleChordRelation>();
  @Output() onAppModeChange: EventEmitter<FromMode> = new EventEmitter<FromMode>();

  activeMode: FromMode = 'scale-or-chord';
  changeActiveMode(mode: FromMode): void {
    this.activeMode = mode;
    this.onAppModeChange.emit(mode);
  }

  onSubmit(query: ToolboxSearchQuery | ScaleChordRelation) {
    this.onSubmitEv.emit(query);
  }
}
