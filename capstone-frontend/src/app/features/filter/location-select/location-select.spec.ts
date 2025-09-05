import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSelect } from './location-select';

describe('LocationSelect', () => {
  let component: LocationSelect;
  let fixture: ComponentFixture<LocationSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
