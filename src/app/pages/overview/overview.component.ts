import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Overview } from 'src/app/Entities/Overview';
import { DataService } from 'src/app/services/data.service';
import {
  ChartType,
  ChartOptions,
  ChartConfiguration,
  ChartData,
  ChartEvent,
} from 'chart.js';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent {
  fromDb = undefined;
  Overview: Overview[];
  totals: number[] = this.fromDb || {};
  Channel: Map<String, number> = new Map<String, number>();
  MonthCount: number = 0;
  loaded: boolean = false;
  //various options for line and piechart
  public lineChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  LineLabels: string[] = [];
  public lineChartData: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        backgroundColor: 'rgb(255, 255, 255)',
        pointBackgroundColor: 'rgb(0, 0, 0)',
        label: 'Revenue',
        data: [],
        fill: false,
        borderColor: 'rgb(242, 140, 40)',
        tension: 0.1,
      },
    ],
  };

  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  Labels: string[] = [];
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgb(242, 140, 40)',
          'rgb(54, 162, 235)',
          'rgb(225, 105, 86)',
          'rgb(255, 145, 186)',
          'rgb(255, 235, 56)',
          'rgb(55, 105, 206)',
        ],
      },
    ],
  };

  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [];

  constructor(
    private get: DataService,
    private router: Router,
    private renderer2: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.get.getOverview().subscribe(
      (data) => {
        this.Overview = data;
        this.piechartCreate();
        this.calcTotals();
        this.linechartCreate();
        this.loaded = true;
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }
  //titlecase script
  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  //UNIMPLEMENTED route from overview to yearly
  selectYear(year: String) {
    localStorage.setItem('yearSelected', year.toString());
  }

  routeTo(String: string, String2) {
    String = this.toTitleCase(String);
    localStorage.setItem('month', String);
    localStorage.setItem('year', String2);
    this.router.navigate(['monthly/' + String]);
  }

  calcTotals() {
    for (let i = 0; i < this.Overview.length; i++) {
      var total = 0.0;
      for (let j = 0; j < this.Overview[i].bestMonths.length; j++) {
        total += this.Overview[i].monthPrices[j];
      }
      this.totals[i] = total;
    }
  }
  piechartCreate() {
    var totalValues = [];
    var allKeys = [];
    var TotalMap = new Map<string, number>();
    for (let i = 0; i < this.Overview.length; i++) {
      this.Channel = this.Overview[i].channelTotals;
      var values: number[] = Object.values(this.Channel);
      var keys: string[] = Object.keys(this.Channel);
      for (let j = 0; j < keys.length; j++) {
        if (i == 0) {
          if (TotalMap.get(keys[j]) != null) {
            TotalMap.set(keys[j], values[j] + TotalMap.get(keys[j]));
          } else {
            TotalMap.set(keys[j], values[j]);
          }
          totalValues[1] = values[0];
        } else if (totalValues[j] != null) {
          if (TotalMap.get(keys[j]) != null) {
            TotalMap.set(keys[j], values[j] + TotalMap.get(keys[j]));
          } else {
            TotalMap.set(keys[j], values[j]);
          }
          totalValues[j] += values[j];
        } else {
          if (TotalMap.get(keys[j]) != null) {
            TotalMap.set(keys[j], values[j] + TotalMap.get(keys[j]));
          } else {
            TotalMap.set(keys[j], values[j]);
          }
          totalValues[j] = values[j];
        }
      }
    }
    totalValues = [];
    allKeys = [];
    totalValues = Array.from(TotalMap.values());
    allKeys = Array.from(totalValues.keys());

    totalValues.sort(function (a, b) {
      return a - b;
    });
    var percents: number[] = [];
    var positions = [];
    var SortKeys: string[] = [];
    var total = 0;

    for (var i = 0; i < totalValues.length; i++) {
      total += totalValues[i];
      positions[i] = this.getByValue2(TotalMap, totalValues[i]);
      TotalMap.delete(positions[i]);
    }

    for (let i = 0; i < allKeys.length; i++) {
      percents[i] = (totalValues[i] / total) * 100;
      SortKeys[i] = positions[i];
    }

    for (let i = 0; i < SortKeys.length; i++) {
      this.Labels[i] = SortKeys[i];
      this.pieChartData.datasets[0].data.push(totalValues[i]);
      this.pieChartData.labels.push(
        SortKeys[i] + ' - ' + percents[i].toFixed(2) + '%'
      );
    }
  }

  delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  linechartCreate() {
    var count = 0;

    for (let i = 0; i < this.Overview.length; i++) {
      let map = new Map<string, number>([]);
      for (let j = 0; j < this.Overview[i].monthPrices.length; j++) {
        map.set(
          this.Overview[i].bestMonths[j],
          this.Overview[i].monthPrices[j]
        );
      }

      var sorted = new Map<string, number>(
        [...map.entries()].sort((a, b) => {
          const first = a;
          const second = b;
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

          return months.indexOf(first[0]) > months.indexOf(second[0])
            ? 1
            : months.indexOf(first[0]) < months.indexOf(second[0])
            ? -1
            : 0;
        })
      );

      var keys: string[] = Array.from(sorted.keys());
      var values: number[] = Array.from(sorted.values());
      for (let j = 0; j < this.Overview[i].monthPrices.length; j++) {
        this.lineChartData.labels[count] =
          keys[j] + ' - ' + this.Overview[i].year;
        this.lineChartData.datasets[0].data[count] = values[j];
        count++;
      }
    }
  }

  getByValue(map: Map<String, number>, searchValue: String): number {
    for (let [key, value] of map.entries()) {
      if (key == searchValue) return value;
    }
  }

  getByValue2(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue) return key;
    }
  }

  public surprise(): void {
    var canvas = document.getElementById('custom-canvas');

    const myConfetti = confetti.create(canvas, {
      resize: true,
      // will fit all screen sizes
    });

    myConfetti({
      particleCount: 290,
      spread: 90,
      zIndex: 0,
      startVelocity: 30,
      gravity: 1.6,
      scalar: 0.9,
      colors: ['#000000', '#F28C28', '#FFFFFF'],
    });
  }
  //conf
  confettiServe() {
    this.surprise();
  }
}
