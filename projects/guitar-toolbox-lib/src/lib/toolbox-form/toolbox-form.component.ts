import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { QueryTypes, ToolboxSearchQuery } from '../shared/model/musicElements';
import { CHORD_PATTERNS, neckConfig, SCALE_PATTERNS } from 'guitar-neck-shared';
import { CustomPatternComponent } from '../custom-pattern/custom-pattern.component';

export interface RangePreset {
  id: string;
  icon: string;
  label: string;
  start: number;
  end: number;
}

@Component({
  selector: 'lib-toolbox-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, NgIf, CustomPatternComponent],
  templateUrl: './toolbox-form.component.html',
  styleUrls: ['./toolbox-form.component.scss']
})
export class ToolboxFormComponent implements OnDestroy {
  @Output() onSubmit$: EventEmitter<ToolboxSearchQuery> = new EventEmitter<ToolboxSearchQuery>();
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

  showCustomPattern = false;

  // --- Fret Range ---
  rangePresets: RangePreset[] = [
    { id: 'open',      icon: '🎸', label: 'Open',      start: 0,  end: 4 },
    { id: 'fifth',     icon: '🎸', label: '5th Pos.',   start: 5,  end: 9 },
    { id: 'ninth',     icon: '🎸', label: '9th Pos.',   start: 9,  end: 13 },
    { id: 'twelfth',   icon: '🎸', label: '12th Pos.',  start: 12, end: 16 },
    { id: 'full',      icon: '🎸', label: 'Full Neck',  start: 0,  end: 24 },
  ];

  activePreset: string = 'open';
  customStart: number = 0;
  customEnd: number = 24;
  startFret: number = 0;
  endFret: number = 4;

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

  selectPreset(presetId: string): void {
    const preset = this.rangePresets.find(p => p.id === presetId);
    if (preset) {
      this.activePreset = presetId;
      this.startFret = preset.start;
      this.endFret = preset.end;
    }
  }

  applyCustomRange(): void {
    const start = Math.min(this.customStart, this.customEnd);
    const end = Math.max(this.customStart, this.customEnd);
    this.startFret = Math.max(0, Math.min(start, 24));
    this.endFret = Math.max(0, Math.min(end, 24));
    this.activePreset = 'custom';
  }

  onSubmit() {
    if (this.guitarForm.valid) {
      const formValue = this.guitarForm.value;
      const query: ToolboxSearchQuery = {
        musicElements: formValue.pattern,
        keys: formValue.key,
        type: this.selectedElementType,
        fretRange: { start: this.startFret, end: this.endFret }
      };
      this.onSubmit$.emit(query);
    }
  }

  onCustomPatternSubmit(query: ToolboxSearchQuery) {
    query.fretRange = { start: this.startFret, end: this.endFret };
    this.onSubmit$.emit(query);
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
  }
}
