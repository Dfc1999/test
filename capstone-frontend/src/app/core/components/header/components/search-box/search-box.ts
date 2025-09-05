import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './search-box.html',
  styleUrls: ['./search-box.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBox {
  // Esto permite que SearchBox muestre el estado actual de los filtros para que el usuario los vea y pueda interactuar con ellos
  @Input() filters: any = {};

  // Se usa para que el padre controle la visibilidad de la UI donde el usuario selecciona o modifica filtros
  @Output() toggleFilters = new EventEmitter<void>();

  onClick() {
    this.toggleFilters.emit();
  }

  removeFilter(key: string) {
    if (this.filters[key]) {
      if (typeof this.filters[key] === 'string' || typeof this.filters[key] === 'number') {
        delete this.filters[key];
      } else if (typeof this.filters[key] === 'object') {
        this.filters[key] = null;
      }
    }
  }

  hasFilters(): boolean {
    return this.filters && (
      this.filters.guests ||
      this.filters.location ||
      this.filters.checkIn ||
      this.filters.checkOut ||
      this.filters.priceRange
    );
  }

  getFilterSummary(): string {
    if (!this.hasFilters()) {
      return '';
    }

    const parts: string[] = [];

    if (this.filters.guests) {
      parts.push(`Guests: ${this.filters.guests}`);
    }
    if (this.filters.location) {
      parts.push(`Location: ${this.filters.location}`);
    }
    if (this.filters.checkIn) {
      parts.push(`Check-in: ${new Date(this.filters.checkIn).toLocaleDateString()}`);
    }
    if (this.filters.checkOut) {
      parts.push(`Check-out: ${new Date(this.filters.checkOut).toLocaleDateString()}`);
    }
    if (this.filters.priceRange) {
      parts.push(`Max Price: $${this.filters.priceRange}`);
    }

    return parts.join(', ');
  }
}

