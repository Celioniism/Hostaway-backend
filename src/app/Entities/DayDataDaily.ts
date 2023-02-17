import { Reservation } from './Reservation';


export class DayDataDaily {
  constructor(){
this.date = null;
this.reservation = null;
this.locationNames =  this.fromDb ||{};
this.priceForDay = 0;
  }


  fromDb = undefined;
  locationNames: string[];
  reservation: Reservation;
  date: Date;
  priceForDay: number;
}
