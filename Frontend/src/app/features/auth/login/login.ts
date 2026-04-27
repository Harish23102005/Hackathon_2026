import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';
import { getRoleFromJwt } from '../../../core/utils/jwt.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  isLoading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.isLoading = true;
    this.error = '';

    const payload: LoginRequest = { email: this.email, password: this.password };

    this.authService.login(payload).subscribe({
      next: () => {
        this.isLoading = false;
        // Redirect based on role from JWT
        const token = this.authService.getToken();
        const role = token ? getRoleFromJwt(token) : '';
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.status === 401
          ? 'Invalid email or password.'
          : `Login failed (${err.status}). Make sure the backend is running.`;
      }
    });
  }
}
