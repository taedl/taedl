import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  Aggregation, ChartConfig, ComplexChartTypes, Filter, FILTER_TYPES, IAggregatedColumn, IColumn,
  IJoin, IResultTable, ITableMetaData, JdbcConnection
} from '../services/model';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ReportsApiService } from '../services/reports-api.service';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { errorHandler } from '../error-dialog/error-handler';
import { AggregationDialogComponent } from '../aggregation-dialog/aggregation-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnChanges {

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
  tableDataSource: MatTableDataSource<any>;
  reportType: string;
  chartConfig: ChartConfig = new ChartConfig(ComplexChartTypes.SUNBURST, []);
  filters: Filter[] = [];

  droppedColumns: IColumn[] = [];
  droppedRows: IColumn[] = [];

  constructor(private reportsService: ReportsApiService, public dialog: MatDialog) { }

  ngOnInit() {
    this.tableDataSource = new MatTableDataSource<any>();
    this.tableDataSource.sort = this.sort;
    this.tableDataSource.paginator = this.paginator;
    this.reportType = 'table';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.connection) {
      this.reset();
    }
  }

  drop(event: CdkDragDrop<any>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.id === 'rowsList') {
        this.onRowDrop(event.item.data);
      } else if (event.container.id === 'columnsList') {
        this.onColumnDrop(event.item.data);
      } else if (event.container.id === 'filtersList') {
        this.onFilterDrop(event.item.data);
      }
    }
  }

  onColumnDrop(dragData) {
    const ind = this.columns.indexOf(dragData);
    if (ind === -1) {
      this.columns.push(dragData);
      this.updateTable();
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

  updateTable() {
    if (this.reportsService.isEnoughToRequest(this.connection, this.allTables, this.columns)) {
      this.fetchTable();
    } else {
      if (!this.connection) {
        this.reset();
      } else {
        this.resetTable();
      }
    }
  }

  fetchTable() {
    this.reportsService.table(this.connection, this.allTables, this.columns, this.rows, this.joins, this.filters)
      .subscribe(result => {
        this.resultTable = result;
        this.resultTableHeaders = result.headers;
        this.tableDataSource = new MatTableDataSource(this.tableRows(result));
        setTimeout(() => {
          this.tableDataSource.sort = this.sort;
          this.tableDataSource.paginator = this.paginator;
        });
      }, error => {
        errorHandler(this.dialog, 'Could not generate table: ' + error.message, 'OK')
          .subscribe(() => { /* nothing */ });
      });
  }

  reset() {
    this.resetTable();
    this.rows = [];
    this.columns = [];
    this.filters = [];
    this.reportType = 'table';
  }

  resetTable() {
    this.resultTable = null;
    this.resultTableHeaders = null;
    this.tableDataSource = null;
  }

  onRowDrop(dragData) {
    const ind = this.rows.map(row => row.column).indexOf(dragData);
    if (ind === -1) {
      this.rows.push({aggregation: Aggregation.COUNT, column: dragData});
      this.updateTable();
    }
  }

  isSelected(item: IColumn, type: string) {
    return type === 'row' ? this.rows.map(r => r.column).indexOf(item) !== -1 : this.columns.indexOf(item) !== -1;
  }

  onFilterDrop(dragData) {
    if (this.filters.filter(f => f.column === dragData && !f.condition && !f.constant).length > 0) {
      return;
    }
    this.openFilterDialog(new Filter(dragData));
  }

  onFilterClick(filter: Filter) {
    this.openFilterDialog(filter);
  }

  openFilterDialog(filter: Filter) {
    const dialogRef = this.dialog.open(FilterDialogComponent, {data: filter});
    dialogRef.afterClosed().subscribe((f: Filter) => {
      if (!f) {
        return;
      }
      const ind = this.filters.indexOf(filter);
      if (ind === -1) {
        this.filters.push(f);
      } else {
        this.filters[ind] = f;
      }
      this.updateTable();
    });
  }

  cancelColumn(column) {
    const ind = this.columns.indexOf(column);
    this.columns.splice(ind, 1);
    this.updateTable();
  }

  cancelRow(row) {
    const ind = this.rows.indexOf(row);
    this.rows.splice(ind, 1);
    this.updateTable();
  }

  cancelFilter(f: Filter) {
    const ind = this.filters.indexOf(f);
    this.filters.splice(ind, 1);
    this.updateTable();
  }

  isTable() {
    return this.rows.length === 0;
  }

  onReportTypeChange() {
    if (this.reportType === 'table') {
      this.updateTable();
    }
  }

  describeFilter(f: Filter) {
    return `${f.column.tableName}.${f.column.name} ${FILTER_TYPES[f.condition]} ${f.constant}`;
  }

  moveRow(row: IAggregatedColumn, direction: string) {
    const from = this.rows.indexOf(row);
    const cutOut = this.rows.splice(from, 1) [0];
    const to = direction === 'left' ? from - 1 : from + 1;
    this.rows.splice(to, 0, cutOut);
    this.updateTable();
  }

  moveColumn(col: IColumn, direction: string) {
    const from = this.columns.indexOf(col);
    const cutOut = this.columns.splice(from, 1) [0];
    const to = direction === 'left' ? from - 1 : from + 1;
    this.columns.splice(to, 0, cutOut);
    this.updateTable();
  }

  setAggregation = (row: IAggregatedColumn) => {

    const dialogRef = this.dialog.open(AggregationDialogComponent, {data: row});
    dialogRef.afterClosed().subscribe((updRow: IAggregatedColumn) => {

      if (!updRow) {
        return;
      }

      row = { ...updRow };
      this.updateTable();
    });
  }
}
