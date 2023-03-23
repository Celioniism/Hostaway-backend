import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'http://localhost:5000/HostawayApi/';
  constructor(private _http: HttpClient) {}

  getOverview(): Observable<any> {
    return this._http.get(this.baseUrl + 'getOverview');
  }
  getYearly(year: string, location: string): Observable<any> {
    return this._http.get(this.baseUrl + 'getYearly/' + year + '/' + location);
  }

  getMonthly(month: string, year: string): Observable<any> {
    return this._http.get(this.baseUrl + 'getMonthly/' + year + '/' + month);
  }
}
