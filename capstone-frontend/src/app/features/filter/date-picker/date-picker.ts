import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
  ],
  templateUrl: './date-picker.html',
  styleUrls: ['./date-picker.scss']
})
export class DatePicker {
  // Recibimos la fecha de check-in desde el componente padre para mostrarla inicialmente
  @Input() checkIn?: Date;

  // Emitimos un evento cuando la fecha de check-in cambia para notificar al padre
  @Output() checkInChange = new EventEmitter<Date>();

  // Recibimos la fecha de check-out desde el componente padre para mostrarla inicialmente
  @Input() checkOut?: Date;

  // Emitimos un evento cuando la fecha de check-out cambia para notificar al padre
  @Output() checkOutChange = new EventEmitter<Date>();

  onCheckInChange(date: Date) {
    this.checkIn = date;
    this.checkInChange.emit(date);
  }

  onCheckOutChange(date: Date) {
    this.checkOut = date;
    this.checkOutChange.emit(date);
  }
}

