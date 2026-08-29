import { Component, EventEmitter, Output } from '@angular/core';

import { FretboardCommand } from '../../public-api';
import { ToolboxBuilderComponent } from './toolbox-forms/toolbox.builder/toolbox.builder.component';

@Component({
  selector: 'lib-forms-wrapper',
  standalone: true,
  imports: [
    ToolboxBuilderComponent
  ],
  templateUrl: './forms-wrapper.component.html',
  styleUrl: './forms-wrapper.component.css'
})
export class FormsWrapperComponent {
  @Output() toolboxEv: EventEmitter<FretboardCommand> = new EventEmitter<FretboardCommand>();

  onToolboxEmit(query: FretboardCommand) {
    this.toolboxEv.emit(query);
  }
}