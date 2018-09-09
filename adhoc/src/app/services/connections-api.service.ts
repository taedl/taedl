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
}

export class JdbcConnection {
  constructor(public endpoint: string, public user: string,
              public password: string, public vendor: string) {
  }
}

export interface IColumn {
  name: string;
  tableName: string;
  type: string;
  columnSize: string;
}

export interface IKey {
  primary: IColumn;
  foreign: IColumn;
}

export interface ITableMetaData {
  name: string;
  primaryKey: IColumn;
  importedKeys: IKey[];
  exportedKeys: IKey[];
  columns: IColumn[];
}
