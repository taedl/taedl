import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IAggregatedColumn, IColumn, IJoin, IResultTable, JdbcConnection } from './model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private readonly endpoint: string;

  constructor(private http: HttpClient) {
    this.endpoint = `${environment.endpoint}/reports`;
  }

  table(connection: JdbcConnection, columns: IColumn[], rows: IAggregatedColumn[], joins: IJoin[]): Observable<IResultTable> {
    const url = `${this.endpoint}/table`;
    const request = { connection, columns, rows, joins };
    return this.http.post<IResultTable>(url, request);
  }

}
