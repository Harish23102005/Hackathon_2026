import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Room } from '../../shared/models/room.model';

/** Normalise a raw API room object (handles both camelCase and PascalCase) */
function normalizeRoom(r: any): Room {
  return {
    roomId:        r.roomId        ?? r.RoomId        ?? 0,
    hotelId:       r.hotelId       ?? r.HotelId       ?? 0,
    categoryId:    r.categoryId    ?? r.CategoryId    ?? 0,
    roomNumber:    r.roomNumber    ?? r.RoomNumber    ?? 0,
    pricePerNight: r.pricePerNight ?? r.PricePerNight ?? 0,
    capacity:      r.capacity      ?? r.Capacity      ?? 0,
  };
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = `${environment.apiUrl}/room`;

  constructor(private http: HttpClient) {}

  getRoomsByHotel(hotelId: number): Observable<Room[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hotel/${hotelId}`).pipe(
      map(rooms => (rooms ?? []).map(normalizeRoom)),
      catchError(err => throwError(() => err))
    );
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(normalizeRoom),
      catchError(err => throwError(() => err))
    );
  }

  getAvailableRooms(): Observable<Room[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(rooms => (rooms ?? []).map(normalizeRoom)),
      catchError(err => throwError(() => err))
    );
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<any>(this.apiUrl, room).pipe(
      map(normalizeRoom),
      catchError(err => throwError(() => err))
    );
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, room).pipe(
      map(normalizeRoom),
      catchError(err => throwError(() => err))
    );
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
