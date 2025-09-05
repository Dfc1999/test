import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/bookings';

  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  cancelBooking(id: string): Observable<Booking> {
    return this.http.delete<Booking>(`${this.apiUrl}/${id}`);
  }
}

export interface Booking {
  _id?: string;
  hotelId: string;
  username: string;
  phone: string;
  email: string;
  rooms: { roomId: string; quantity: number }[];
  checkInDate: string | Date;
  checkOutDate: string | Date;
  guests?: number;
  status?: string;
  totalPrice?: number;
}