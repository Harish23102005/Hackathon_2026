import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../shared/models/booking.model';

@Component({
  selector: 'app-booking-result',
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-result.html',
  styleUrl: './booking-result.css',
})
export class BookingResult implements OnInit {
  booking: Booking | null = null;
  isLoading = true;
  error = '';

  confirmationItems = [
    { icon: '📬', label: 'Confirmation email sent', desc: 'Check your inbox for booking details' },
    { icon: '🔑', label: 'Check-in available', desc: 'From 3:00 PM on your check-in date' },
    { icon: '✈️', label: 'Travel insurance', desc: 'Optional coverage available' }
  ];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        const bookingId = +params['bookingId'] || 0;
        this.isLoading = true;
        this.error = '';

        if (!bookingId) {
          this.error = 'No booking ID provided.';
          this.isLoading = false;
          return EMPTY;
        }

        return this.bookingService.getBookingById(bookingId);
      }),
      catchError(() => {
        this.error = 'Could not load booking details.';
        this.isLoading = false;
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(booking => {
      this.booking = booking;
      this.isLoading = false;
    });
  }

  get nights(): number {
    if (!this.booking) return 0;
    const diff = new Date(this.booking.checkOutDate).getTime() - new Date(this.booking.checkInDate).getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  returnHome(): void {
    this.router.navigate(['/']);
  }

  goToProfile(): void {
    this.router.navigate(['/user-profile']);
  }
}
