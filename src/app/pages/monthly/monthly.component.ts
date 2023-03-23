import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Monthly } from 'src/app/Entities/Monthly';
import { DayData } from 'src/app/Entities/DayData';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Overview } from 'src/app/Entities/Overview';
import { Router } from '@angular/router';
import { DayDataDaily } from 'src/app/Entities/DayDataDaily';
import { SorterService } from 'src/app/services/sorter.service';
import { DailyInfo } from 'src/app/Entities/DailyInfo';
import * as $ from 'jquery';
@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css'],
})
export class MonthlyComponent {
  SortType: number = 0;
  sortType: string;

  private dataStorage: string = null;
  private retrieveDataResolver;
  ////////////////////////////////
  // IMPLEMENT EVENT LINKING WITH PROMISE:

  // displayData(): void {
  //   // your display code goes here
  //   console.log("2. DISPLAYING DATA", this.dataStorage);
  // }
  // retrieveData(): void {
  //   // your async retrieval data logic goes here
  //   console.log("1. GETTING DATA FROM SERVER");
  //   setTimeout(() => { // <--- Change it - your service data retrieval
  //     this.dataStorage = '++DATA++';
  //     this.retrieveDataResolver(); // <--- This must be called as soon as the data are ready to be displayed
  //   }, 1000);
  // }

  // retrieveDataPromise(): Promise<any> {
  //   return new Promise((resolve) => {
  //     this.retrieveDataResolver = resolve;
  //     this.retrieveData();
  //   })
  // }
  // retrieveAndThenDisplay() {
  //   this.retrieveDataPromise().then(() => {this.displayData()});
  // }

  ////////////////////////////////
  weekday: string[] = [];

  daysUp: boolean = false;
  daysDow: boolean = false;
  daysNone: boolean = true;

  OCCAverage: number = 0;
  RoomAverage: number = 0;
  ADRAverage: number = 0;
  RevenueAverage: number = 0;
  REVPARAverage: number = 0;

  redirect: boolean = false;
  filterargs = '';
  select: string = 'select...';
  month: string = localStorage.getItem('month');
  year: string = localStorage.getItem('year');
  total: number;
  specific: boolean = true;
  loaded: boolean = false;
  daily: boolean = false;
  statistics: Monthly = {
    reservationId: [],
    day: [],
    totalProfit: 0,
    daysTaken: 0,
  };

  days: number;
  totaldays: number;
  overview: Overview[];
  fromDb = undefined;

  LocationPH: any[] = this.fromDb || {};
  ShownDay: DayData[] = this.fromDb || {};
  NewShownDay: DayData[] = this.fromDb || {};
  NewShownDayPH: DayData[] = this.fromDb || {};

  Dailies: DayDataDaily[] = this.fromDb || {};
  dayInfo: DailyInfo = this.fromDb || {};
  DailyLocs: String[][] = [[]];
  DayProfit: number[] = [];
  DayDates: String[] = [];
  Locations: any[];

  LocFilterForm: FormGroup;
  MonthToSelect: FormGroup;

  Months: string[] = this.fromDb || {};
  TheYears: number[] = [];

