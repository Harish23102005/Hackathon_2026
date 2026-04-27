import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, of, switchMap, timeout } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { RoomService } from '../../core/services/room.service';
import { Hotel } from '../../shared/models/hotel.model';
import { Room } from '../../shared/models/room.model';

@Component({
  selector: 'app-rooms',
  imports: [CommonModule, RouterModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms implements OnInit {
  // ── Signals ────────────────────────────────────────────────────────────────
  readonly hotel     = signal<Hotel | null>(null);
  readonly rooms     = signal<Room[]>([]);
  readonly isLoading = signal(true);
  readonly error     = signal('');
  readonly hotelId   = signal(0);

  // ── Computed signals ──────────────────────────────────────────────────────
  readonly hasRooms  = computed(() => this.rooms().length > 0);
  readonly hotelName = computed(() => this.hotel()?.hotelName ?? 'Hotel');

  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  private roomService  = inject(RoomService);
  private hotelService = inject(HotelService);
  private destroyRef   = inject(DestroyRef);

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        this.hotelId.set(+params['hotelId'] || 0);
        this.isLoading.set(true);
        this.error.set('');
        this.rooms.set([]);
        this.hotel.set(null);

        if (!this.hotelId()) {
          this.error.set('No hotel selected. Please go back and choose a hotel.');
          this.isLoading.set(false);
          return EMPTY;
        }

        // Hotel fetch is NON-CRITICAL — if it fails we still show rooms
        const hotel$ = this.hotelService.getHotelById(this.hotelId()).pipe(
          timeout(8000),
          catchError(() => of(null))   // hotel failure is non-fatal
        );

        // Rooms fetch is CRITICAL
        const rooms$ = this.roomService.getRoomsByHotel(this.hotelId()).pipe(
          timeout(8000),
          catchError(err => {
            this.error.set(`Could not load rooms (${err.name === 'TimeoutError' ? 'request timed out — is the backend running on port 5013?' : (err.status ?? 'network error')}).`);
            return of([] as Room[]);
          })
        );

        return forkJoin({ hotel: hotel$, rooms: rooms$ });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: result => {
        this.hotel.set(result.hotel);
        this.rooms.set(result.rooms ?? []);
        this.isLoading.set(false);
      },
      error: err => {
        this.error.set(`Unexpected error: ${err.message ?? 'unknown'}`);
        this.isLoading.set(false);
      }
    });
  }

  bookRoom(room: Room): void {
    this.router.navigate(['/bookings'], {
      queryParams: { roomId: room.roomId, hotelId: this.hotelId() }
    });
  }

  goBack(): void {
    this.router.navigate(['/hotels']);
  }

  getRoomType(categoryId: number): string {
    const types: Record<number, string> = {
      1: 'Standard Room',
      2: 'Deluxe Room',
      3: 'Suite',
      4: 'Presidential Suite'
    };
    return types[categoryId] ?? `Category ${categoryId}`;
  }
}
