import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMovimientosComponent } from './panel-movimientos.component';

describe('PanelMovimientosComponent', () => {
  let component: PanelMovimientosComponent;
  let fixture: ComponentFixture<PanelMovimientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelMovimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
