import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { HotelService } from '../../core/services/hotel.service';
import { RoomService } from '../../core/services/room.service';
import { getUserIdFromJwt } from '../../core/utils/jwt.util';
import { Booking } from '../../shared/models/booking.model';
import { Hotel } from '../../shared/models/hotel.model';
import { Room } from '../../shared/models/room.model';

@Component({
  selector: 'app-bookings',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings implements OnInit {
  // Guest Information
  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  selectedPaymentMethod = 'card';

  // Data from API
  room: Room | null = null;
  hotel: Hotel | null = null;
  checkInDate = '';
  checkOutDate = '';
  isLoading = true;
  isSubmitting = false;
  error = '';

  roomId = 0;
  userId = 0;

  paymentMethods = [
    { id: 'card', label: 'Card' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'wallet', label: 'E-Wallet' }
  ];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private roomService = inject(RoomService);
  private hotelService = inject(HotelService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.userId = getUserIdFromJwt(token);
    }

    this.route.queryParams.pipe(
      switchMap(params => {
        this.roomId = +params['roomId'] || 0;
        const hotelId = +params['hotelId'] || 0;
        this.isLoading = true;
        this.error = '';

        if (!this.roomId) {
          this.error = 'No room selected.';
          this.isLoading = false;
          return EMPTY;
        }

        return forkJoin({
          room: this.roomService.getRoomById(this.roomId),
          ...(hotelId ? { hotel: this.hotelService.getHotelById(hotelId) } : {})
        });
      }),
      catchError(err => {
        this.error = `Failed to load booking details (${err.status ?? 'network error'}).`;
        this.isLoading = false;
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((result: any) => {
      this.room = result.room ?? null;
      this.hotel = result.hotel ?? null;
      this.isLoading = false;
    });
  }

  get totalNights(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0;
    const diff = new Date(this.checkOutDate).getTime() - new Date(this.checkInDate).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  get totalPrice(): number {
    return this.totalNights * (this.room?.pricePerNight ?? 0);
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  confirmBooking(): void {
    if (!this.checkInDate || !this.checkOutDate) {
      this.error = 'Please select check-in and check-out dates.';
      return;
    }
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    const booking: Booking = {
      bookingId: 0,
      userId: this.userId,
      roomId: this.roomId,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      totalAmount: this.totalPrice,
      bookingStatus: 'Confirmed',
      bookingDate: new Date().toISOString()
    };

    this.bookingService.createBooking(booking).pipe(
      catchError(err => {
        this.isSubmitting = false;
        this.error = err.error?.message ?? err.error ?? 'Booking failed. Please try again.';
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.isSubmitting = false;
      this.router.navigate(['/booking-result'], {
        queryParams: { bookingId: result.bookingId }
      });
    });
  }
}
