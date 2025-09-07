import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonLogin } from './components/button-login/button-login';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login-service/login-service';
import { ButtonLogout } from './components/button-logout/button-logout';
import { ButtonBooking } from './components/button-booking/button-booking';
import { HotelService } from '../../services/hotel-service/hotel-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonLogin, ButtonLogout, ButtonBooking],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit {
  private destroy$ = new Subject<void>();

  constructor(public loginService: LoginService, public hotelService: HotelService) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}


