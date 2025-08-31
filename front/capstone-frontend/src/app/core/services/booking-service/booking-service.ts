import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/bookings';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking, { headers: this.getAuthHeaders() });
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  cancelBooking(id: string): Observable<Booking> {
    return this.http.delete<Booking>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}

export interface Booking {
  _id?: string;
  hotelId: string; // Nuevo campo requerido por el backend
  username: string;
  phone: string;
  email: string;
  rooms: { roomId: string; quantity: number }[]; // Actualización importante
  checkInDate: string | Date;
  checkOutDate: string | Date;
  guests?: number; // El backend lo calcula, ya no es un campo de entrada
  status?: string;
  totalPrice?: number;
}