  YearToSelect: FormGroup;
  redirectName: string;
  redirectDaily: boolean;
  selecter: boolean = false;
  LocDays: number;
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
    this.MonthToSelect = this.fb.group({
      month: [''],
    });
  }
  initializeForm3() {
    this.YearToSelect = this.fb.group({
      year: [''],
    });
  }

  //NG INIT FUNCTION
  ngOnInit(): void {
    this.initializeForm();
    this.initializeForm2();
    this.initializeForm3();
    localStorage.setItem('sortType', null);
    localStorage.setItem('SortType', '0');
    localStorage.setItem('change', 'false');
    if (
      localStorage.getItem('month') != null &&
      localStorage.getItem('year') != null
    ) {
      this.specific = true;
      this.get
        .getMonthly(localStorage.getItem('month'), localStorage.getItem('year'))
        .subscribe(
          (data) => {
            this.statistics = data;
            this.ShownDay = JSON.parse(JSON.stringify(this.statistics.day));

            this.days = this.uniqueDates(this.ShownDay);
            this.totaldays = this.getDays(
              localStorage.getItem('month'),
              localStorage.getItem('year')
            );
            this.LocDays = this.days;
            this.loaded = true;
            this.daily = false;
            this.total = this.statistics.totalProfit;
            this.createDaily();
          },
          (error) => {},
          () => {
            this.get.getOverview().subscribe(
              (data) => {
                this.selecter = true;
                this.overview = data;
                this.Months = data[0].bestMonths;
                this.sortMonth(this.Months);
                for (let i = 0; i < data.length; i++) {
                  this.TheYears[i] = data[i].year;
                }
              },
              (error) => {
                console.log(error);
              },
              () => {
                this.loaded = true;
              }
            );
            this.makeLists();
            this.editDate();
            this.getAverages();
          }
        );
    } else {
      this.get.getOverview().subscribe(
        (data) => {
          this.overview = data;
          this.Months = [];

          for (let i = 0; i < data.length; i++) {
            this.TheYears[i] = data[i].year;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          this.loaded = true;
        }
      );
    }
  }

  //YEAR AND MONTH SELECT FUNCTIONS

  searchyear() {
    if (
      this.YearToSelect.value.year != 'select...' &&
      this.YearToSelect.value.year != ''
    ) {
      var year = this.YearToSelect.value.year;
      localStorage.removeItem('year');
      for (let i = 0; i < this.overview.length; i++) {
        if (this.overview[i].year == year) {
          this.Months = this.overview[i].bestMonths;
          this.sortMonth(this.Months);
        }
      }
    } else {
      console.log('Please select');
      this.Months = null;
    }
  }

  sortMonth(Month: string[]) {
    var positions: number[] = [];
    for (var i = 0; i < this.Months.length; i++) {
      positions[i] = this.getMonthFromCapString(Month[i]);
    }
    var month: string[] = [];

    for (var i = 0; i < positions.length; i++) {
      month[positions[i]] = this.Months[i];
    }
    month = month.filter(function (e) {
      return e;
    });

    this.Months = [];
    this.Months = month;
  }

  selected() {
    localStorage.setItem('month', this.MonthToSelect.value.month);
    localStorage.setItem('year', this.YearToSelect.value.year);
    this.route.navigate(['/monthly']);
    if (
      this.month != this.MonthToSelect.value.month ||
      this.year != this.YearToSelect.value.year
    ) {
      if (
        this.MonthToSelect.value.month != 'select...' &&
        this.YearToSelect.value.year != 'select...' &&
        this.YearToSelect.value.year != '' &&
        this.MonthToSelect.value.month != ''
      ) {
        this.year = this.YearToSelect.value.year;
        this.month = this.MonthToSelect.value.month;
        this.specific = true;
        this.get
          .getMonthly(
            this.MonthToSelect.value.month,
            this.YearToSelect.value.year
          )
          .subscribe(
            (data) => {
              this.DayDates = [];
              this.Locations = [];
              this.LocationPH = [];
              this.dayInfo.DayProfit = [];
              this.DayProfit = [];
              this.selecter = true;
              this.filterargs = '';
              this.DailyLocs = [[]];
              this.statistics = data;
              this.ShownDay = JSON.parse(JSON.stringify(this.statistics.day));
              this.makeLists();
              this.total = this.statistics.totalProfit;

              this.days = this.uniqueDates(this.ShownDay);

              this.totaldays = this.getDays(
                this.MonthToSelect.value.month,
                this.YearToSelect.value.year
              );
              this.LocDays = this.days;

              this.createDaily();
              this.editDate();
            },
            (error) => {},
            () => {
              this.delay(70).then(() => {
                this.getAverages();
                this.color();
                this.daysUp = false;
                this.daysDow = false;
              });
            }
          );
      } else {
        this.selecter = false;
      }
    }
  }

  //Time FUNCTIONS

  delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  //DICTIONARY SORTS AND COMPUTATIONS

  getMonthFromCapString(mon) {
    var months = [
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

    return months.indexOf(mon);
  }

  getMonthFromString(mon) {
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return months.indexOf(mon);
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

  ColorDict: Map<string, string> = new Map<string, string>([
    ['Creek Side Inn', '#CEA477'],
    ['Paynes Cove', '#8ABC8F'],
    ['Athens Heritage House - 100+ years old Remodeled house', '#5C7E71'],
    ['Broad Bungalow', '#2E4052'],
    ['Bobbin Mills Studio', '#5B6989'],
    ['Five Points Mill House', '#8891BF'],
    ['Athens Mid-Century Inn', '#CABAC8'],
    ['The Harmony Inn', '#5A3399'],
    ['Classic City Apartment', '#435274'],
    ['Cardinal Rose Lakehouse', '#A7958B'],
    ['Lakefront with Dock and Hot Tub', '#189DA0'],
    ['The Nunn Cottage', '#A16869'],
    ['Eclectic Inn Downtown', '#B38A75'],
    ['Lakefront Manor', '#C5AC81'],
  ]);

  // FORMATTING AND COLORATION

  color() {
    this.idColorCode();
  }

  getColor(name: string): string {
    return this.ColorDict.get(name + '');
  }

  idColorCode() {
    for (let i = 0; i < this.dayInfo.DailyLocs.length; i++) {
      for (let j = 0; j < this.dayInfo.DailyLocs[i].length; j++) {
        var doc = document.getElementById('Location' + i + '' + j);

        if (doc != null) {
          document.getElementById('Location' + i + '' + j).style.color =
            this.getColor(doc.textContent);
        }
      }
    }
  }

  pricearrows() {
    this.SortType = parseInt(localStorage.getItem('SortType'));
    this.sortType = localStorage.getItem('sortType');
  }

  //UNIQUE OBJECT FINDING AND FILTERING

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

  getLocTotal(name: string) {
    var total = 0;
    var count = 0;
    for (let i = 0; i < this.ShownDay.length; i++) {
      if (name == this.ShownDay[i].locationName) {
        total += this.ShownDay[i].priceForDay;
        count++;
      }
    }
    this.LocDays = count;
    this.total = total;
  }

  filterLocation() {
    if (
      this.LocFilterForm.value.name == 'remove' ||
      this.LocFilterForm.value.name == 'select...'
    ) {
      this.getAverages();
      this.filterargs = '';
      this.LocDays = this.days;
      this.total = this.statistics.totalProfit;
    } else {
      this.filterargs = this.LocFilterForm.value.name;
      this.getLocTotal(this.LocFilterForm.value.name);
      this.getLocAverages(this.LocFilterForm.value.name);
    }
  }
  uniqueDates(day: DayData[]): number {
    var num = 0;
    for (let i = 0; i < day.length; i++) {
      if (i + 1 < day.length) {
        if (day[i].date == day[i + 1].date) {
        } else {
          num++;
        }
      } else if (i - 1 >= 0) {
        if (day[i].date == day[i - 1].date) {
          num++;
        } else {
          num++;
        }
      } else {
        num = 1;
      }
    }

    return num;
  }

  getDays(month, year): number {
    var numMonth = this.getMonthFromString(month) + 1;
    if (month == 'February' && year % 4 != 0) {
      return 28;
    } else if (month == 'February' && year % 4 == 0) {
      return 29;
    }

    return new Date(year, numMonth, 0).getDate();
  }

  //REDIRECTION

  redirectLocation(name: string) {
    this.filterargs = name;
    this.redirect = false;
    this.specific = true;
    this.daily = false;
    this.delay(60).then(() => {
      this.color();
    });
  }

  // INITIALIZATION

  inits2(num: number) {
    for (var i = 0; i < num; i++) {
      this.DailyLocs[i] = [];
    }
  }
  inits3(num: number) {
    for (var i = 0; i < num; i++) {
      this.dayInfo.DailyLocs[i] = [];
    }
  }

  //CONTENT INITIALIZATION AND CREATION
  getAverages() {
    var revenue = 0;
    var revpar = 0;
    for (let i = 0; i < this.ShownDay.length; i++) {
      revenue += this.ShownDay[i].priceForDay;
      revpar += this.ShownDay[i].priceForDay / this.days;
    }
    this.RevenueAverage = revenue / this.ShownDay.length;
    this.REVPARAverage = revpar / this.LocDays;
  }
  getLocAverages(name: string) {
    var revenue = 0;
    var revpar = 0;
    var count = 0;
    for (let i = 0; i < this.ShownDay.length; i++) {
      if (name == this.ShownDay[i].locationName) {
        count++;
        revenue += this.ShownDay[i].priceForDay;
        revpar += this.ShownDay[i].priceForDay / this.days;
      }
    }

    this.RevenueAverage = revenue / count;
    this.REVPARAverage = revpar / count;
  }
  makeLists() {
    for (let i = 0; i < this.statistics.day.length; i++) {
      this.LocationPH[i] = this.statistics.day[i].locationName;
    }
    this.Locations = this.uniq_fast(this.LocationPH);
    this.Locations.sort();
  }
  createDaily() {
    this.inits2(this.uniqueDates(this.ShownDay));
    var k = 0;
    const weekday = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    for (let i = 0, l = 0; i < this.ShownDay.length; i++, l++) {
      if (i + 1 < this.ShownDay.length) {
        var date = this.ShownDay[i].date;
        var d = new Date(date);
        let day = weekday[d.getDay()];

        if (this.ShownDay[i].date == this.ShownDay[i + 1].date) {
          if (this.DayProfit[k] != null) {
            this.DailyLocs[k][l] = this.ShownDay[i].locationName;
            this.DayProfit[k] += this.ShownDay[i].priceForDay;
            this.DayDates[k] = date.toString() + ' | ' + day;
          } else {
            this.DailyLocs[k][l] = this.ShownDay[i].locationName;
            this.DayProfit[k] = this.ShownDay[i].priceForDay;
            this.DayDates[k] = date.toString() + ' | ' + day;
          }
        } else {
          l = 0;
          if (this.DayProfit[k] != null) {
            this.DailyLocs[k][l] = this.ShownDay[i].locationName;
            this.DayProfit[k] += this.ShownDay[i].priceForDay;
            this.DayDates[k] = date.toString() + ' | ' + day;
          } else {
            this.DailyLocs[k][l] = this.ShownDay[i].locationName;
            this.DayProfit[k] = this.ShownDay[i].priceForDay;
            this.DayDates[k] = date.toString() + ' | ' + day;
          }

          k++;
        }
      } else if (i - 1 >= 0) {
        var date = this.ShownDay[i].date;
        var d = new Date(date);
        let day = weekday[d.getDay()];
        l = 0;
        if (this.ShownDay[i].date == this.ShownDay[i - 1].date) {
          this.DailyLocs[k][l] = this.ShownDay[i].locationName;
          this.DayProfit[k] = this.ShownDay[i].priceForDay;
          this.DayDates[k] = date.toString() + ' | ' + day;
        } else {
          this.DailyLocs[k][l] = this.ShownDay[i].locationName;
          this.DayProfit[k] = this.ShownDay[i].priceForDay;
          this.DayDates[k] = date.toString() + ' | ' + day;
        }
      } else {
        var date = this.ShownDay[i].date;
        var d = new Date(date);
        let day = weekday[d.getDay()];
        l = 0;
        this.DailyLocs[k][l] = this.ShownDay[i].locationName;
        this.DayProfit[k] = this.ShownDay[i].priceForDay;
        this.DayDates[k] = date.toString() + ' | ' + day;
      }
    }
    this.dayInfo.DailyLocs = this.DailyLocs;
    this.dayInfo.DayDates = this.DayDates;
    this.dayInfo.DayProfit = this.DayProfit;
  }

  //CHANGE VIEW BUTTONS
  dailyview() {
    if (
      localStorage.getItem('SortType') == '1' ||
      localStorage.getItem('change') == 'true' ||
      localStorage.getItem('SortType') == '2'
    ) {
      localStorage.setItem('SortType', '2');

      this.ShownDay = this.sorterService.revenue(this.ShownDay);

      this.dayInfo.DailyLocs = [];
      this.dayInfo.DayDates = [];
      this.dayInfo.DayProfit = [];
      this.ShownDay = JSON.parse(JSON.stringify(this.statistics.day));
      this.loaded = true;
      this.daily = false;
      if (this.filterargs == '') {
        this.total = this.statistics.totalProfit;
      }
      this.createDaily();
      this.makeLists();
      this.pricearrows();
      this.filterargs = '';
      this.daily = true;
      this.total = this.statistics.totalProfit;
      this.delay(30).then(() => {
        this.color();
      });
    } else {
      this.DailyLocs = [];
      this.DayDates = [];
      this.DayProfit = [];
      this.delay(20).then(() => {
        this.createDaily();
      });

      this.filterargs = '';
      this.daily = true;
      this.total = this.statistics.totalProfit;
      this.delay(20).then(() => {
        this.color();
      });
    }
    this.daily = true;
  }

  monthly() {
    if (this.daysDow == true || this.daysUp == true) {
      this.dayInfo.DailyLocs = [[]];
      this.dayInfo.DayProfit = [];
      this.dayInfo.DayDates = [];
      this.createDaily();
      this.daysUp = false;
      this.daysDow = false;
      this.daysNone = true;
      this.delay(90).then(() => {
        this.color();
      });
      this.daily = false;
    } else {
      this.daily = false;
    }
  }

  //SORTS BY PRICE FOR MONTHLY AND DAILY VIEW
  price(): any {
    this.DailyLocs = [[]];
    this.LocationPH = this.Locations.slice(0, 0);
    this.Locations = this.Locations.slice(0, 0);
    this.makeLists();
    this.ShownDay = this.sorterService.revenue(this.ShownDay);
    this.delay(30).then(() => {
      if (this.ShownDay == null) {
        this.ShownDay = [];
        this.ShownDay = JSON.parse(JSON.stringify(this.statistics.day));
        this.loaded = true;
        this.daily = false;
        if (this.filterargs == '') {
          this.total = this.statistics.totalProfit;
        }
        this.makeLists();
        this.pricearrows();
        this.delay(30).then(() => {
          this.createDaily();
          this.editDate();
        });
        return null;
      } else {
        this.editDate();

        this.pricearrows();
      }
    });
  }

  printData1() {
    var divToPrint = document.getElementById('printTable1');
    var divToPrint2 = document.getElementById('printTable3');
    const newWin = window.open('Printout');
    newWin.document.write(divToPrint.outerHTML);
    newWin.document.write(divToPrint2.outerHTML);
    var head = newWin.document.getElementsByTagName('head')[0];

    var title = newWin.document.createElement('title');
    title.text = 'Monthly Print-out';
    head.append(title);

    newWin.print();
    this.delay(50).then(() => {
      newWin.close();
    });
  }

  printData2() {
    var divToPrint = document.getElementById('printTable2');
    const newWin = window.open('Printout');
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    this.delay(50).then(() => {
      newWin.close();
    });
  }

  priceDaily() {
    let positions = [];
    let locs: String[][] = [[]];
    let profit: number[] = [];
    let dates: String[] = [];
    let values: number[] = [];
    var map = new Map<number, number>();
    for (let i = 0; i < this.DayDates.length; i++) {
      map.set(i, this.dayInfo.DayProfit[i]);
    }
    values = Array.from(map.values());

    if (this.daysNone == true) {
      values.sort((a, b) => (a < b ? -1 : 1));
      this.daysNone = false;
      this.daysDow = true;
    } else if (this.daysDow == true) {
      values.sort((a, b) => (a > b ? -1 : 1));
      this.daysDow = false;
      this.daysUp = true;
    } else {
      this.dayInfo.DailyLocs = [[]];
      this.dayInfo.DayProfit = [];
      this.dayInfo.DayDates = [];
      this.DayProfit = [];
      this.DayDates = [];
      this.delay(20).then(() => {
        this.createDaily();
        this.makeLists();
      });
      this.daysUp = false;
      this.daysDow = false;
      this.daysNone = true;
      this.delay(90).then(() => {
        this.color();
      });
      return null;
    }

    for (let i = 0; i < values.length; i++) {
      positions[i] = this.getByValue(map, values[i]);
      map.delete(positions[i]);
    }

    for (let i = 0; i < values.length; i++) {
      locs[i] = this.dayInfo.DailyLocs[positions[i]];
      profit[i] = this.dayInfo.DayProfit[positions[i]];
      dates[i] = this.dayInfo.DayDates[positions[i]];
    }

    this.dayInfo.DailyLocs = [[]];
    this.dayInfo.DayProfit = [];
    this.dayInfo.DayDates = [];

    this.delay(50).then(() => {
      this.dayInfo.DailyLocs = locs;
      this.dayInfo.DayProfit = profit;
      this.dayInfo.DayDates = dates;
    });
    this.delay(70).then(() => {
      this.color();
    });
  }

  //KEY GRABBING
  getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue) return key;
    }
  }
}
