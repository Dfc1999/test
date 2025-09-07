import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookingService, BookingPayload } from '../../../core/services/booking-service/booking-service';
import { LoginService } from '../../../core/services/login-service/login-service';
import { ConfirmationMessageComponent } from '../../../shared/components/confirmation-message-component/confirmation-message-component';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, ConfirmationMessageComponent
  ],
  templateUrl: './booking-form-component.html',
  styleUrls: ['./booking-form-component.scss']
})
export class BookingFormComponent implements OnInit {

  @Input() hotelId!: string;
  @Input() roomIds: string[] = [];
  @Input() guests: number = 1;
  @Input() checkIn: Date | null | undefined;
  @Input() checkOut: Date | null | undefined;

  @Output() bookingCompleted = new EventEmitter<void>();
  @Output() bookingCancelled = new EventEmitter<void>();

  private bookingService = inject(BookingService);
  private loginService = inject(LoginService);
  
  usernameControl!: FormControl;
  emailControl!: FormControl;
  phoneControl!: FormControl;
  confirmationData: { message: string, type: 'success' | 'error' } | null = null;

  ngOnInit() {
    const storedUsername = this.loginService.getUsername() || '';
    this.usernameControl = new FormControl(storedUsername, [Validators.required]);
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.phoneControl = new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]);
  }

  onSubmit() {
    if (!this.hotelId || !this.checkIn || !this.checkOut || !this.isFormValid()) return;

    const bookingData: BookingPayload = {
      hotelId: this.hotelId,
      checkInDate: this.checkIn.toISOString(),
      checkOutDate: this.checkOut.toISOString(),
      username: this.usernameControl.value,
      email: this.emailControl.value,
      phone: this.phoneControl.value,
      roomIds: this.roomIds,
      guests: this.guests
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => this.confirmationData = { message: 'Booking confirmed successfully!', type: 'success' },
      error: (err) => this.confirmationData = { message: 'Booking failed: ' + (err.error?.message || 'Unknown error'), type: 'error' }
    });
  }

  isFormValid(): boolean {
    return this.usernameControl.valid && this.emailControl.valid && this.phoneControl.valid;
  }

  onCancel() {
    this.bookingCancelled.emit();
  }

  closeConfirmation() {
    if (this.confirmationData?.type === 'success') {
      this.bookingCompleted.emit();
    }
    this.confirmationData = null;
  }
}
