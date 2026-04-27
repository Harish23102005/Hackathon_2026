import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Hotels } from './features/hotels/hotels';
import { Rooms } from './features/rooms/rooms';
import { Bookings } from './features/bookings/bookings';
import { BookingResult } from './features/booking-result/booking-result';
import { UserProfile } from './features/user-profile/user-profile';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard
  },
  {
    path: 'hotels',
    component: Hotels
  },
  {
    path: 'rooms',
    component: Rooms
  },{
    path: 'bookings',
    component: Bookings
  },
  {
    path: 'booking-result',
    component: BookingResult
  },
  {
    path: 'user-profile',
    component: UserProfile
  }
];
