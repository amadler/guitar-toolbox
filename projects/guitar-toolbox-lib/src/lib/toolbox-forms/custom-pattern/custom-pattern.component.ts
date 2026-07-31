import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { neckConfig } from 'guitar-neck-shared';
import { ToolboxSearchQuery } from '../../shared/model/musicElements';

@Component({
  selector: 'lib-custom-pattern',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-pattern.component.html',
  styleUrls: ['./custom-pattern.component.scss']
})
export class CustomPatternComponent {
  @Output() onSubmit = new EventEmitter<ToolboxSearchQuery>();

  customPatternForm: FormGroup;
  keys = neckConfig.chromaticNotes;

  constructor(private fb: FormBuilder) {
    this.customPatternForm = this.fb.group({
      intervals: ['', [Validators.required, Validators.pattern(/^\d+(,\s*\d+)*$/)]],
      rootNote: [this.keys[0], Validators.required]
    });
  }

  submit() {
    if (this.customPatternForm.valid) {
      const formValue = this.customPatternForm.value;
      // Konwertujemy string interwałów na tablicę liczb
      const intervals = formValue.intervals.split(',').map((i: string) => parseInt(i.trim()));

      const query: ToolboxSearchQuery = {
        type: 'custom',
        musicElements: intervals, // przekazujemy tablicę interwałów
        keys: formValue.rootNote
      };
      this.onSubmit.emit(query);
    }
  }
}
