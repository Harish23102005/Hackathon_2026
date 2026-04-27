import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Hotels } from './features/hotels/hotels';
import { Rooms } from './features/rooms/rooms';
import { Bookings } from './features/bookings/bookings';
import { BookingResult } from './features/booking-result/booking-result';
import { UserProfile } from './features/user-profile/user-profile';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { DashboardComponent } from './features/admin/admindashboard/admindashboard';
import { ManageHotelsComponent } from './features/admin/manage-hotels/manage-hotels';
import { ManageRoomsComponent } from './features/admin/manage-rooms/manage-rooms';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'hotels', component: Hotels },
  { path: 'rooms', component: Rooms },
  { path: 'bookings', component: Bookings, canActivate: [authGuard] },
  { path: 'booking-result', component: BookingResult, canActivate: [authGuard] },
  { path: 'user-profile', component: UserProfile, canActivate: [authGuard] },
  { path: 'admin', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/hotels', component: ManageHotelsComponent, canActivate: [adminGuard] },
  { path: 'admin/rooms', component: ManageRoomsComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
