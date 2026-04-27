import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  name = '';
  email = '';
  password = '';
  phoneNumber = '';
  role = 'Customer';
  isLoading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    this.isLoading = true;
    this.error = '';
    this.success = '';

    const user: User = {
      userId: 0,
      name: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      role: this.role
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error || 'Registration failed. Please try again.';
      }
    });
  }
}
