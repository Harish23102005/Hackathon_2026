import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Hotel } from '../../shared/models/hotel.model';

/** Normalise raw API hotel object (handles both camelCase and PascalCase) */
function normalizeHotel(h: any): Hotel {
  return {
    hotelId:     h.hotelId     ?? h.HotelId     ?? 0,
    hotelName:   h.hotelName   ?? h.HotelName   ?? '',
    location:    h.location    ?? h.Location    ?? '',
    address:     h.address     ?? h.Address     ?? '',
    description: h.description ?? h.Description ?? '',
    rating:      h.rating      ?? h.Rating      ?? 0,
  };
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private apiUrl = `${environment.apiUrl}/hotel`;

  constructor(private http: HttpClient) {}

  getHotels(): Observable<Hotel[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(hotels => (hotels ?? []).map(normalizeHotel)),
      catchError(err => throwError(() => err))
    );
  }

  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(normalizeHotel),
      catchError(err => throwError(() => err))
    );
  }

  // No backend search endpoint — use getHotels() + client-side filter
  searchByLocation(_location: string): Observable<Hotel[]> {
    return this.getHotels();
  }

  addHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.post<any>(this.apiUrl, hotel).pipe(
      map(normalizeHotel),
      catchError(err => throwError(() => err))
    );
  }

  updateHotel(id: number, hotel: Hotel): Observable<Hotel> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, hotel).pipe(
      map(normalizeHotel),
      catchError(err => throwError(() => err))
    );
  }

  deleteHotel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
