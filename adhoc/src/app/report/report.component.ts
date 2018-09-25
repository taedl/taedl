import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Aggregation, IAggregatedColumn, IColumn, IJoin, ITableMetaData, JdbcConnection } from '../services/model';
import { MatPaginator, MatSort } from '@angular/material';
import { ReportsService } from '../services/reports.service';

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
  rows: IAggregatedColumn[] = [];

  constructor(private reportsService: ReportsService) { }

  ngOnInit() {

  }

  onColumnDrop(event) {
    const ind = this.columns.indexOf(event.dragData);
    if (ind === -1) {
      this.columns.push(event.dragData);
      this.reportsService.table(this.connection, this.columns, null, this.joins)
        .subscribe(result => console.log('result', result), error => console.error(error));
    }
  }

  onRowDrop(event) {
    const ind = this.rows.indexOf(event.dragData);
    if (ind === -1) {
      console.log({aggregation: Aggregation.COUNT, column: event.dragData});
      this.rows.push({aggregation: Aggregation.COUNT, column: event.dragData});
    }
  }

}
