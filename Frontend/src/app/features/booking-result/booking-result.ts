import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-booking-result',
  imports: [CommonModule],
  templateUrl: './booking-result.html',
  styleUrl: './booking-result.css',
})
export class BookingResult {
  bookingId = 'BK-2024-7892156';
  bookingDate = 'April 27, 2024';
  status = 'Confirmed';

  guestName = 'John Doe';
  guestEmail = 'john.doe@example.com';
  guestPhone = '+1 555-0123';

  hotelName = 'Azure Bay Luxury Suites';
  hotelLocation = 'Santorini, Greece';
  hotelImage = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60';
  hotelRating = 4.9;

  checkInDate = 'October 24, 2024';
  checkOutDate = 'October 29, 2024';
  nights = 5;
  roomType = 'Deluxe Ocean View';
  roomImage = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';

  roomPrice = 1250.0;
  serviceFee = 45.0;
  taxes = 117.5;
  totalPrice = 1412.5;

  amenities = ['High-speed Wi-Fi', 'Ocean View', 'Private Balcony', 'Spa Access', 'Daily Housekeeping'];

  confirmationItems = [
    { icon: '📬', label: 'Confirmation email sent', desc: 'Check your inbox for booking details' },
    { icon: '🔑', label: 'Check-in available', desc: 'From 3:00 PM on Oct 24' },
    { icon: '✈️', label: 'Travel insurance', desc: 'Optional coverage available' }
  ];

  downloadConfirmation(): void {
    console.log('Downloading confirmation for booking:', this.bookingId);
  }

  viewItinerary(): void {
    console.log('Viewing itinerary for booking:', this.bookingId);
  }

  returnHome(): void {
    console.log('Returning home');
  }
}
