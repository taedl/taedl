import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IAggregatedColumn, IColumn, IJoin, IResultTable, ITableMetaData, JdbcConnection } from './model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsApiService {

  private readonly endpoint: string;

  constructor(private http: HttpClient) {
    this.endpoint = `${environment.endpoint}/reports`;
  }

  table(connection: JdbcConnection, tables: ITableMetaData[], columns: IColumn[], rows: IAggregatedColumn[], joins: IJoin[]):
    Observable<IResultTable> {

    const url = `${this.endpoint}/table`;
    const request = { connection, tables, columns, rows, joins };
    return this.http.post<IResultTable>(url, request);
  }

}
