import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user/register';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
}

export interface User {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password?: string;
}