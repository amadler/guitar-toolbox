import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { FretboardCommand, ShowChordCommand, ShowCommand, ShowScaleCommand, ToolboxState } from './model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgSwitchCase } from "@angular/common";
import { CHORD_PATTERNS, neckConfig, SCALE_PATTERNS } from 'guitar-neck-shared';



@Component({
  selector: 'app-toolbox-builder',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf, NgSwitchCase],
  templateUrl: './toolbox.builder.component.html',
  styleUrl: './toolbox.builder.component.scss'
})
export class ToolboxBuilderComponent {
  @Output() toolboxEvent: EventEmitter<FretboardCommand> = new EventEmitter<FretboardCommand>();
  emmiter = {};
  toolboxForm: FormGroup;

  musicKeys = neckConfig.chromaticNotes;
  scalePatternNames = SCALE_PATTERNS.map(scale => scale.name);
  chordPatternNames = CHORD_PATTERNS.map(scale => scale.name);

  private readonly defaultShowGroup = {
    scaleGroup: {
      kind: 'scale',
      key: 'C',
      scaleType: this.scalePatternNames[0],
    },
    chordGroup: {
      kind: 'chord',
      key: 'C',
      chordType: this.chordPatternNames[0],
    }
  };

  constructor(private fb: FormBuilder) {
    this.toolboxForm = this.fb.group({
      intent: 'show',
      kindControl: 'scale',
      showGroup: this.fb.group(this.defaultShowGroup),
      compareGroup: this.fb.group({})
    });

    this.toolboxForm.get('intent')!.valueChanges.subscribe(intent => {
      if (intent === 'show') {
        this.toolboxForm.get('compareGroup')?.reset({});
        this.toolboxForm.get('showGroup')?.reset(this.defaultShowGroup);
        this.toolboxForm.get('kindControl')?.setValue('scale');
      }
      if (intent === 'compare') {
        this.toolboxForm.get('showGroup')?.reset(this.defaultShowGroup);
        this.toolboxForm.get('compareGroup')?.reset({});
      }

    })
  }

  submit() {
    this.emmiter = this.toolboxForm.value

    console.log('Emitted value: ', this.emmiter);
    this.toolboxEvent.emit(this.emmiter as FretboardCommand);
  }


  get selectedKind(): string | null {
    return this.toolboxForm.get('kindControl')?.value ?? null;
  }







  // buildSentence(command: ShowCommand): string {
  //   switch (command.kind) {
  //     case 'scale':
  //       return `Show ${command.key} ${command.scaleType} scale`;

  //     case 'chord':
  //       return `Show ${command.key} ${command.chordType} chord`;

  //     case 'intervalPattern':
  //       return `Show pattern ${command.intervals.join(', ')} in ${command.key}`;
  //   }
  // }

}
