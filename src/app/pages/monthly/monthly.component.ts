import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Monthly } from 'src/app/Entities/Monthly';
import { DayData } from 'src/app/Entities/DayData';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Overview } from 'src/app/Entities/Overview';
import { Router } from '@angular/router';
import { DayDataDaily } from 'src/app/Entities/DayDataDaily';
@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css'],
})
export class MonthlyComponent {
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
  overview: Overview[];
  fromDb = undefined;
  Location: any[] = this.fromDb || {};
  LocationPH: any[] = this.fromDb || {};
  ShownDay: DayData[] = this.fromDb || {};
  NewShownDay: DayData[] = this.fromDb || {};
  NewShownDayPH: DayData[] = this.fromDb || {};
  Dailies: DayDataDaily[] =this.fromDb || {};
  DailyLocs: String[] = [];
  DayProfit: number[] = [];
  DayDates : String[] = [];
  Locations: any[] ;
  LocFilterForm: FormGroup;
  MonthToSelect: FormGroup;
  Months: string[] = this.fromDb || {};
  TheYears: number[] = this.fromDb || {};
  YearToSelect: FormGroup;
  constructor(
    private get: DataService,
    private fb: FormBuilder,
    private route: Router
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
    if (localStorage.getItem('month') != null) {
      this.specific = true;
      this.get
        .getMonthly(localStorage.getItem('month'), localStorage.getItem('year'))
        .subscribe(
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
    this.specific = false;
    this.daily = false;
    if(localStorage.getItem('year') != null){
      this.route.navigate(['/overview']);
      this.filterargs = '';
    }else{
    this.route.navigate(['/monthly']);
    this.filterargs = '';
    }
  }
  searchyear() {
    if (this.YearToSelect.value.year != 'select...') {
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
            this.statistics = data;
            this.makeLists();
            this.ShownDay = this.statistics.day;
            this.total = this.statistics.totalProfit;
            this.createDaily();
          },
          (error) => {},
          () => {}
        );
    } else {
      console.log('Please select');
    }
  }

  filterLocation() {
    if (
      this.LocFilterForm.value.name == 'remove' ||
      this.LocFilterForm.value.name == 'select...'
    ) {
      this.filterargs = '';
    } else {
      this.filterargs = this.LocFilterForm.value.name;
    }
  }

  createDaily(){
    var k =0, j =0;
    for(let i =0; i< this.ShownDay.length; i++){
      if(i+1< this.ShownDay.length){
        var date = this.ShownDay[i].date;
      if(this.ShownDay[i].date == this.ShownDay[i+1].date){
        if(this.DailyLocs[k] !=null)
        {this.DailyLocs[k] += ", "+this.ShownDay[i].locationName;
        this.DayProfit[k] += this.ShownDay[i].priceForDay;
        this.DayDates[k] = date.toString();
      }else{
          this.DailyLocs[k] = this.ShownDay[i].locationName;
          this.DayProfit[k] = this.ShownDay[i].priceForDay;
          this.DayDates[k] = date.toString();
        }
        
        j++;
      }else{
        if(this.DailyLocs[k] !=null)
        {this.DailyLocs[k] += ", "+this.ShownDay[i].locationName;
        this.DayProfit[k] += this.ShownDay[i].priceForDay;
        this.DayDates[k] = date.toString();
      }else{
          this.DailyLocs[k] = this.ShownDay[i].locationName;
          this.DayProfit[k] = this.ShownDay[i].priceForDay;
          this.DayDates[k] = date.toString();
        }
        
        j =0;
        k++;
      
        
      }
    }
   
    }
 
  }

  hack(val: number[]): number[] {
    console.log(val);
    return val;
  }

  dailyview() {
    this.filterargs = "";

    this.daily = true;
  }

  monthly() {
    this.daily = false;
  }
}
