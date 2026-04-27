import { TestBed } from '@angular/core/testing';

import { RoomAmenityService } from './room-amenity.service';

describe('RoomAmenityService', () => {
  let service: RoomAmenityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomAmenityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
