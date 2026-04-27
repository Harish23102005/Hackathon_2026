import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Booking {
  id: string;
  hotelName: string;
  location: string;
  image: string;
  rating: number;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  roomType: string;
  totalPrice: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  bookingConfirmationId: string;
}

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  // User Information
  userName = 'John Doe';
  userEmail = 'john.doe@example.com';
  userPhone = '+1 555-0123';
  userAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=John';
  memberSince = 'January 2023';
  totalBookings = 8;
  totalSpent = 12450.75;

  // Bookings
  bookings: Booking[] = [
    {
      id: '1',
      hotelName: 'Azure Bay Luxury Suites',
      location: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      rating: 4.9,
      checkInDate: 'October 24, 2024',
      checkOutDate: 'October 29, 2024',
      nights: 5,
      roomType: 'Deluxe Ocean View',
      totalPrice: 1412.50,
      status: 'upcoming',
      bookingConfirmationId: 'BK-2024-7892156'
    },
    {
      id: '2',
      hotelName: 'Forest Whisper Lodge',
      location: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      rating: 4.8,
      checkInDate: 'September 10, 2024',
      checkOutDate: 'September 17, 2024',
      nights: 7,
      roomType: 'Eco-Luxury Villa',
      totalPrice: 2145.00,
      status: 'completed',
      bookingConfirmationId: 'BK-2024-6524891'
    },
    {
      id: '3',
      hotelName: 'The Azure Retreat',
      location: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      rating: 4.7,
      checkInDate: 'August 1, 2024',
      checkOutDate: 'August 8, 2024',
      nights: 7,
      roomType: 'Premium Suite',
      totalPrice: 1890.25,
      status: 'completed',
      bookingConfirmationId: 'BK-2024-5432167'
    },
    {
      id: '4',
      hotelName: 'Chateau Belle-Vue',
      location: 'Provence, France',
      image: 'https://images.unsplash.com/photo-1502472099602-708ce21667a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      rating: 5.0,
      checkInDate: 'July 15, 2024',
      checkOutDate: 'July 22, 2024',
      nights: 7,
      roomType: 'Presidential Suite',
      totalPrice: 3200.00,
      status: 'completed',
      bookingConfirmationId: 'BK-2024-4321098'
    }
  ];

  tabs: ('active' | 'history')[] = ['active', 'history'];
  activeTab: 'active' | 'history' = 'active';

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'upcoming':
        return 'status-upcoming';
      case 'ongoing':
        return 'status-ongoing';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }

  getActiveBookings(): Booking[] {
    return this.bookings.filter(b => b.status === 'upcoming' || b.status === 'ongoing');
  }

  getCompletedBookings(): Booking[] {
    return this.bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');
  }

  switchTab(tab: 'active' | 'history'): void {
    this.activeTab = tab;
  }

  cancelBooking(bookingId: string): void {
    console.log('Cancelling booking:', bookingId);
  }

  modifyBooking(bookingId: string): void {
    console.log('Modifying booking:', bookingId);
  }

  downloadReceipt(bookingId: string): void {
    console.log('Downloading receipt for booking:', bookingId);
  }
}
