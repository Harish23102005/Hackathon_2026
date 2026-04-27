import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Hotel {
  id: string;
  image: string;
  name: string;
  location: string;
  rating: number;
  totalRooms: number;
}

@Component({
  selector: 'app-manage-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-hotels.html',
  styleUrls: ['./manage-hotels.css']
})
export class ManageHotelsComponent {

  summaryStats = [
    { label: 'Total Hotels',   value: '24',    note: '+2 this mo.' },
    { label: 'Avg. Occupancy', value: '88%',   note: 'trending up' },
    { label: 'Avg. Rating',    value: '4.9/5.0', note: '★' },
    { label: 'Total Revenue',  value: '$1.2M', note: 'YTD' },
  ];

  hotels: Hotel[] = [
    { id:'SS-7721', image:'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=80&h=80&fit=crop', name:'Azure Bay Resort',       location:'Maldives',     rating:4.9, totalRooms:124 },
    { id:'SS-8830', image:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=80&h=80&fit=crop', name:'Alpine Serenity Chalet', location:'Switzerland',  rating:4.8, totalRooms:45  },
    { id:'SS-1102', image:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop', name:'Kyoto Zen Garden Inn',   location:'Japan',        rating:5.0, totalRooms:18  },
    { id:'SS-4491', image:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=80&h=80&fit=crop', name:'Santorini Sun Palace',   location:'Greece',       rating:4.7, totalRooms:88  },
    { id:'SS-3312', image:'https://images.unsplash.com/photo-1549294413-26f195200ae3?w=80&h=80&fit=crop', name:'Bali Serenity Villas',   location:'Indonesia',    rating:4.6, totalRooms:62  },
  ];

  selectedLocation = '';
  selectedRating   = '';
  currentPage      = 1;
  totalPages       = 3;

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get filteredHotels(): Hotel[] {
    return this.hotels.filter(h => {
      const locMatch = !this.selectedLocation || h.location === this.selectedLocation;
      const ratMatch = !this.selectedRating   || h.rating >= +this.selectedRating;
      return locMatch && ratMatch;
    });
  }

  setPage(p: number): void {
    if (p >= 1 && p <= this.totalPages) this.currentPage = p;
  }

  editHotel(hotel: Hotel): void   { alert(`Edit: ${hotel.name}`); }
  deleteHotel(hotel: Hotel): void { alert(`Delete: ${hotel.name}`); }
  addNewHotel(): void             { alert('Open Add New Hotel dialog'); }
}