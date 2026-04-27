import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface StatCard {
  icon: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

interface Booking {
  initials: string;
  color: string;
  guestName: string;
  hotel: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  amount: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admindashboard.html',
  styleUrls: ['./admindashboard.css']
})
export class DashboardComponent {

  statCards: StatCard[] = [
    { icon: 'building', label: 'TOTAL HOTELS',       value: '124',    change: '+4%',   positive: true },
    { icon: 'bed',      label: 'TOTAL ROOMS',        value: '3,842',  change: '+12%',  positive: true },
    { icon: 'calendar', label: 'TOTAL BOOKINGS',     value: '14,209', change: '+28%',  positive: true },
    { icon: 'check',    label: 'ACTIVE RESERVATIONS',value: '618',    change: 'Stable',positive: true },
  ];

  recentBookings: Booking[] = [
    { initials:'SC', color:'#4fb3a9', guestName:'Sarah Connor',  hotel:'Lumina Azure Resort',  checkIn:'Oct 12, 2023', checkOut:'Oct 15, 2023', status:'Confirmed', amount:'$1,240.00' },
    { initials:'MW', color:'#7b9ea8', guestName:'Marcus Wright', hotel:'The Serene Peak',       checkIn:'Oct 14, 2023', checkOut:'Oct 19, 2023', status:'Pending',   amount:'$2,100.00' },
    { initials:'KB', color:'#6c8ebf', guestName:'Kyle Butler',   hotel:'Urban Oasis Suites',   checkIn:'Oct 15, 2023', checkOut:'Oct 17, 2023', status:'Confirmed', amount:'$450.00'   },
    { initials:'DR', color:'#c9a96e', guestName:'Dani Ramos',    hotel:'Emerald Bay Villa',    checkIn:'Oct 16, 2023', checkOut:'Oct 22, 2023', status:'Cancelled', amount:'$3,200.00' },
    { initials:'JR', color:'#8fa89c', guestName:'John Reese',    hotel:'The Grand Serene',     checkIn:'Oct 18, 2023', checkOut:'Oct 20, 2023', status:'Confirmed', amount:'$890.00'   },
  ];

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}