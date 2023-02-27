import { Component } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent {
  locationSelected = false;
  location: String;
  ngOnInit(): void {
    if (localStorage.getItem('location') != null) {
      this.location = localStorage.getItem('location');
      localStorage.removeItem('location');
      this.locationSelected = true;
    } else {
    }
  }

  //CREATE LOCATION TABLES. CREATE LOCATION OVERVIEW, IF LOCATION NAME IS IN MONTHLY DAY THEN ADD TO TABLE WITH DATE
  //FILTER BY MONTH, CHANGING TABLE CONTENTS.
}
