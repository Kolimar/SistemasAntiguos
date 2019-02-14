import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaBookingComponent } from './lista-booking.component';

describe('ListaBookingComponent', () => {
  let component: ListaBookingComponent;
  let fixture: ComponentFixture<ListaBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
