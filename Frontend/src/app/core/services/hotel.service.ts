import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hotel } from '../../shared/models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private apiUrl = `${environment.apiUrl}/hotels`;

  constructor(private http: HttpClient) {}

  
  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }


  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
  }


  searchByLocation(location: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/search`, {
      params: { location }
    });
  }

  
  addHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.post<Hotel>(this.apiUrl, hotel);
  }


  updateHotel(id: number, hotel: Hotel): Observable<Hotel> {
    return this.http.patch<Hotel>(`${this.apiUrl}/${id}`, hotel);
  }


  deleteHotel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
