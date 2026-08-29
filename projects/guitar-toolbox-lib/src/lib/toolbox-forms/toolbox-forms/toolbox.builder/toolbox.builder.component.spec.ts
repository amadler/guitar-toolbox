import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolboxBuilderComponent } from './toolbox.builder.component';
import { ShowScaleCommand, CompareCommand } from './model';

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

  it('should toggle intent and emit command on submit', () => {
    spyOn(component.toolboxEvent, 'emit');

    component.submit();
    expect(component.toolboxEvent.emit).toHaveBeenCalledWith({
      kind: 'scale',
      key: 'C',
      scaleType: 'ionian'
    } as ShowScaleCommand);

    component.setIntent('compare');
    fixture.detectChanges();

    component.submit();
    expect(component.toolboxEvent.emit).toHaveBeenCalledWith({
      kind: 'scaleChordRelation',
      scaleKey: 'C',
      scaleType: 'ionian',
      chordKey: 'C',
      chordType: 'major'
    } as CompareCommand);
  });
});
