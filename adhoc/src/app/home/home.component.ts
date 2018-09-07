import { Component, OnInit } from '@angular/core';
import { JdbcConnection } from '../services/connections-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  connection: JdbcConnection;
  selectedTab = 0;
  constructor() { }

  ngOnInit() {

  }

  handleConnected(connection: JdbcConnection) {
    this.connection = connection;
    this.selectedTab = connection ? 1 : 0;
  }
}
