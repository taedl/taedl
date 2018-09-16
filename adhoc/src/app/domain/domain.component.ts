import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { StateService } from '../services/state.service';
import { ConnectionsApiService, IResultTable, ITableMetaData, ITable, JdbcConnection } from '../services/connections-api.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit, OnChanges {

  @Input()
  connection: JdbcConnection;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  tables: ITable[];
  selectedTables: ITableMetaData[] = [];
  resultTable: IResultTable;
  resultTableHeaders: string[];
  tableDataSource = new MatTableDataSource<any>();

  constructor(private stateService: StateService,
              private connectionApiSerice: ConnectionsApiService) { }

  ngOnInit() {
    this.tableDataSource.sort = this.sort;
    this.tableDataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.connection.currentValue) {
      this.connectionApiSerice.tablesMetadata(changes.connection.currentValue)
          .subscribe(result => this.tables = result.map(t => ({table: t, selected: false})),
              error => console.error('failed to get tables', error));
    } else {
      this.tables = [];
    }
  }

  onTableDrop(event: any) {
    const ind = this.tables.indexOf(event.dragData);
    if (ind > -1) {
      this.tables[ind].selected = true;
      this.selectedTables.push(event.dragData.table);
      this.preview();
    }
  }

  preview() {
    this.connectionApiSerice.preview(this.connection, this.selectedTables)
      .subscribe(result => {
        this.resultTable = result;
        this.resultTableHeaders = result.headers;
        this.tableDataSource = new MatTableDataSource(this.tableRows(result));

        setTimeout(() => {
          this.tableDataSource.sort = this.sort;
          this.tableDataSource.paginator = this.paginator;
        });
      }, error => console.log('failed to preview', error));
  }

  isSelected(): boolean {
    return this.selectedTables.length > 0;
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
}
