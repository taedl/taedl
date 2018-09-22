import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IColumn, IJoin, ITableMetaData, JdbcConnection } from '../services/connections-api.service';
import { MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @Input()
  connection: JdbcConnection;

  @Input()
  tables: ITableMetaData[] = [];

  @Input()
  joins: IJoin[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns: IColumn[] = [];
  rows: IColumn[] = [];

  constructor() { }

  ngOnInit() {

  }

  onColumnDrop(event) {
    const ind = this.columns.indexOf(event.dragData);
    if (ind === -1) {
      this.columns.push(event.dragData);
    }
  }

  onRowDrop(event) {
    const ind = this.rows.indexOf(event.dragData);
    if (ind === -1) {
      this.rows.push(event.dragData);
    }
  }

}
