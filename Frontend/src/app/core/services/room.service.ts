import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Room } from '../../shared/models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) {}

  getRoomsByHotel(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/hotel/${hotelId}`);
  }

 
  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  
  getAvailableRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/available`);
  }


  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  
  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.patch<Room>(`${this.apiUrl}/${id}`, room);
  }

  
  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
