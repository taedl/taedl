import { Component, OnInit } from '@angular/core';
import { IJoin, ITableMetaData, JdbcConnection } from '../services/model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  connection: JdbcConnection;
  tables: ITableMetaData[] = [];
  allTables: ITableMetaData[] = [];
  joins: IJoin[] = [];
  selectedTab = 0;
  vendors: string[] = [];

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => this.vendors = data.vendors,
        error => console.error('failed to resolve vendors', error));
  }

  ngOnInit() {

  }

  handleConnected(connection: JdbcConnection) {
    this.connection = connection;
    this.selectedTab = connection ? 1 : 0;
  }

  handleSelected(tables: ITableMetaData[]) {
    this.tables = tables;
  }

  handleJoins(joins: IJoin[]) {
    this.joins = joins;
  }

  handleAllTables(tables: ITableMetaData[]) {
    this.allTables = tables;
  }
}