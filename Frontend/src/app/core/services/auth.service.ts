import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  
  register(user: User): Observable<User> {
  return this.http.post<User>(`${this.apiUrl}/register`, user);
}

  
  logout() {
    localStorage.removeItem('token');
  
  }

 
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
