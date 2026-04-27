import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Booking } from '../../shared/models/booking.model';

/** Normalise raw API booking object (handles both camelCase and PascalCase) */
function normalizeBooking(b: any): Booking {
  return {
    bookingId:     b.bookingId     ?? b.BookingId     ?? 0,
    userId:        b.userId        ?? b.UserId        ?? 0,
    roomId:        b.roomId        ?? b.RoomId        ?? 0,
    checkInDate:   b.checkInDate   ?? b.CheckInDate   ?? '',
    checkOutDate:  b.checkOutDate  ?? b.CheckOutDate  ?? '',
    totalAmount:   b.totalAmount   ?? b.TotalAmount   ?? 0,
    bookingStatus: b.bookingStatus ?? b.BookingStatus ?? '',
    bookingDate:   b.bookingDate   ?? b.BookingDate   ?? '',
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = `${environment.apiUrl}/booking`;

  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<any>(this.apiUrl, booking).pipe(
      map(normalizeBooking),
      catchError(err => throwError(() => err))
    );
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(normalizeBooking),
      catchError(err => throwError(() => err))
    );
  }

  getBookingsByUser(userId: number): Observable<Booking[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(bookings => (bookings ?? []).map(normalizeBooking)),
      catchError(err => throwError(() => err))
    );
  }

  cancelBooking(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(bookings => (bookings ?? []).map(normalizeBooking)),
      catchError(err => throwError(() => err))
    );
  }
}