import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-rooms',
  imports: [CommonModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms {
  hotelName = 'Azure Horizon Resort & Spa';
  hotelLocation = 'Maldives, North Male Atoll';
  hotelDescription = 'A sanctuary of sophisticated minimalism perched above turquoise waters, offering unparalleled tranquility and curated luxury.';
  hotelRating = 4.9;
  verifiedReviews = 2482;

  checkInDate = 'Oct 12';
  checkOutDate = 'Oct 18';
  guests = '2 Adults, 1 Room';

  rooms = [
    {
      id: 1,
      name: 'Deluxe King Ocean View',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      area: 45,
      bedType: 'King Bed',
      amenities: ['AC', 'Smart TV', 'Minibar', 'High-speed Wi-Fi'],
      availability: 'Available Now',
      availabilityClass: 'available',
      price: 450,
      originalPrice: null
    },
    {
      id: 2,
      name: 'Executive Panorama Suite',
      image: 'https://images.unsplash.com/photo-1578926078328-123b78f15f13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      area: 68,
      bedType: 'King Bed + Lounge',
      amenities: ['Premium Bar', 'Spa Bath', 'Nespresso', 'Climate Control'],
      availability: 'Only 2 Left',
      availabilityClass: 'limited',
      price: 890,
      originalPrice: null
    },
    {
      id: 3,
      name: 'Azure Presidential Villa',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      area: 220,
      bedType: 'Multiple Bedrooms',
      amenities: ['Private Butler', 'In-Villa Dining', 'Home Cinema'],
      availability: 'Available Now',
      availabilityClass: 'available',
      price: 1450,
      originalPrice: null
    }
  ];
}
