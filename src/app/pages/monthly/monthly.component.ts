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
@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css'],
})
export class MonthlyComponent {
  SortType: number = 0;
  sortType: string;

  daysUp: boolean = false;
  daysDow: boolean = false;
  daysNone: boolean = true;

  redirect: boolean = false;
  filterargs = '';
  select: string = 'select...';
  month: string = localStorage.getItem('month');
  year: string = localStorage.getItem('year');
  total: number;
  specific: boolean = false;
  loaded: boolean = false;
  daily: boolean = false;
  statistics: Monthly = {
    day: [],
    totalProfit: 0,
    daysTaken: 0,
  };
  days: number;
  overview: Overview[];
  fromDb = undefined;
  Location: any[] = this.fromDb || {};
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

  ngOnInit(): void {
    this.initializeForm();
    this.initializeForm2();
    this.initializeForm3();
    localStorage.setItem('sortType', null);
    localStorage.setItem('SortType', '0');
    localStorage.setItem('change', 'false');
    if (localStorage.getItem('month') != null) {
      this.specific = true;
      this.get
        .getMonthly(localStorage.getItem('month'), localStorage.getItem('year'))
        .subscribe(
          (data) => {
            this.statistics = data;
            this.ShownDay = this.statistics.day;
            this.days = this.uniqueDates(this.ShownDay);
            this.loaded = true;
            this.daily = false;
            this.total = this.statistics.totalProfit;
            this.createDaily();
          },
          (error) => {},
          () => {
            this.makeLists();
            localStorage.removeItem('month');
          }
        );
    } else {
      this.get.getOverview().subscribe(
        (data) => {
          this.overview = data;
          this.Months = data[0].bestMonths;
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

  back() {
    this.statistics = null;
    this.LocationPH = this.Locations.slice(0, 0);
    this.Locations = this.Locations.slice(0, 0);
    localStorage.setItem('sortType', null);
    localStorage.setItem('SortType', '0');
    localStorage.setItem('change', 'false');
    this.sortType = null;
    this.SortType = 0;
    this.specific = false;
    this.daily = false;

    this.initializeForm2();
    this.initializeForm3();

    this.DailyLocs = [[]];
    if (localStorage.getItem('year') != null) {
      this.route.navigate(['/overview']);
      this.filterargs = '';
    } else {
      this.route.navigate(['/monthly']);
      this.filterargs = '';
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
          this.Months = this.overview[i].bestMonths;
        }
      }
    } else {
      console.log('Please select');
      this.Months = null;
    }
  }

  makeLists() {
    for (let i = 0; i < this.statistics.day.length; i++) {
      this.LocationPH[i] = this.statistics.day[i].locationName;
    }
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
  selected() {
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
            this.DailyLocs = [[]];
            this.statistics = data;
            this.makeLists();
            this.ShownDay = this.statistics.day;
            this.total = this.statistics.totalProfit;
            this.days = this.uniqueDates(this.ShownDay);
            this.MonthToSelect.value.month = '';
            this.createDaily();
          },
          (error) => {},
          () => {}
        );
    } else {
      console.log('Please select');
    }
  }

  delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  filterLocation() {
    if (
      this.LocFilterForm.value.name == 'remove' ||
      this.LocFilterForm.value.name == 'select...'
    ) {
      this.filterargs = '';
      this.total = this.statistics.totalProfit;
    } else {
      this.filterargs = this.LocFilterForm.value.name;
      this.getLocTotal(this.LocFilterForm.value.name);
    }
  }

  getLocTotal(name: string) {
    var total = 0;
    for (let i = 0; i < this.ShownDay.length; i++) {
      if (name == this.ShownDay[i].locationName) {
        total += this.ShownDay[i].priceForDay;
      }
    }
    this.total = total;
  }

  ColorDict: Map<string, string> = new Map<string, string>([
    [' Creek Side Inn | ', '#CEA477'],
    [' Paynes Cove | ', '#8ABC8F'],
    [' Athens Heritage House - 100+ years old Remodeled house | ', '#5C7E71'],
    [' Broad Bungalow | ', '#2E4052'],
    [' Bobbin Mills Studio | ', '#5B6989'],
    [' Five Points Mill House | ', '#8891BF'],
    [' Athens Mid-Century Inn | ', '#CABAC8'],
    [' The Harmony Inn | ', '#5A3399'],
    [' Classic City Apartment | ', '#435274'],
    [' Cardinal Rose Lakehouse | ', '#A7958B'],
    [' Lakefront with Dock and Hot Tub | ', '#189DA0'],
    [' The Nunn Cottage | ', '#A16869'],
    [' Eclectic Inn Downtown | ', '#B38A75'],
    [' Lakefront Manor | ', '#C5AC81'],
  ]);

  getColor(name: string): string {
    return this.ColorDict.get(name + '');
  }

  idColorCode() {
    for (let i = 0; i < this.DailyLocs.length; i++) {
      for (let j = 0; j < this.DailyLocs[i].length; j++) {
        var doc = document.getElementById('Location' + i + '' + j);

        if (doc != null) {
          document.getElementById('Location' + i + '' + j).style.color =
            this.getColor(doc.textContent);
        }
      }
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
      } else {
        if (day[i].date == day[i - 1].date) {
          num++;
        } else {
          num++;
        }
      }
    }

