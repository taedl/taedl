import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IJoin, IPreview, ITableMetaData, JdbcConnection } from './model';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsApiService {

  private readonly endpoint: string;

  constructor(private http: HttpClient) {
    this.endpoint = `${environment.endpoint}/connections`;
  }

  vendors(): Observable<string[]> {
    const url = `${this.endpoint}/vendors`;
    return this.http.get<string[]>(url);
  }

  testConnection(connection: JdbcConnection): Observable<boolean> {
    const url = this.endpoint;
    return this.http.post<boolean>(url, connection);
  }

  tables(connection: JdbcConnection): Observable<string[]> {
    const url = `${this.endpoint}/tables`;
    return this.http.post<string[]>(url, connection);
  }

  tablesMetadata(connection: JdbcConnection): Observable<ITableMetaData[]> {
    const url = `${this.endpoint}/tables-metadata`;
    return this.http.post<ITableMetaData[]>(url, connection);
  }

  preview(connection: JdbcConnection, tables: ITableMetaData[], joins: IJoin[]): Observable<IPreview> {
    const url = `${this.endpoint}/preview`;
    const request = { connection, tables, joins };
    return this.http.post<IPreview>(url, request);
  }
}
