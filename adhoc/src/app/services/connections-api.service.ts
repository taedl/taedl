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

  preview(connection: JdbcConnection, tables: ITableMetaData[], joins: IJoin[]): Observable<IPreview> {
    const url = `${this.endpoint}/preview`;
    const request = { connection, tables, joins };
    return this.http.post<IPreview>(url, request);
  }
}

export interface IResultTable {
  headers: string[];
  data: any[][];
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
 export interface ITable {
   table: ITableMetaData;
   selected: boolean;
}

export interface IJoin {
  primaryKey: {
    tableName: string,
    name: string
  };
  foreignKey: {
    tableName: string,
    name: string
  };
  type: string;
}

export const JOIN_TYPES = {
  INNER: 'inner',
  LEFT: 'left',
  RIGHT: 'right',
  FULL: 'full'
};

export interface IPreview {
  table: IResultTable;
  joinChain: string[];
}
