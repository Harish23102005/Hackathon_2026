import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoomAmenity } from '../../shared/models/room-amenity.model';

@Injectable({
  providedIn: 'root'
})
export class RoomAmenityService {

  private apiUrl = `${environment.apiUrl}/roomamenities`;

  constructor(private http: HttpClient) {}

 
  getAmenitiesByRoom(roomId: number): Observable<RoomAmenity[]> {
    return this.http.get<RoomAmenity[]>(`${this.apiUrl}/room/${roomId}`);
  }

  
  addRoomAmenity(data: RoomAmenity): Observable<RoomAmenity> {
    return this.http.post<RoomAmenity>(this.apiUrl, data);
  }


  deleteRoomAmenity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}