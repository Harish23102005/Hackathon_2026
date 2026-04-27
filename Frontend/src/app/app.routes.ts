import { Routes } from '@angular/router';
import { DashboardComponent } from './feature/admin/admindashboard/admindashboard';
import { ManageHotelsComponent } from './feature/admin/manage-hotels/manage-hotels';
import { ManageRoomsComponent } from './feature/admin/manage-rooms/manage-rooms';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/hotels', component: ManageHotelsComponent },
  { path: 'admin/rooms', component: ManageRoomsComponent },
];
