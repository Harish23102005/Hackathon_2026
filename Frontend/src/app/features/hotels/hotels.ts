import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { Hotel } from '../../shared/models/hotel.model';

@Component({
  selector: 'app-hotels',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './hotels.html',
  styleUrl: './hotels.css',
})
export class Hotels implements OnInit {
  currentView: 'grid' | 'map' = 'grid';
  searchLocation = '';
  isLoading = false;
  error = '';
  properties: Hotel[] = [];
  filteredProperties: Hotel[] = [];

  amenitiesList = ['Free Wi-Fi', 'Swimming Pool', 'Fitness Center', 'Spa & Wellness', 'Restaurant'];

  private hotelService = inject(HotelService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const loc = this.route.snapshot.queryParams['location'];
    if (loc) { this.searchLocation = loc; }
    this.loadHotels();
  }

  loadHotels(): void {
    this.isLoading = true;
    this.error = '';

    this.hotelService.getHotels().pipe(
      tap(hotels => {
        this.properties = hotels ?? [];
        this.filteredProperties = hotels ?? [];
        if (this.searchLocation.trim()) {
          this.applyFilter();
        }
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('Hotel fetch error:', err);
        this.error = `Failed to load hotels (${err.status ?? 'Network error'}). Is the backend running on port 5013?`;
        this.filteredProperties = [];
        this.isLoading = false;
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  applyFilter(): void {
    if (!this.searchLocation.trim()) {
      this.filteredProperties = this.properties;
      return;
    }
    const q = this.searchLocation.toLowerCase();
    this.filteredProperties = this.properties.filter(h =>
      h.location.toLowerCase().includes(q) ||
      h.hotelName.toLowerCase().includes(q) ||
      h.address?.toLowerCase().includes(q)
    );
  }

  searchHotels(): void {
    this.applyFilter();
  }

  viewRooms(hotel: Hotel): void {
    this.router.navigate(['/rooms'], { queryParams: { hotelId: hotel.hotelId } });
  }

  switchView(view: 'grid' | 'map'): void {
    this.currentView = view;
  }

  resetFilters(): void {
    this.searchLocation = '';
    this.filteredProperties = this.properties;
  }
}
