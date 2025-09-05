import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestCounter } from './guest-counter';

describe('GuestCounter', () => {
  let component: GuestCounter;
  let fixture: ComponentFixture<GuestCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestCounter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestCounter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
