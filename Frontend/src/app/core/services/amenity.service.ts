import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Amenity } from '../../shared/models/amenity.model';

@Injectable({
  providedIn: 'root'
})
export class AmenityService {

  private apiUrl = `${environment.apiUrl}/amenities`;

  constructor(private http: HttpClient) {}

 
  getAmenities(): Observable<Amenity[]> {
    return this.http.get<Amenity[]>(this.apiUrl);
  }

  getAmenityById(id: number): Observable<Amenity> {
    return this.http.get<Amenity>(`${this.apiUrl}/${id}`);
  }

  
  addAmenity(amenity: Amenity): Observable<Amenity> {
    return this.http.post<Amenity>(this.apiUrl, amenity);
  }


  updateAmenity(id: number, amenity: Amenity): Observable<Amenity> {
    return this.http.patch<Amenity>(`${this.apiUrl}/${id}`, amenity);
  }


  deleteAmenity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}