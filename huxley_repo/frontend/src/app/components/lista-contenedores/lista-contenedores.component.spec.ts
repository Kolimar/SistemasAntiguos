import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaContenedoresComponent } from './lista-contenedores.component';

describe('ListaContenedoresComponent', () => {
  let component: ListaContenedoresComponent;
  let fixture: ComponentFixture<ListaContenedoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaContenedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaContenedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
