import { Locations } from './Locations';
export class Reservation {
  reservationId: number;
  clientName: string;
  dateRange: string;
  dateReserved: string;
  totalPrice: number;
  numberOfDays: number;
  locationName: Locations;
}
