import { Component, OnInit } from '@angular/core';
import { HotelService, Hotel } from '../../core/services/hotel-service/hotel-service';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { HotelCard } from '../card-hotel/card-hotel';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  imports: [Header, Footer, HotelCard, CommonModule, HttpClientModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
  standalone: true
})
export class HomePage implements OnInit {
  hotels: any[] = [];
  errorMessage = '';

  filters: any = {};

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe({
      next: (data: Hotel[]) => {
        this.hotels = data.map(hotel => ({
          id: hotel._id,
          name: hotel.name,
          location: `${hotel.location.city}, ${hotel.location.province}, ${hotel.location.country}`,
          imageUrl: hotel.images.length > 0 ? hotel.images[0].url : 'default.jpg',
          rating: hotel.starRating
        }));
      },
      error: () => {
        this.errorMessage = 'Error al cargar los hoteles. Intente nuevamente.';
      }
    });
  }

  onFiltersChanged(filters: any) {
    this.filters = filters;

    if (!filters.guests || filters.guests <= 0) {
      this.errorMessage = 'Número de personas inválido';
      return;
    }

    this.hotelService.searchRooms({
      persons: filters.guests,
      location: filters.location,
      maxPrice: filters.priceRange,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut
    }).subscribe({
      next: (results: any[]) => {
        this.errorMessage = '';
        this.hotels = results.map(hotel => ({
          id: hotel.hotelId,
          name: hotel.hotelName,
          location: `${hotel.hotelLocation.city}, ${hotel.hotelLocation.province}, ${hotel.hotelLocation.country}`,
          imageUrl: hotel.images?.[0]?.url || 'default.jpg',
          rating: hotel.starRating || 0
        }));
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'No se encontraron habitaciones con los filtros aplicados';
        this.hotels = [];
      }
    });
  }
}

