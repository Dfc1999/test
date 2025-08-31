import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangePrice } from './range-price';

describe('RangePrice', () => {
  let component: RangePrice;
  let fixture: ComponentFixture<RangePrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangePrice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangePrice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
