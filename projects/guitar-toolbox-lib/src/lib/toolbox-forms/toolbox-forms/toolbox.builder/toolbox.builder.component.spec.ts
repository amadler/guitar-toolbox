import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolboxBuilderComponent } from './toolbox.builder.component';

describe('ToolboxBuilderComponent', () => {
  let component: ToolboxBuilderComponent;
  let fixture: ComponentFixture<ToolboxBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolboxBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolboxBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
