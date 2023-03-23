import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  private baseUrl = 'http://localhost:5000/HostawayApi/';
  //'hostaway.us-east-1.elasticbeanstalk.com     localhost:5000';
  constructor(private _http: HttpClient) {}

  upload(file: File): Observable<any> {
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append('file', file, file.name);
    return this._http.post(this.baseUrl + 'CSV', formData);
  }

  getCurrent(): Observable<any> {
    return this._http.get(this.baseUrl + 'getCurrent');
  }

  createPupReport(): Observable<any> {
    return this._http.get(this.baseUrl + 'createPickup');
  }
}
