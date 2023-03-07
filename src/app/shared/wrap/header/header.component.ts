import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  del() {
    localStorage.setItem('sortType', null);
    localStorage.setItem('SortType', '0');
    localStorage.setItem('change', 'false');
  }
}
