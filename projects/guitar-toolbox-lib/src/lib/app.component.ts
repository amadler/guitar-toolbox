import { Component } from '@angular/core';
import { ToolboxFormComponent } from './toolbox-form/toolbox-form.component';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolboxFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private api: ApiService
  ) {
  }

  toolboxSubmit(query: any) {
    console.log('Received query:', query);
    this.api.sendToolboxRequest(query).subscribe(
      (response) => console.log('Response:', response),
      (error) => console.error('Error:', error)
    );
  }
}
