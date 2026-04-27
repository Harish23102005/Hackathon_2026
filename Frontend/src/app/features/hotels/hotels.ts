import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotels',
  imports: [FormsModule,CommonModule],
  templateUrl: './hotels.html',
  styleUrl: './hotels.css',
})
export class Hotels {
  currentView: 'grid' | 'map' = 'grid';
  currentPage = 1;
  priceRange = [0, 1000];
  selectedAmenities = new Set<string>();

  properties = [
    {
      id: 1,
      name: 'Azure Horizon Suites',
      location: 'Oia, Santorini',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      rating: 4.9,
      price: 420,
      originalPrice: 500,
      discount: null,
      amenities: ['WiFi', 'Pool', 'Gym'],
      isFavorite: false
    },
    {
      id: 2,
      name: 'Caldera Echo Retreat',
      location: 'Imerovigli, Santorini',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      rating: 4.7,
      price: 315,
      originalPrice: 350,
      discount: null,
      amenities: ['WiFi', 'Spa', 'Dining'],
      isFavorite: false
    },
    {
      id: 3,
      name: 'Villas of Thira',
      location: 'Fira, Santorini',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      rating: 4.8,
      price: 280,
      originalPrice: 350,
      discount: '15% OFF',
      amenities: ['WiFi', 'A/C', 'Parking'],
      isFavorite: false
    },
    {
      id: 4,
      name: 'Infinity Blue Resort',
      location: 'Akrotiri, Santorini',
      image: 'https://images.unsplash.com/photo-1455263511159-7bccfb0055e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      rating: 4.6,
      price: 385,
      originalPrice: 420,
      discount: null,
      amenities: ['Pool', 'Private', 'Gym'],
      isFavorite: false
    }
  ];

  amenitiesList = ['Free Wi-Fi', 'Swimming Pool', 'Fitness Center', 'Spa & Wellness', 'Restaurant'];

  toggleAmenity(amenity: string): void {
    if (this.selectedAmenities.has(amenity)) {
      this.selectedAmenities.delete(amenity);
    } else {
      this.selectedAmenities.add(amenity);
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities.has(amenity);
  }

  toggleFavorite(property: any): void {
    property.isFavorite = !property.isFavorite;
  }

  switchView(view: 'grid' | 'map'): void {
    this.currentView = view;
  }

  applyFilters(): void {
    console.log('Filters applied', {
      priceRange: this.priceRange,
      amenities: Array.from(this.selectedAmenities)
    });
  }

  resetFilters(): void {
    this.priceRange = [0, 1000];
    this.selectedAmenities.clear();
  }
}
