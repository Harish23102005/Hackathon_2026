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
          // Decode JWT payload to extract role and user id
          try {
            const payload = JSON.parse(atob(res.token.split('.')[1]));
            // .NET uses the full ClaimTypes.Role URI or the short name depending on version
            const role =
              payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
              payload['role'] ||
              payload['Role'] ||
              '';
            const id = payload['id'] || payload['nameid'] || '';
            localStorage.setItem('userRole', role);
            localStorage.setItem('userId', id.toString());
          } catch {
            // If decode fails we just won't have cached role
          }
        })
      );
  }

  
  register(user: User): Observable<User> {
  return this.http.post<User>(`${this.apiUrl}/register`, user);
}

  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }

 
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') ?? '';
  }

  getUserId(): number {
    return parseInt(localStorage.getItem('userId') ?? '0', 10);
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }
}
