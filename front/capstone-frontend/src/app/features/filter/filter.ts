import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { GuestCounter } from './guest-counter/guest-counter';
import { DatePicker } from './date-picker/date-picker';
import { LocationSelect } from './location-select/location-select'; 
import { RangePrice } from './range-price/range-price';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [GuestCounter, DatePicker, LocationSelect, RangePrice, FormsModule],
  templateUrl: './filter.html',
  styleUrls: ['./filter.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Filter {

  // Emitimos un evento con todos los filtros actualizados cuando se aplican cambios
  @Output() filtersChange = new EventEmitter<any>();

  draftFilters = {
    guests: 1,
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    location: '',
    priceRange: 500,
  };

  // Recibimos un objeto con los filtros desde el componente padre para inicializar o actualizar los valores
  @Input() set filters(value: any) {
    if (value) {
      this.draftFilters = { ...value };
    }
  }

  applyFilters() {
    this.filtersChange.emit({ ...this.draftFilters });
  }
}