import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { HotelService } from '../../../core/services/hotel.service';
import { Hotel } from '../../../shared/models/hotel.model';

@Component({
  selector: 'app-manage-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-hotels.html',
  styleUrls: ['./manage-hotels.css']
})
export class ManageHotelsComponent implements OnInit {

  // ── Signals ────────────────────────────────────────────────────────────────
  readonly hotels         = signal<Hotel[]>([]);
  readonly isLoading      = signal(true);
  readonly error          = signal('');
  readonly selectedLocation = signal('');
  readonly currentPage    = signal(1);
  readonly pageSize       = signal(10);

  // Add/Edit form
  readonly showForm       = signal(false);
  readonly editingHotel   = signal<Hotel | null>(null);
  readonly formHotel      = signal<Partial<Hotel>>({});

  readonly summaryStats   = signal([
    { label: 'Total Hotels',   value: '0', note: 'Live' },
    { label: 'Avg. Occupancy', value: '—', note: '' },
    { label: 'Avg. Rating',    value: '—', note: '★' },
    { label: 'Total Revenue',  value: '—', note: 'YTD' },
  ]);

  // ── Computed signals ────────────────────────────────────────────────────────
  readonly filteredHotels = computed(() => {
    const loc = this.selectedLocation().toLowerCase();
    return loc
      ? this.hotels().filter(h => h.location.toLowerCase().includes(loc))
      : [...this.hotels()];
  });

  readonly pages = computed(() =>
    Array.from(
      { length: Math.ceil(this.filteredHotels().length / this.pageSize()) },
      (_, i) => i + 1
    )
  );

  readonly pagedHotels = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredHotels().slice(start, start + this.pageSize());
  });

  private hotelService = inject(HotelService);
  private destroyRef   = inject(DestroyRef);

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.hotelService.getHotels().pipe(
      tap(hotels => {
        this.hotels.set(hotels ?? []);
        const stats = [...this.summaryStats()];
        stats[0].value = hotels.length.toString();
        if (hotels.length) {
          const avg = hotels.reduce((s, h) => s + Number(h.rating), 0) / hotels.length;
          stats[2].value = avg.toFixed(1) + '/5.0';
        }
        this.summaryStats.set(stats);
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.error.set(`Failed to load hotels (${err.status ?? 'network error'}).`);
        this.isLoading.set(false);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  /** Filtering is handled by the computed signal; this keeps template compatibility. */
  applyFilter(): void { /* no-op — computed signal auto-updates */ }

  setPage(p: number): void { this.currentPage.set(p); }

  openAdd(): void {
    this.editingHotel.set(null);
    this.formHotel.set({ rating: 0 });
    this.showForm.set(true);
  }

  openEdit(hotel: Hotel): void {
    this.editingHotel.set(hotel);
    this.formHotel.set({ ...hotel });
    this.showForm.set(true);
  }

  saveHotel(): void {
    const editing = this.editingHotel();
    const save$ = editing
      ? this.hotelService.updateHotel(editing.hotelId, this.formHotel() as Hotel)
      : this.hotelService.addHotel(this.formHotel() as Hotel);

    save$.pipe(
      tap(() => { this.showForm.set(false); this.loadHotels(); }),
      catchError(() => { alert('Save failed.'); return EMPTY; }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  deleteHotel(hotel: Hotel): void {
    if (!confirm(`Delete "${hotel.hotelName}"?`)) return;

    this.hotelService.deleteHotel(hotel.hotelId).pipe(
      tap(() => this.loadHotels()),
      catchError(() => { alert('Delete failed.'); return EMPTY; }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}