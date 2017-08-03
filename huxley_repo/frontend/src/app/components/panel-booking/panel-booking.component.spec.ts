import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelBookingComponent } from './panel-booking.component';

describe('PanelBookingComponent', () => {
  let component: PanelBookingComponent;
  let fixture: ComponentFixture<PanelBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
