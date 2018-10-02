import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Aggregation, IAggregatedColumn, IColumn, IJoin, IResultTable, ITableMetaData, JdbcConnection } from '../services/model';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ReportsApiService } from '../services/reports-api.service';

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
  allTables: ITableMetaData[] = [];

  @Input()
  joins: IJoin[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns: IColumn[] = [];
  rows: IAggregatedColumn[] = [];
  resultTableHeaders: string[];
  resultTable: IResultTable;
  tableDataSource = new MatTableDataSource<any>();
  reportType: string;

  constructor(private reportsService: ReportsApiService) { }

  ngOnInit() {
    this.tableDataSource.sort = this.sort;
    this.tableDataSource.paginator = this.paginator;
    this.reportType = 'table';
  }

  onColumnDrop(event) {
    const ind = this.columns.indexOf(event.dragData);
    if (ind === -1) {
      this.columns.push(event.dragData);
      this.reportsService.table(this.connection, this.allTables, this.columns, this.rows, this.joins)
        .subscribe(result => {
          this.resultTable = result;
          this.resultTableHeaders = result.headers;
          this.tableDataSource = new MatTableDataSource(this.tableRows(result));
          setTimeout(() => {
            this.tableDataSource.sort = this.sort;
            this.tableDataSource.paginator = this.paginator;
          });
        }, error => console.error(error));
    }
  }

  private tableRows(tableReport: IResultTable): any[] {
    const rows = [];
    const headers = tableReport.headers;
    tableReport.data.forEach(r => {
      const obj = {};
      r.forEach((item, ind) => {
        obj[headers[ind]] = item;
      });
      rows.push(obj);
    });
    return rows;
  }

  onRowDrop(event) {
    const ind = this.rows.indexOf(event.dragData);
    if (ind === -1) {
      this.rows.push({aggregation: Aggregation.COUNT, column: event.dragData});
      this.reportsService.table(this.connection, this.allTables, this.columns, this.rows, this.joins)
        .subscribe(result => {
          console.log('adhoc result', result);
          this.resultTableHeaders = result.headers;
          this.tableDataSource = new MatTableDataSource(this.tableRows(result));

          setTimeout(() => {
            this.tableDataSource.sort = this.sort;
            this.tableDataSource.paginator = this.paginator;
          });
        }, error => console.error(error));
    }
  }


  isTable() {
    return this.rows.length === 0;
  }

  onReportTypeChange() {
    console.log('repor type', this.reportType);
  }
}
