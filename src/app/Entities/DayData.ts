import { Reservation } from './Reservation';

export class DayData {
  constructor() {
    this.reservationId = [];
    this.date = null;
    this.reservation = null;
    this.locationName = null;
    this.priceForDay = 0;
  }
  reservationId: number[];
  locationName: string;
  reservation: Reservation;
  date: Date;
  name: string;
  priceForDay: number;
}
