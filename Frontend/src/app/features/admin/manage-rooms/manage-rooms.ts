import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { RoomService } from '../../../core/services/room.service';
import { HotelService } from '../../../core/services/hotel.service';
import { Room } from '../../../shared/models/room.model';
import { Hotel } from '../../../shared/models/hotel.model';

@Component({
  selector: 'app-manage-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-rooms.html',
  styleUrls: ['./manage-rooms.css']
})
export class ManageRoomsComponent implements OnInit {

  hotels: Hotel[] = [];
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  isLoading = true;
  error = '';
  selectedHotelId = '';
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;

  // Add/Edit form
  showForm = false;
  editingRoom: Room | null = null;
  formRoom: Partial<Room> = {};

  bottomCards = [
    { icon: 'door',    label: 'TOTAL INVENTORY',   value: '0',    badge: 'Live',         badgeClass: 'success' },
    { icon: 'check',   label: 'AVAILABLE ROOMS',   value: '—',    badge: 'LIVE NOW',     badgeClass: 'live'    },
    { icon: 'dollar',  label: 'AVG. NIGHTLY RATE', value: '—',    badge: '',             badgeClass: 'success' },
  ];

  private roomService = inject(RoomService);
  private hotelService = inject(HotelService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.hotelService.getHotels().pipe(
      tap(hotels => {
        this.hotels = hotels ?? [];
        if (hotels.length) {
          this.selectedHotelId = hotels[0].hotelId.toString();
          this.loadRooms();
        } else {
          this.isLoading = false;
        }
      }),
      catchError(err => {
        this.error = `Failed to load hotels (${err.status ?? 'network error'}).`;
        this.isLoading = false;
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  loadRooms(): void {
    if (!this.selectedHotelId) return;
    this.isLoading = true;
    this.error = '';

    this.roomService.getRoomsByHotel(+this.selectedHotelId).pipe(
      tap(rooms => {
        this.rooms = rooms ?? [];
        this.applyFilter();
        this.bottomCards[0].value = rooms.length.toString();
        if (rooms.length) {
          const avg = rooms.reduce((s, r) => s + r.pricePerNight, 0) / rooms.length;
          this.bottomCards[2].value = '$' + avg.toFixed(0);
        }
        this.isLoading = false;
      }),
      catchError(err => {
        this.error = `Failed to load rooms (${err.status ?? 'network error'}).`;
        this.isLoading = false;
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredRooms = q
      ? this.rooms.filter(r => r.roomNumber.toString().includes(q))
      : [...this.rooms];
  }

  get pages(): number[] {
    return Array.from({ length: Math.ceil(this.filteredRooms.length / this.pageSize) }, (_, i) => i + 1);
  }

  get pagedRooms(): Room[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRooms.slice(start, start + this.pageSize);
  }

  setPage(p: number): void { this.currentPage = p; }

  openAdd(): void {
    this.editingRoom = null;
    this.formRoom = { hotelId: +this.selectedHotelId };
    this.showForm = true;
  }

  openEdit(room: Room): void {
    this.editingRoom = room;
    this.formRoom = { ...room };
    this.showForm = true;
  }

  saveRoom(): void {
    const save$ = this.editingRoom
      ? this.roomService.updateRoom(this.editingRoom.roomId, this.formRoom as Room)
      : this.roomService.addRoom(this.formRoom as Room);

    save$.pipe(
      tap(() => { this.showForm = false; this.loadRooms(); }),
      catchError(() => { alert('Save failed.'); return EMPTY; }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  deleteRoom(room: Room): void {
    if (!confirm(`Delete room ${room.roomNumber}?`)) return;

    this.roomService.deleteRoom(room.roomId).pipe(
      tap(() => this.loadRooms()),
      catchError(() => { alert('Delete failed.'); return EMPTY; }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}