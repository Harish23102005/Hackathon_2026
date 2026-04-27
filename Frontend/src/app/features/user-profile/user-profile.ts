import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { getUserIdFromJwt, getNameFromJwt } from '../../core/utils/jwt.util';
import { Booking } from '../../shared/models/booking.model';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  // User Information
  userName = '';
  userId = 0;
  isLoading = true;
  error = '';

  // Bookings
  bookings: Booking[] = [];
  tabs: ('active' | 'history')[] = ['active', 'history'];
  activeTab: 'active' | 'history' = 'active';

  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.userId = getUserIdFromJwt(token);
      this.userName = getNameFromJwt(token);
    }

    if (!this.userId) {
      this.isLoading = false;
      return;
    }

    this.bookingService.getBookingsByUser(this.userId).pipe(
      tap(bookings => {
        this.bookings = bookings ?? [];
        this.isLoading = false;
      }),
      catchError(err => {
        this.error = `Could not load bookings (${err.status ?? 'network error'}).`;
        this.isLoading = false;
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  get totalBookings(): number { return this.bookings.length; }

  get totalSpent(): number {
    return this.bookings.reduce((s, b) => s + b.totalAmount, 0);
  }

  getActiveBookings(): Booking[] {
    return this.bookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending');
  }

  getCompletedBookings(): Booking[] {
    return this.bookings.filter(b => b.bookingStatus === 'Cancelled' || b.bookingStatus === 'Completed');
  }

  switchTab(tab: 'active' | 'history'): void {
    this.activeTab = tab;
  }

  cancelBooking(bookingId: number): void {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    this.bookingService.cancelBooking(bookingId).pipe(
      tap(() => {
        this.bookings = this.bookings.filter(b => b.bookingId !== bookingId);
      }),
      catchError(() => { alert('Failed to cancel booking.'); return EMPTY; }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Confirmed': return 'status-upcoming';
      case 'Pending':   return 'status-ongoing';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}
