import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, CommonModule],
  templateUrl: './location-select.html',
  styleUrls: ['./location-select.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSelect {

  // Recibimos la ubicación seleccionada desde el componente padre para mostrarla inicialmente
  @Input() location?: string;

  // Emitimos un evento cuando el usuario selecciona una nueva ubicación para notificar al padre
  @Output() locationChange = new EventEmitter<string>();

  locations = ['Bolivia', 'Argentina', 'Chile', 'Peru', 'Brazil'];

  onLocationChange(value: string) {
    this.location = value;
    this.locationChange.emit(value);
  }
}

