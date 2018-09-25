import { Injectable } from '@angular/core';
import { JdbcConnection } from './model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private connection: JdbcConnection;
  constructor() { }

  isConnected() {
    return !!this.connection;
  }

  disconnect() {
    this.connection = null;
  }

  connect(connection: JdbcConnection) {
    this.connection = connection;
  }

  getConnection() {
    return this.connection;
  }
}
