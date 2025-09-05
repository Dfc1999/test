import { Component, OnDestroy, OnInit } from '@angular/core';
import { HotelService, Hotel } from '../../core/services/hotel-service/hotel-service';
import { CommonModule } from '@angular/common';
import { HotelCard } from '../card-hotel/card-hotel';
import { HttpClientModule } from '@angular/common/http';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [HotelCard, CommonModule, HttpClientModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
  standalone: true
})
export class HomePage implements OnInit, OnDestroy {
  hotels: any[] = [];
  errorMessage = '';

  private destroy$ = new Subject<void>();

  filters: any = {};

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.hotelService.filters$
      .pipe(takeUntil(this.destroy$)) 
      .subscribe(filters => {
        if (filters) {
          this.searchWithFilters(filters);
        } else {
          this.loadHotels();
        }
      });
  }

  private transformHotelData(hotel: any): any {
    const isSearchResult = !!hotel.hotelId;

    return {
      id: isSearchResult ? hotel.hotelId : hotel._id,
      name: isSearchResult ? hotel.hotelName : hotel.name,
      location: isSearchResult
        ? `${hotel.hotelLocation.city}, ${hotel.hotelLocation.province}, ${hotel.hotelLocation.country}`
        : `${hotel.location.city}, ${hotel.location.province}, ${hotel.location.country}`,
      imageUrl: hotel.images?.length > 0 ? hotel.images[0].url : 'default.jpg',
      rating: hotel.starRating || 0,
    };
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe({
      next: (data: Hotel[]) => {
        this.hotels = data.map(hotel => this.transformHotelData(hotel));
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error al cargar los hoteles. Intente nuevamente.';
        this.hotels = [];
      }
    });
  }

  searchWithFilters(filters: any) {
    if (!filters.guests || filters.guests <= 0) {
      this.errorMessage = 'Número de personas inválido';
      this.hotels = []; 
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
        if (results.length === 0) {
          this.errorMessage = 'No se encontraron habitaciones con los filtros aplicados';
          this.hotels = [];
          return;
        }
        this.hotels = results.map(hotel => this.transformHotelData(hotel));
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error al buscar. Intente nuevamente.';
        this.hotels = [];
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

