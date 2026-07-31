import { NgFor } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { QueryTypes, ToolboxSearchQuery } from '../../shared/model/musicElements';
import { CHORD_PATTERNS, neckConfig, SCALE_PATTERNS } from 'guitar-neck-shared';

@Component({
  selector: 'lib-scale-or-chord',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './scale-or-chord.component.html',
  styleUrls: ['./scale-or-chord.component.scss']
})
export class ScaleOrChordComponent implements OnDestroy {
  @Output() onSubmit: EventEmitter<ToolboxSearchQuery> = new EventEmitter<ToolboxSearchQuery>();
  guitarForm: FormGroup;
  private valueChangesSub?: Subscription;

  keys = neckConfig.chromaticNotes;

  elementTypes = [
    { id: 'basic', name: 'Basic' },
    { id: 'scale', name: 'Scale' },
    { id: 'chord', name: 'Chord' },
  ];

  patterns: { [key: string]: string[] } = {
    basic: ['Single note', 'All notes'],
    scale: SCALE_PATTERNS.map(scale => scale.name),
    chord: CHORD_PATTERNS.map(chord => chord.name),
  };

  availablePatterns: string[] = this.patterns['basic'];
  selectedElementType: QueryTypes = 'basic';

  constructor(private fb: FormBuilder) {
    this.guitarForm = this.fb.group({
      elementType: ['basic'],
      pattern: ['Single note'],
      key: this.keys[0] || 'C'
    });

    this.valueChangesSub = this.guitarForm.get('elementType')?.valueChanges.subscribe(type => {
      this.availablePatterns = this.patterns[type];
      this.selectedElementType = type;
      this.guitarForm.patchValue({ pattern: this.availablePatterns[0] });
    });
  }

  submit() {
    if (this.guitarForm.valid) {
      const formValue = this.guitarForm.value;
      const query: ToolboxSearchQuery = {
        musicElements: formValue.pattern,
        keys: formValue.key,
        type: this.selectedElementType
      };
      this.onSubmit.emit(query);
    }
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
  }
}
