import { Injectable } from '@angular/core';
import { DailyInfo } from '../Entities/DailyInfo';
import { DayData } from '../Entities/DayData';

@Injectable({
  providedIn: 'root',
})
export class SorterService {
  constructor() {}

  delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  name(day: DayData[]): DayData[] {
    if (parseInt(localStorage.getItem('SortType')) < 1) {
      localStorage.setItem('change', 'true');
    }
    localStorage.setItem('sortType', 'name');
    this.sortTypeChange();
    this.delay(5).then(() => {
      return this.doSort(day);
    });
    return this.doSort(day);
  }

  revenue(day: DayData[]): DayData[] {
    if (parseInt(localStorage.getItem('SortType')) < 1) {
      localStorage.setItem('change', 'true');
    }
    localStorage.setItem('sortType', 'price');
    this.sortTypeChange();
    this.delay(5).then(() => {
      return this.doSort(day);
    });
    return this.doSort(day);
  }

  revenueDaily(day: DailyInfo[]): DailyInfo[] {
    if (parseInt(localStorage.getItem('SortType')) < 1) {
      localStorage.setItem('change', 'true');
    }
    localStorage.setItem('sortType', 'price');
    this.sortTypeChange();
    this.delay(5).then(() => {
      return this.doSortDaily(day);
    });
    return this.doSortDaily(day);
  }

  sortTypeChange() {
    if (localStorage.getItem('change') == 'true') {
      localStorage.setItem('SortType', '1');
      localStorage.setItem('change', 'false');
    } else if (localStorage.getItem('SortType') == '1') {
      localStorage.setItem('SortType', '2');
    } else if (localStorage.getItem('SortType') == '2') {
      localStorage.setItem('SortType', '0');
      localStorage.setItem('change', 'false');
    }
  }

  doSort(day: DayData[]): DayData[] {
    if (localStorage.getItem('SortType') == '1') {
      return this.upSorter(day);
    } else if (localStorage.getItem('SortType') == '2') {
      return this.downSorter(day);
    } else {
      return null;
    }
  }

  doSortDaily(day: DailyInfo[]): DailyInfo[] {
    if (localStorage.getItem('SortType') == '1') {
      return this.upSorterDaily(day);
    } else if (localStorage.getItem('SortType') == '2') {
      return this.downSorterDaily(day);
    } else {
      return null;
    }
  }
  upSorter(day: DayData[]): DayData[] {
    if (localStorage.getItem('sortType') == null) {
      return null;
    } else if (localStorage.getItem('sortType') == 'name') {
      return this.sortByNameUp(day);
    } else if (localStorage.getItem('sortType') == 'price') {
      return this.sortByRevenueUp(day);
    }
    return day;
  }

  downSorter(day: DayData[]): DayData[] {
    if (localStorage.getItem('sortType') == null) {
      return null;
    } else if (localStorage.getItem('sortType') == 'name') {
      return this.sortByNameDown(day);
    } else if (localStorage.getItem('sortType') == 'price') {
      return this.sortByRevenueDown(day);
    }
  }

  upSorterDaily(day: DailyInfo[]): DailyInfo[] {
    if (localStorage.getItem('sortType') == null) {
      return null;
    } else if (localStorage.getItem('sortType') == 'name') {
      return this.sortByNameUpDaily(day);
    } else if (localStorage.getItem('sortType') == 'price') {
      return this.sortByRevenueUpDaily(day);
    }
    return day;
  }

  downSorterDaily(day: DailyInfo[]): DailyInfo[] {
    if (localStorage.getItem('sortType') == null) {
      return null;
    } else if (localStorage.getItem('sortType') == 'name') {
      return this.sortByNameDownDaily(day);
    } else if (localStorage.getItem('sortType') == 'price') {
      return this.sortByRevenueDownDaily(day);
    }
  }

  sortByNameDown(day: DayData[]): DayData[] {
    return day.sort((a, b) => (a.locationName > b.locationName ? -1 : 1));
  }
  sortByRevenueDown(day: DayData[]): DayData[] {
    return day.sort((a, b) => (a.priceForDay > b.priceForDay ? -1 : 1));
  }

  sortByNameUp(day: DayData[]): DayData[] {
    return day.sort((a, b) => (a.locationName < b.locationName ? -1 : 1));
  }
  sortByRevenueUp(day: DayData[]): DayData[] {
    return day.sort((a, b) => (a.priceForDay < b.priceForDay ? -1 : 1));
  }

  sortByNameDownDaily(day: DailyInfo[]): DailyInfo[] {
    return day.sort((a, b) => (a.DailyLocs > b.DailyLocs ? -1 : 1));
  }
  sortByRevenueDownDaily(day: DailyInfo[]): DailyInfo[] {
    return day.sort((a, b) => (a.DayProfit > b.DayProfit ? -1 : 1));
  }

  sortByNameUpDaily(day: DailyInfo[]): DailyInfo[] {
    return day.sort((a, b) => (a.DailyLocs < b.DailyLocs ? -1 : 1));
  }
  sortByRevenueUpDaily(day: DailyInfo[]): DailyInfo[] {
    return day.sort((a, b) => (a.DayProfit < b.DayProfit ? -1 : 1));
  }
}
