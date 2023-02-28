import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Monthly } from 'src/app/Entities/Monthly';
import { Overview } from 'src/app/Entities/Overview';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent {
  locationSelected = false;
  location: String;
  LocFilterForm: FormGroup;
  selected: boolean = false;
  LocationNames: string[] = [];
  statistics: Monthly[][] = [[]];
  LocationPH: string[] = [];
  Locations: string[] = [];
  overview: Overview[] = [];
  Months: string[][] = [[]];
  TheYears: string[] = [];
  constructor(private get: DataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    if (localStorage.getItem('location') != null) {
      this.doRetrieve();
      this.location = localStorage.getItem('location');
      localStorage.removeItem('location');
      this.locationSelected = true;
    } else {
      this.get.getOverview().subscribe(
        (data) => {
          this.overview = data;

          for (let i = 0; i < this.overview.length; i++) {
            this.TheYears[i] = data[i].year;
            this.Months[i] = [];
            for (let j = 0; j < this.overview[i].bestMonths.length; j++) {
              this.Months[i][j] = this.overview[i].bestMonths[j];
            }

            for (let j = 0; j < this.overview[i].bestLocations.length; j++) {
              this.LocationPH.push(this.overview[i].bestLocations[j]);
            }
          }

          for (let j = 0; j < this.Months.length; j++) {
            var sorted: string[] = this.Months[j].sort((a, b) => {
              const first = a;
              const second = b;
              var months: string[] = [
                'JANUARY',
                'FEBRUARY',
                'MARCH',
                'APRIL',
                'MAY',
                'JUNE',
                'JULY',
                'AUGUST',
                'SEPTEMBER',
                'OCTOBER',
                'NOVEMBER',
                'DECEMBER',
              ];

              return months.indexOf(first) > months.indexOf(second)
                ? 1
                : months.indexOf(first) < months.indexOf(second)
                ? -1
                : 0;
            });
            this.Months[j] = [];
            this.Months[j] = sorted;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          this.makeLists();
        }
      );
    }
  }

  initializeForm() {
    this.LocFilterForm = this.fb.group({
      name: [''],
    });
  }
  makeLists() {
    this.Locations = this.uniq_fast(this.LocationPH);
  }

  uniq_fast(a: any[]) {
    var seen = {};
    var out = [];
    var len = Object.keys(a).length;
    var j = 0;
    for (var i = 0; i < len; i++) {
      var item = a[i];
      if (seen[item] !== 1) {
        seen[item] = 1;
        out[j++] = item;
      }
    }
    return out;
  }

  doRetrieve() {
    console.log('selected', this.LocFilterForm.value.name);
    var count = 0;
    for (let j = 0; j < this.Months.length; j++) {
      this.statistics[j] = [];
      var month: string[] = this.Months[j];
      console.log(month);
      for (let k = 0; k < month.length; k++) {
        this.get.getMonthly(month[k], this.TheYears[j]).subscribe(
          (data) => {
            this.statistics[j][k] = data;
          },
          (error) => {},
          () => {}
        );
        count++;
      }
    }
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
  delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  select() {
    this.doRetrieve().then(() => {
      this.location = this.LocFilterForm.value.name;
      console.log(this.statistics);
    });
  }

  // MAKE THIS A BACKEND OPERATION CALLED BY THE LOCATION NAME. LET SQL DO THE GRUNT WORK OF PULLING NAMES, THEN RETRIEVE:
  // PER-DATE BASIS DAILY RESERVATION DATA TO GRAB: RESERVATION ID , LOCATION NAME , NUMBER OF DAYS , DATE RANGE , DATE RESERVED , CHANNEL , RESERVATION PRICE

  //CREATE LOCATION TABLES. CREATE LOCATION OVERVIEW, IF LOCATION NAME IS IN MONTHLY DAY THEN ADD TO TABLE WITH DATE
  //FILTER BY MONTH, CHANGING TABLE CONTENTS.
}
