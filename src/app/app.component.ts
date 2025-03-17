import { Component } from '@angular/core';
import { ToolboxFormComponent } from 'guitar-toolbox-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolboxFormComponent],
  template: `
    <lib-toolbox-form (onSubmit$)="toolboxSubmit($event)"></lib-toolbox-form>
  `
})
export class AppComponent {

  toolboxSubmit(query: any) {
    console.log('Received query:', query);
  }
}
