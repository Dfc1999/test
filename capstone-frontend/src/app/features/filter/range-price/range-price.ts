import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-range-price',
  standalone: true,
  imports: [CommonModule, MatSliderModule],
  templateUrl: './range-price.html',
  styleUrls: ['./range-price.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangePrice {

  // Recibimos el valor actual del rango de precio desde el componente padre para mostrarlo inicialmente
  @Input() priceRange = 500;

  // Emitimos un evento cuando el usuario cambia el rango de precio para actualizar al padre
  @Output() priceRangeChange = new EventEmitter<number>();

  onPriceChange(value: number) {
    this.priceRange = value;
    this.priceRangeChange.emit(value);
  }
}






