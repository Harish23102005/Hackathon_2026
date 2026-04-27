import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type RoomStatus = 'Available' | 'Booked' | 'Maintenance';

export interface Room {
  id: string;
  image: string;
  name: string;
  floor: string;
  hotel: string;
  location: string;
  rate: number;
  type: string;
  status: RoomStatus;
}

@Component({
  selector: 'app-manage-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-rooms.html',
  styleUrls: ['./manage-rooms.css']
})
export class ManageRoomsComponent {

  searchQuery    = '';
  selectedType   = '';
  minPrice       = '';
  maxPrice       = '';
  currentPage    = 1;
  totalPages     = 3;

  bottomCards = [
    { icon:'door',       label:'TOTAL INVENTORY',  value:'1,248', badge:'+4.2%',      badgeClass:'success' },
    { icon:'check',      label:'AVAILABLE ROOMS',  value:'842',   badge:'LIVE NOW',   badgeClass:'live'    },
    { icon:'wrench',     label:'MAINTENANCE',      value:'36',    badge:'High priority',badgeClass:'danger' },
    { icon:'dollar',     label:'AVG. NIGHTLY RATE',value:'$412.50',badge:'+$1.2k',    badgeClass:'success' },
  ];

  rooms: Room[] = [
    { id:'RM-1024', image:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=80&h=80&fit=crop', name:'Deluxe King Room',   floor:'Floor 12', hotel:'Azure Bay Resort',    location:'Maldives',  rate:450,   type:'Deluxe',        status:'Available'   },
    { id:'RM-2045', image:'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=80&h=80&fit=crop', name:'Executive Suite',    floor:'Floor 24', hotel:'The Grand Metropole', location:'New York',  rate:890,   type:'Suite',         status:'Booked'      },
    { id:'RM-0852', image:'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=80&h=80&fit=crop', name:'Skyline Loft',       floor:'Floor 8',  hotel:'Lumina Boutique',     location:'Berlin',    rate:320,   type:'Loft',          status:'Maintenance' },
    { id:'RM-9999', image:'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=80&h=80&fit=crop', name:'Presidential Villa', floor:'Floor 0',  hotel:'Azure Bay Resort',    location:'Maldives',  rate:2450,  type:'Villa',         status:'Available'   },
    { id:'RM-3310', image:'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=80&h=80&fit=crop', name:'Garden Suite',       floor:'Floor 2',  hotel:'Kyoto Zen Garden Inn',location:'Japan',     rate:580,   type:'Suite',         status:'Booked'      },
  ];

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get filteredRooms(): Room[] {
    return this.rooms.filter(r => {
      const q   = this.searchQuery.toLowerCase();
      const qOk = !q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.hotel.toLowerCase().includes(q);
      const tOk = !this.selectedType || r.type === this.selectedType;
      const minOk = !this.minPrice || r.rate >= +this.minPrice;
      const maxOk = !this.maxPrice || r.rate <= +this.maxPrice;
      return qOk && tOk && minOk && maxOk;
    });
  }

  setPage(p: number): void {
    if (p >= 1 && p <= this.totalPages) this.currentPage = p;
  }

  getStatusClass(s: RoomStatus): string {
    return s.toLowerCase();
  }

  editRoom(room: Room): void   { alert(`Edit: ${room.name}`); }
  deleteRoom(room: Room): void { alert(`Delete: ${room.name}`); }
  addRoom(): void              { alert('Open Add Room dialog'); }
}