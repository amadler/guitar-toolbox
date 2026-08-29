import { Component } from '@angular/core';
import { FormsWrapperComponent } from '../../projects/guitar-toolbox-lib/src/lib/toolbox-forms/forms-wrapper.component';
import { ApiService, FretboardCommand } from 'guitar-toolbox-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsWrapperComponent],
  template: `
    <lib-forms-wrapper (toolboxEv)="toolboxSubmit($event)"></lib-forms-wrapper>
  `
})
export class AppComponent {
  constructor(
    private api: ApiService
  ) {
  }

  toolboxSubmit(command: FretboardCommand) {
    // console.log('Toolbox command received:', command);
  }
}
