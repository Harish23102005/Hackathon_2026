
export interface Room {
  roomId: number;
  hotelId: number;
  categoryId: number;
  roomNumber: number;   // int on backend (101, 102, 201...)
  pricePerNight: number;
  capacity: number;
}