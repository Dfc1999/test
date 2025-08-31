import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService, Room } from '../../core/services/hotel-service/hotel-service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { Header } from '../home-page/components/header/header';
import { Footer } from '../home-page/components/footer/footer';
import { PricePipe } from '../../shared/pipes/price-pipe-pipe';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe-pipe';
import { FallbackPipe } from '../../shared/pipes/fallback-pipe-pipe';
import { BookingFormComponent } from './booking-form-component/booking-form-component';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatCardModule,
    Header,
    Footer,
    PricePipe,
    CapitalizePipe,
    FallbackPipe,
    BookingFormComponent
  ],
  templateUrl: './hotel-detail-page.html',
  styleUrls: ['./hotel-detail-page.scss'],
})
export class HotelDetailPage implements OnInit, OnDestroy {
  hotel: any = null;
  rooms: Room[] = [];
  checkIn: Date | null = null;
  checkOut: Date | null = null;
  roomSelections: { [roomId: string]: number } = {};

  currentSlide = 0;
  autoSlideInterval: any;

  showBookingForm = false;


  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hotelService.getHotelById(id).subscribe({
        next: (hotel) => {
          this.hotel = hotel;
          this.loadRooms(id);
        },
        error: (err) => console.error('Error loading hotel', err)
      });
    }

    this.autoSlideInterval = setInterval(() => this.nextSlide(), 4000);
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
  }

  loadRooms(hotelId: string) {
    this.hotelService.getHotelRooms(hotelId).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.roomSelections = rooms.reduce((acc, room) => ({ ...acc, [room._id!]: 0 }), {});
      },
      error: (err) => console.error('Error loading rooms', err),
    });
  }

  getRoomQuantity(roomId: string): number {
    return this.roomSelections[roomId] || 0;
  }

  incrementRoom(roomId: string) {
    if (this.roomSelections[roomId] < 10) {
      this.roomSelections[roomId]++;
    }
  }

  decrementRoom(roomId: string) {
    if (this.roomSelections[roomId] > 0) {
      this.roomSelections[roomId]--;
    }
  }

  isAnyRoomSelected(): boolean {
    return Object.values(this.roomSelections).some(quantity => quantity > 0);
  }

  nextSlide() {
    if (this.hotel?.images?.length)
      this.currentSlide = (this.currentSlide + 1) % this.hotel.images.length;
  }

  prevSlide() {
    if (this.hotel?.images?.length)
      this.currentSlide =
        (this.currentSlide - 1 + this.hotel.images.length) % this.hotel.images.length;
  }

  openBookingForm() {
    this.showBookingForm = true;
  }

  onBookingCompleted() {
    this.showBookingForm = false;
    this.roomSelections = this.rooms.reduce((acc, room) => ({ ...acc, [room._id!]: 0 }), {});
  }

  onBookingCancelled() {
    this.showBookingForm = false;
  }
}