    return num;
  }

  redirectLocation(name: string) {
    localStorage.setItem('location', name);
    this.route.navigate(['location']);
  }

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
  createDaily() {
    this.inits2(this.uniqueDates(this.ShownDay));
    var k = 0;

    for (let i = 0, l = 0; i < this.ShownDay.length; i++, l++) {
      if (i + 1 < this.ShownDay.length) {
        var date = this.ShownDay[i].date;

        if (this.ShownDay[i].date == this.ShownDay[i + 1].date) {
          if (this.DayProfit[k] != null) {
            this.DailyLocs[k][l] = this.ShownDay[i].locationName;
            this.DayProfit[k] += this.ShownDay[i].priceForDay;
            this.DayDates[k] = date.toString();
          } else {
            this.DailyLocs[k][l] = this.ShownDay[i].locationName;
            this.DayProfit[k] = this.ShownDay[i].priceForDay;
            this.DayDates[k] = date.toString();
          }
        } else {
          l = 0;
          if (this.DayProfit[k] != null) {
            this.DailyLocs[k][l] = this.ShownDay[i].locationName;
            this.DayProfit[k] += this.ShownDay[i].priceForDay;
            this.DayDates[k] = date.toString();
          } else {
            this.DailyLocs[k][l] = this.ShownDay[i].locationName;
            this.DayProfit[k] = this.ShownDay[i].priceForDay;
            this.DayDates[k] = date.toString();
          }

          k++;
        }
      } else {
        var date = this.ShownDay[i].date;

        l = 0;
        if (this.ShownDay[i].date == this.ShownDay[i - 1].date) {
          this.DailyLocs[k][l] = this.ShownDay[i].locationName;
          this.DayProfit[k] = this.ShownDay[i].priceForDay;
          this.DayDates[k] = date.toString();
        } else {
          this.DailyLocs[k][l] = this.ShownDay[i].locationName;
          this.DayProfit[k] = this.ShownDay[i].priceForDay;
          this.DayDates[k] = date.toString();
        }
      }
    }
    this.dayInfo.DailyLocs = this.DailyLocs;
    this.dayInfo.DayDates = this.DayDates;
    this.dayInfo.DayProfit = this.DayProfit;
  }

  hack(val: String[]): String[] {
    return val;
  }

  dailyview() {
    if (
      localStorage.getItem('SortType') == '1' ||
      localStorage.getItem('change') == 'true'
    ) {
      localStorage.setItem('SortType', '2');
      this.ShownDay = this.sorterService.revenue(this.ShownDay);
      this.get.getMonthly(this.month, this.year).subscribe(
        (data) => {
          this.statistics = data;
          this.ShownDay = this.statistics.day;
          this.loaded = true;
          this.daily = false;
          this.total = this.statistics.totalProfit;
          this.createDaily();
        },
        (error) => {},
        () => {
          this.makeLists();
          this.pricearrows();
          this.filterargs = '';
          this.daily = true;
          this.total = this.statistics.totalProfit;
          this.delay(100).then(() => {
            this.color();
          });
        }
      );
    } else {
      this.filterargs = '';
      this.daily = true;
      this.total = this.statistics.totalProfit;
      this.delay(100).then(() => {
        this.color();
      });
    }
  }

  color() {
    this.idColorCode();
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
      this.delay(100).then(() => {
        this.color();
      });
      this.daily = false;
    } else {
      this.daily = false;
    }
  }

  price(): any {
    this.DailyLocs = [[]];
    this.LocationPH = this.Locations.slice(0, 0);
    this.Locations = this.Locations.slice(0, 0);
    this.makeLists();
    this.ShownDay = this.sorterService.revenue(this.ShownDay);
    this.delay(100).then(() => {
      if (this.ShownDay == null) {
        this.get.getMonthly(this.month, this.year).subscribe(
          (data) => {
            this.statistics = data;
            this.ShownDay = this.statistics.day;
            this.loaded = true;
            this.daily = false;
            this.total = this.statistics.totalProfit;
            this.createDaily();
          },
          (error) => {},
          () => {
            this.makeLists();
            this.pricearrows();
          }
        );
        return null;
      }

      this.createDaily();
      this.pricearrows();
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
      this.createDaily();
      this.daysUp = false;
      this.daysDow = false;
      this.daysNone = true;
      this.delay(100).then(() => {
        this.color();
      });
      return null;
    }

    console.log(values);
    for (let i = 0; i < values.length; i++) {
      positions[i] = this.getByValue(map, values[i]);
      map.delete(positions[i]);
    }

    for (let i = 0; i < values.length; i++) {
      locs[i] = this.dayInfo.DailyLocs[positions[i]];
      profit[i] = this.dayInfo.DayProfit[positions[i]];
      dates[i] = this.dayInfo.DayDates[positions[i]];
    }
    this.dayInfo.DailyLocs = locs;
    this.dayInfo.DayProfit = profit;
    this.dayInfo.DayDates = dates;
  }

  getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue) return key;
    }
  }

  pricearrows() {
    this.SortType = parseInt(localStorage.getItem('SortType'));
    this.sortType = localStorage.getItem('sortType');
  }
  popup(name: string) {
    this.redirectName = name;
    this.redirect = true;
    this.specific = false;
    this.daily = true;
  }

  popupday(name: string) {
    this.redirectName = name;
    this.redirectDaily = true;
    this.specific = false;
    this.daily = true;
  }
  hide() {
    this.redirectName = '';
    this.redirect = false;
    this.specific = true;
    this.daily = false;
  }
  hideday() {
    this.redirectName = '';
    this.redirectDaily = false;
    this.specific = true;
    this.daily = true;
    this.delay(100).then(() => {
      this.color();
    });
  }
}
