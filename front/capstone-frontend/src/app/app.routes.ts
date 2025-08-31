import { Routes } from '@angular/router';
import { HomePage } from './features/home-page/home-page';
import { LoginComponent } from './core/pages/login/login';
import { HotelDetailPage } from './features/hotel-detail-page/hotel-detail-page';
import { NotFound } from './features/not-found/not-found';
import { BookingPage } from './features/booking-page/booking-page';


export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'home', component: HomePage },
  { path: 'login', component: LoginComponent },
  { path: 'hotel/:id', component: HotelDetailPage },
  { path: 'bookings', component: BookingPage },
  { path: '**', component: NotFound }
];
