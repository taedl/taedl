import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsApiService {

  private readonly endpoint: string;

  constructor(private http: HttpClient) {
    this.endpoint = environment.connections;
  }

  public getVendors(): Observable<string[]> {
    const url  = `${this.endpoint}/vendors`;
    return this.http.get<string[]>(url);
  }
}
