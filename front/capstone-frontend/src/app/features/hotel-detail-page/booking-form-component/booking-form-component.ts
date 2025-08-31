import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BookingService, Booking } from '../../../core/services/booking-service/booking-service';
import { LoginService } from '../../../core/services/login-service/login-service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './booking-form-component.html',
  styleUrls: ['./booking-form-component.scss']
})
export class BookingFormComponent implements OnInit {
  objectKeys = Object.keys;

  @Input() hotelId: string | null = null;
  @Input() roomSelections: { [roomId: string]: number } = {};
  @Input() checkIn: Date | null = null;
  @Input() checkOut: Date | null = null;

  @Output() bookingCompleted = new EventEmitter<void>();
  @Output() bookingCancelled = new EventEmitter<void>();

  usernameControl!: FormControl;
  emailControl!: FormControl;
  phoneControl!: FormControl;

  showConfirmation = false;

  constructor(private bookingService: BookingService, private loginService: LoginService) {}

  ngOnInit() {
    const storedUsername = this.loginService.getUsername() || '';

    this.usernameControl = new FormControl(storedUsername, [Validators.required]);
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.phoneControl = new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]);
  }

  onSubmit() {
    if (!this.hotelId || !this.checkIn || !this.checkOut || !this.isFormValid()) return;

    const rooms = Object.keys(this.roomSelections)
      .filter(roomId => this.roomSelections[roomId] > 0)
      .map(roomId => ({
        roomId: roomId,
        quantity: this.roomSelections[roomId]
      }));

    const bookingData: Booking = {
      hotelId: this.hotelId,
      checkInDate: this.checkIn.toISOString(),
      checkOutDate: this.checkOut.toISOString(),
      username: this.usernameControl.value,
      email: this.emailControl.value,
      phone: this.phoneControl.value,
      rooms: rooms,
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        this.showConfirmation = true;
      },
      error: (err) => {
        console.error(err);
        this.showConfirmation = false;
        alert('Booking failed: ' + err.error.message);
      }
    });
  }

  isFormValid(): boolean {
    return this.usernameControl.valid && this.emailControl.valid && this.phoneControl.valid;
  }

  onCancel() {
    this.bookingCancelled.emit();
  }

  closeConfirmation() {
    this.showConfirmation = false;
    this.bookingCompleted.emit();
  }
}

