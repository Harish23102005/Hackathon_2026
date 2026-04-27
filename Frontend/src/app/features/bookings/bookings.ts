import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bookings',
  imports: [FormsModule,CommonModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings {
  // Guest Information
  firstName = '';
  lastName = '';
  email = '';
  countryCode = '+1';
  phoneNumber = '';
  selectedPaymentMethod = 'card';

  // Booking Details
  hotelName = 'Azure Bay Luxury Suites';
  hotelLocation = 'Santorini, Greece';
  hotelImage = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';
  hotelRating = 4.9;
  ratingCount = 124;

  checkInDate = 'Oct 24, 2024';
  checkOutDate = 'Oct 29, 2024';
  roomType = 'Deluxe Ocean View (5 nights)';
  roomPrice = 1250.0;
  serviceFee = 45.0;
  taxes = 117.5;
  totalPrice = 1407.5;

  paymentMethods = [
    { id: 'card', label: 'Card' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'wallet', label: 'E-Wallet' }
  ];

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  confirmBooking(): void {
    const bookingData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: `${this.countryCode} ${this.phoneNumber}`,
      paymentMethod: this.selectedPaymentMethod,
      totalPrice: this.totalPrice
    };
    console.log('Booking confirmed:', bookingData);
  }
}
