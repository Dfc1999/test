import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchBox } from './components/search-box/search-box';
import { ButtonLogin } from './components/button-login/button-login';
import { Filter } from '../../../filter/filter';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../../core/services/login-service/login-service';
import { ButtonLogout } from './components/button-logout/button-logout';
import { ButtonBooking } from './components/button-booking/button-booking';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBox, ButtonLogin, Filter, ButtonLogout, ButtonBooking],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit {
  showFilters = false;
  filters: any = {};

  constructor(public loginService: LoginService) {}

  ngOnInit() {
    if (this.loginService.isLoggedIn()) {
      this.loginService.verifyLogin();
    }
  }

  @Output() filtersChange = new EventEmitter<any>();

  onFiltersChanged(filters: any) {
    this.filters = filters;
    this.filtersChange.emit(filters);
  }

}


