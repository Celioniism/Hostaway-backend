import { Pipe, PipeTransform } from '@angular/core';
import { DayData } from 'src/app/Entities/DayData';
@Pipe({
  name: 'myfilter',
  pure: false,
})
export class MyFilterPipe implements PipeTransform {
  transform(items: DayData[], filter: string): any {
    if (filter == '') {
      return items;
    }
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter((item) => item.locationName.indexOf(filter) !== -1);
  }
}
