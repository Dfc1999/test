import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService, Booking } from '../../core/services/booking-service/booking-service';
import { Header } from '../home-page/components/header/header';
import { Footer } from '../home-page/components/footer/footer';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatSnackBarModule, Header, Footer],
  templateUrl: './booking-page.html',
  styleUrls: ['./booking-page.scss']
})
export class BookingPage implements OnInit {
  bookings: Booking[] = [];
  loading = true;

  showAlert = false;
  alertMessage = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getBookings().subscribe({
      next: (res) => {
        this.bookings = res;
        this.loading = false;
      },
      error: (err) => {
        this.showAlertMessage(err.error?.message || 'Error loading bookings');
        this.loading = false;
      }
    });
  }

  attemptCancelBooking(id: string | undefined) {
    if (!id) return;

    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.map(b =>
          b._id === id ? { ...b, status: 'cancelled' } : b
        );
        this.showAlertMessage('Booking cancelled successfully');
      },
      error: (err) => {
        this.showAlertMessage(err.error?.message || 'Error cancelling booking');
      }
    });
  }

  showAlertMessage(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
  }

  closeAlert() {
    this.showAlert = false;
    this.alertMessage = '';
  }
}

