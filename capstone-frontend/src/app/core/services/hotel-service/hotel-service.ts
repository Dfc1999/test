import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'http://localhost:3000/hotels';

  private filtersSource = new BehaviorSubject<any>(null);

  public filters$ = this.filtersSource.asObservable();

  updateFilters(filters: any) {
    this.filtersSource.next(filters);
  }

  clearFilters() {
    this.filtersSource.next(null);
  }
  
  constructor(private http: HttpClient) {}

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
  }

  getHotelRooms(hotelId: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/${hotelId}/rooms`);
  }

  searchRooms(filters: {
    persons: number,
    location?: string,
    maxPrice?: number,
    checkIn?: Date,
    checkOut?: Date
  }): Observable<any> {
    const params: any = {
      persons: filters.persons
    };
    if (filters.location) params.location = filters.location;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.checkIn) params.checkIn = filters.checkIn?.toISOString();
    if (filters.checkOut) params.checkOut = filters.checkOut?.toISOString();

    return this.http.get(`${this.apiUrl}/search/rooms`, { params });
  }
}

export interface Hotel {
  _id: string;
  name: string;
  location: {
    country: string;
    city: string;
    province: string;
  };
  starRating: number;
  description: string;
  images: { url: string }[];
  rooms?: Room[];
}

export interface Room {
  _id: string;
  type: string;
  beds: number;
  description: string;
  price: number;
  capacity: number;
  quantity?: number;
  available?: number;
  features?: string;
}
