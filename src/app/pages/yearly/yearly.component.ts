import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DayData } from 'src/app/Entities/DayData';
import { Monthly } from 'src/app/Entities/Monthly';
import { Overview } from 'src/app/Entities/Overview';
import { DataService } from 'src/app/services/data.service';
import { SorterService } from 'src/app/services/sorter.service';

@Component({
  selector: 'app-yearly',
  templateUrl: './yearly.component.html',
  styleUrls: ['./yearly.component.css'],
})
export class YearlyComponent {
  LocFilterForm: FormGroup;
  locToSelect: FormGroup;
  fromDb = undefined;
  Locations: string[] = this.fromDb || {};
  TheYears: number[] = [];

  select: string = 'select...';
  numdays: number[] = [];

  YearToSelect: FormGroup;
  redirectName: string;
  redirectDaily: boolean;
  selector: boolean = false;
  LocDays: number;

  overview: Overview[];

  statistics: Monthly = {
    reservationId: [],
    day: [],
    totalProfit: 0,
    daysTaken: 0,
  };

  ShownDay: DayData[] = [];
  total: number;
  location: any;
  year: any;
  constructor(
    private get: DataService,
    private fb: FormBuilder,
    private route: Router,
    private sorterService: SorterService
  ) {}

  initializeForm() {
    this.LocFilterForm = this.fb.group({
      name: [''],
    });
  }
  initializeForm2() {
    this.locToSelect = this.fb.group({
      location: [''],
    });
  }
  initializeForm3() {
    this.YearToSelect = this.fb.group({
      year: [''],
    });
  }

  ngOnInit(): void {
    for (let i = 0; i < 365; i++) {
      this.numdays[i] = i;
    }
    this.initializeForm();
    this.initializeForm2();
    this.initializeForm3();
    localStorage.removeItem('year');
    console.log(localStorage.getItem('location'), localStorage.getItem('year'));
    if (
      localStorage.getItem('location') != null &&
      localStorage.getItem('year') != null
    ) {
      this.get
        .getYearly(
          localStorage.getItem('year'),
          localStorage.getItem('location')
        )
        .subscribe(
          (data) => {
            this.statistics = data;
            this.ShownDay = this.statistics.day;

            this.total = this.statistics.totalProfit;
          },
          (error) => {},
          () => {
            this.LocDays = this.findNum();
            this.get.getOverview().subscribe(
              (data) => {
                this.overview = data;
                this.Locations = this.overview[0].bestLocations;
                for (let i = 0; i < data.length; i++) {
                  this.TheYears[i] = data[i].year;
                }
              },
              (error) => {
                console.log(error);
              },
              () => {
                this.selector = true;
              }
            );
          }
        );
    } else {
      this.get.getOverview().subscribe(
        (data) => {
          this.overview = data;
          this.Locations = this.overview[0].bestLocations;

          for (let i = 0; i < data.length; i++) {
            this.TheYears[i] = data[i].year;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          this.editDate();
        }
      );
    }
  }

  searchyear() {
    if (
      this.YearToSelect.value.year != 'select...' &&
      this.YearToSelect.value.year != ''
    ) {
      var year = this.YearToSelect.value.year;
      localStorage.removeItem('year');
      for (let i = 0; i < this.overview.length; i++) {
        if (this.overview[i].year == year) {
          this.Locations = this.overview[i].bestLocations;
          this.Locations.sort();
        }
      }
    } else {
      console.log('Please select');
      this.Locations = null;
    }
  }

  printData1() {
    var divToPrint = document.getElementById('printTable1');
    var divToPrint2 = document.getElementById('printTable2');
    var divToPrint3 = document.getElementById('printTable3');
    const newWin = window.open('Printout');
    newWin.document.write(divToPrint2.outerHTML);
    newWin.document.write(divToPrint.outerHTML);
    newWin.document.write(divToPrint3.outerHTML);
    var head = newWin.document.getElementsByTagName('head')[0];

    var title = newWin.document.createElement('title');
    title.text = 'Yearly Print-out';
    head.append(title);
    newWin.print();
    newWin.close();
  }

  delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  selected() {
    localStorage.setItem('location', this.locToSelect.value.location);
    localStorage.setItem('year', this.YearToSelect.value.year);
    if (
      this.location != this.locToSelect.value.location ||
      this.year != this.YearToSelect.value.year
    ) {
      if (
        this.locToSelect.value.location != 'select...' &&
        this.YearToSelect.value.year != 'select...' &&
        this.YearToSelect.value.year != '' &&
        this.locToSelect.value.location != ''
      ) {
        this.year = this.YearToSelect.value.year;
        this.location = this.locToSelect.value.location;

        this.get
          .getYearly(
            this.YearToSelect.value.year,
            this.locToSelect.value.location
          )
          .subscribe(
            (data) => {
              this.statistics = data;
              this.ShownDay = this.statistics.day;

              this.total = this.statistics.totalProfit;
            },
            (error) => {},
            () => {
              this.LocDays = this.findNum();
              this.editDate();
              this.selector = true;
            }
          );
      } else {
        this.selector = false;
      }
    }
  }

  editDate() {
    const weekday = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    for (let i = 0; i < this.ShownDay.length; i++) {
      var date = this.ShownDay[i].date;
      var d = new Date(date);
      let day = weekday[d.getDay()];
      this.ShownDay[i].name = ' ' + day.toString();
    }
  }

  findNum(): number {
    var count = 0;
    for (var i = 0; i < 365; i++) {
      if (this.ShownDay[i].reservation.reservationId != 0) {
        count++;
      }
    }

    return count;
  }
}
