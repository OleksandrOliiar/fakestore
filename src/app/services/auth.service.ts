import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) { }

  register(userData: { username: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }
} 