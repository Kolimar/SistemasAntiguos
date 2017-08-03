import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarContenedoresComponent } from './editar-contenedores.component';

describe('EditarContenedoresComponent', () => {
  let component: EditarContenedoresComponent;
  let fixture: ComponentFixture<EditarContenedoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarContenedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarContenedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
