import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  private baseUrl = 'http://localhost:8080/HostawayApi/';
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
}
