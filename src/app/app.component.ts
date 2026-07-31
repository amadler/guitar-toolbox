import { Component } from '@angular/core';
import { FormsWrapperComponent } from '../../projects/guitar-toolbox-lib/src/lib/toolbox-forms/forms-wrapper.component';
import { ApiService } from 'guitar-toolbox-lib';
import { ToolboxSearchQuery } from '../../projects/guitar-toolbox-lib/src/public-api';
import { ScaleChordRelation } from '../../projects/guitar-toolbox-lib/src/lib/shared/model/musicElements';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsWrapperComponent],
  template: `
    <lib-forms-wrapper (onSubmitEv)="toolboxSubmit($event)"></lib-forms-wrapper>
  `
})
export class AppComponent {
  constructor(
    private api: ApiService
  ) {
  }

  isToolboxSearchQuery(
    query: ToolboxSearchQuery | ScaleChordRelation
  ): query is ToolboxSearchQuery {
    return 'musicElements' in query && 'keys' in query;
  }

  toolboxSubmit(query: ToolboxSearchQuery | ScaleChordRelation) {

    if (this.isToolboxSearchQuery(query)) {
      console.log('isToolboxSearchQuery query:', query);
      this.api.sendToolboxRequest(query).subscribe(
        (response) => console.log('Response:', response),
        (error) => console.error('Error:', error)
      );
    } else {
      // TODO: Gdzie ma lecieć request?
      console.log('TODO: Gdzie ma lecieć request:', query);
    }

  }
}
