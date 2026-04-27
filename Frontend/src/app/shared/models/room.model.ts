
export interface Room {
  roomId: number;
  hotelId: number;
  categoryId: number;
  roomNumber: string;
  pricePerNight: number;
  capacity: number;
  isAvailable: boolean;
}