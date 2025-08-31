import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/auth';
  private _username: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, user_password: password })
      .pipe(
        tap((res) => {
          if (res.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('username', username);
            this._username = username;
          }
        })
      );
  }

  logout() {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        this._username = null;
        this.router.navigate(['/login']);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getUsername(): string | null {
    if (!this._username) {
      this._username = localStorage.getItem('username');
    }
    return this._username;
  }

  checkSessions() {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/sessions`, { headers });
  }

  /** Verifica la sesión y fuerza logout si ya no está activa */
  verifyLogin() {
    this.checkSessions().subscribe({
      next: (res) => {
        if (!res.sessions || res.sessions.length === 0) {
          this.logout().subscribe();
        }
      },
      error: () => this.logout().subscribe()
    });
  }
}
