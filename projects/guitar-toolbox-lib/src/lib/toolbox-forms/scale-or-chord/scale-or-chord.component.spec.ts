// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { ScaleOrChordComponent } from './scale-or-chord.component';
// import { ReactiveFormsModule } from '@angular/forms';

// describe('ToolboxFormComponent', () => {
//   let component: ScaleOrChordComponent;
//   let fixture: ComponentFixture<ScaleOrChordComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule, ScaleOrChordComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(ScaleOrChordComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize formGroup with default values', () => {
//     expect(component.guitarForm.value).toEqual({
//       elementType: 'basic',
//       pattern: 'Single note',
//       key: 'A'
//     });
//   });

//   it('should render the correct number of options for patterns', () => {
//     const options = fixture.debugElement.queryAll(By.css('#pattern option'));
//     expect(options.length).toBe(component.availablePatterns.length);
//   });

//   it('should render the correct number of options for keys', () => {
//     const options = fixture.debugElement.queryAll(By.css('#key option'));
//     expect(options.length).toBe(component.keys.length);
//   });

//   it('should emit the correct value when form is submitted', () => {
//     spyOn(component.onSubmit, 'emit');
//     component.guitarForm.patchValue({
//       elementType: 'basic',
//       pattern: 'Single note',
//       key: 'A'
//     });
//     fixture.detectChanges();

//     const form = fixture.debugElement.query(By.css('form')).nativeElement;
//     form.dispatchEvent(new Event('submit'));
//     fixture.detectChanges();

//     expect(component.onSubmit.emit).toHaveBeenCalledOnceWith({
//       musicElements: 'Single note',
//       keys: 'A',
//       type: 'basic'
//     });
//   });
// });
