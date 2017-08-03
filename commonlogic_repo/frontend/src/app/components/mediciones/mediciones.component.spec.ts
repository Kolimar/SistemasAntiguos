import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicionesComponent } from './mediciones.component';

describe('MedicionesComponent', () => {
  let component: MedicionesComponent;
  let fixture: ComponentFixture<MedicionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
