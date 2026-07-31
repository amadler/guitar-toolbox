import { Component, EventEmitter, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { neckConfig, SCALE_PATTERNS, CHORD_PATTERNS } from 'guitar-neck-shared';
import { ScaleChordRelation } from '../../shared/model/musicElements';


@Component({
  selector: 'lib-scale-chord-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './scale-chord-form.component.html',
  styleUrl: './scale-chord-form.component.scss',
})
export class ScaleChordFormComponent{
  /** Emitted when the user clicks Show relationship. */
  @Output() onSubmit = new EventEmitter<ScaleChordRelation>();

  guitarForm: FormGroup;
  constructor( private fb: FormBuilder) {
    this.guitarForm = this.fb.group({
      chordName:'major',
      chordRoot: 'C',
      scaleName: 'major',
      scaleRoot: 'C'

    });
  }
  scales: string[] = SCALE_PATTERNS.map(scale => scale.name);
  chords: string[] = CHORD_PATTERNS.map(chord => chord.name);

  keys: string[] = neckConfig.chromaticNotes;

  submit(): void {
    this.onSubmit.emit(this.guitarForm.value);
  }
}
