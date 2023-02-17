import { Reservation } from './Reservation';

export class DayData {
  constructor(){
    this.date = null;
    this.reservation = null;
    this.locationName =  null;
    this.priceForDay = 0;
      }
    
   

  locationName: string;
  reservation: Reservation;
  date: Date;
  priceForDay: number;
}
