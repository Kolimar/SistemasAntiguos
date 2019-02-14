import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelContenedoresComponent } from './panel-contenedores.component';

describe('PanelContenedoresComponent', () => {
  let component: PanelContenedoresComponent;
  let fixture: ComponentFixture<PanelContenedoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelContenedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelContenedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
