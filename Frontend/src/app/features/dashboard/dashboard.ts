import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HotelService } from '../../core/services/hotel.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { Hotel } from '../../shared/models/hotel.model';
import { getNameFromJwt } from '../../core/utils/jwt.util';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  hotels: Hotel[] = [];
  totalHotels = 0;
  totalBookings = 0;
  isLoading = true;

  // Search
  searchLocation = '';
  checkIn = '';
  checkOut = '';

  // Auth state for nav
  isLoggedIn = false;
  userName = '';

  constructor(
    private hotelService: HotelService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check login state
    this.isLoggedIn = this.authService.isLoggedIn();
    const token = this.authService.getToken();
    if (token) {
      this.userName = getNameFromJwt(token);
    }

    // Load hotels
    this.hotelService.getHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels.slice(0, 3);
        this.totalHotels = hotels.length;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });

    // Load booking count (only Admins can see all bookings)
    if (this.isLoggedIn && this.authService.isAdmin()) {
      this.bookingService.getAllBookings().subscribe({
        next: (bookings) => { this.totalBookings = bookings.length; },
        error: () => {}
      });
    }
  }

  searchHotels(): void {
    this.router.navigate(['/hotels'], {
      queryParams: this.searchLocation ? { location: this.searchLocation } : {}
    });
  }

  goToRooms(hotelId: number): void {
    this.router.navigate(['/rooms'], { queryParams: { hotelId } });
  }
}
