import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, user_password: password })
      .pipe(
        tap((res) => {
          if (res.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('username', username);
          }
        })
      );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        this.router.navigate(['/login']);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  refreshToken() {
    return this.http.post(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true });
  }
}
