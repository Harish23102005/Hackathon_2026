import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, forkJoin, of, tap, timeout } from 'rxjs';
import { HotelService } from '../../../core/services/hotel.service';
import { BookingService } from '../../../core/services/booking.service';
import { RoomService } from '../../../core/services/room.service';
import { Booking } from '../../../shared/models/booking.model';

interface StatCard {
  icon: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admindashboard.html',
  styleUrls: ['./admindashboard.css']
})
export class DashboardComponent implements OnInit {

  statCards: StatCard[] = [
    { icon: 'building', label: 'TOTAL HOTELS',        value: '…', change: 'Loading…', positive: true },
    { icon: 'bed',      label: 'TOTAL ROOMS',         value: '…', change: 'Loading…', positive: true },
    { icon: 'calendar', label: 'TOTAL BOOKINGS',      value: '…', change: 'Loading…', positive: true },
    { icon: 'check',    label: 'ACTIVE RESERVATIONS', value: '…', change: 'Loading…', positive: true },
  ];

  recentBookings: Booking[] = [];
  isLoading = true;
  error = '';

  private hotelService = inject(HotelService);
  private bookingService = inject(BookingService);
  private roomService = inject(RoomService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isLoading = true;

    const hotels$ = this.hotelService.getHotels().pipe(
      timeout(8000),
      catchError(() => { this.statCards[0].value = 'N/A'; this.statCards[0].change = 'Error'; return of([]); })
    );

    const rooms$ = this.roomService.getAvailableRooms().pipe(
      timeout(8000),
      catchError(() => { this.statCards[1].value = 'N/A'; this.statCards[1].change = 'Error'; return of([]); })
    );

    const bookings$ = this.bookingService.getAllBookings().pipe(
      timeout(8000),
      catchError(() => {
        this.statCards[2].value = 'N/A'; this.statCards[2].change = 'Error';
        this.statCards[3].value = 'N/A'; this.statCards[3].change = 'Error';
        return of([] as Booking[]);
      })
    );

    forkJoin({ hotels: hotels$, rooms: rooms$, bookings: bookings$ }).pipe(
      tap(({ hotels, rooms, bookings }) => {
        if (hotels.length > 0 || this.statCards[0].value === '…') {
          this.statCards[0].value  = hotels.length.toString();
          this.statCards[0].change = 'Live data';
        }
        if (rooms.length > 0 || this.statCards[1].value === '…') {
          this.statCards[1].value  = rooms.length.toString();
          this.statCards[1].change = 'Live data';
        }
        if (this.statCards[2].value === '…') {
          this.statCards[2].value  = bookings.length.toString();
          this.statCards[2].change = 'Live data';
          const active = bookings.filter(b => b.bookingStatus === 'Confirmed').length;
          this.statCards[3].value  = active.toString();
          this.statCards[3].change = 'Live data';
        }
        this.recentBookings = bookings.slice(-5).reverse();
        this.isLoading = false;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({ error: () => { this.isLoading = false; } });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}