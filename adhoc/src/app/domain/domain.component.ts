import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  IResultTable,
  ITableMetaData,
  ITable,
  JdbcConnection,
  IJoin,
  JOIN_TYPES
} from '../services/model';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ConnectionsApiService } from '../services/connections-api.service';
import { JoinDialogComponent } from '../join-dialog/join-dialog.component';
import * as _ from 'lodash';

const empty = {
  // tooltip: {
  //   formatter: function(params) {
  //     return !params.data.source ? null :
  //       `<div>${params.data.source}<img src="../../assets/inner-join.png" alt="inner join" height="32" />${params.data.target}</div>`;
  //   }
  // },
  series : [
    {
      type: 'graph',
      layout: 'circular',
      symbolSize: 50,
      roam: true,
      label: {
        normal: {
          show: true
        }
      },
      itemStyle: {
        color: '#e91e63',
        // color: '#3f51b5',
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      data: [],
      links: [],
      lineStyle: {
        normal: {
          opacity: 0.9,
          width: 2,
          curveness: 0
        }
      }
    }
  ]
};

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit, OnChanges {

  @Input()
  connection: JdbcConnection;

  @Output()
  notifySelected: EventEmitter<ITableMetaData[]> = new EventEmitter<ITableMetaData[]>();

  @Output()
  notifyJoins: EventEmitter<IJoin[]> = new EventEmitter<IJoin[]>();

  @Output()
  notifyAllTables: EventEmitter<ITableMetaData[]> = new EventEmitter<ITableMetaData[]>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  tables: ITable[];
  selectedTables: ITableMetaData[] = [];
  resultTable: IResultTable;
  resultTableHeaders: string[];
  tableDataSource = new MatTableDataSource<any>();
  joins: IJoin[] = [];
  joinChain: string[] = [];

  option = null;

  constructor(private connectionApiSerice: ConnectionsApiService, public dialog: MatDialog) { }

  ngOnInit() {
    this.tableDataSource.sort = this.sort;
    this.tableDataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.connection.currentValue) {
      this.connectionApiSerice.tablesMetadata(changes.connection.currentValue)
        .subscribe(result => {
            this.tables = result.map(t => ({ table: t, selected: false }));
            this.notifyAllTables.emit(result);
            this.initGraph();
            this.initJoins();
          }, error => console.error('failed to get tables', error));
    } else {
      this.reset();
    }
  }

  reset() {
    this.resultTable = null;
    this.tables = [];
    this.joins = [];
    this.joinChain = [];
    this.selectedTables = [];
    this.resultTableHeaders = [];
    this.option = {...empty};

    this.notifySelected.emit(this.selectedTables);
    this.notifyJoins.emit(this.joins);
    this.notifyAllTables.emit([]);
  }

  onTableDrop(event: any) {
    const ind = this.tables.indexOf(event.dragData);
    if (ind > -1) {
      this.tables[ind].selected = true;
      this.selectedTables.push(event.dragData.table);
      this.notifySelected.emit(this.selectedTables);
      this.preview();
    }
  }

  cancelTable(t: ITableMetaData) {
    const indSelected = this.selectedTables.indexOf(t);
    this.selectedTables.splice(indSelected, 1);
    const indAll = this.tables.map(table => table.table).indexOf(t);
    this.tables[indAll].selected = false;
    this.notifySelected.emit(this.selectedTables);
    this.preview();
  }

  preview() {
    this.connectionApiSerice.preview(this.connection, this.selectedTables, this.joins)
      .subscribe(result => {
        this.resultTable = result.table;
        this.resultTableHeaders = result.table.headers;
        this.tableDataSource = new MatTableDataSource(this.tableRows(result.table));
        this.joinChain = result.joinChain;
        this.updateGraph();

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

  updateGraph() {
    this.tables.forEach(t => {
      const ind = this.option.series[0].data.map(d => d.name).indexOf(t.table.name);
      const chainInd = this.joinChain.indexOf(t.table.name);
      if (chainInd !== -1 || t.selected) {
        this.option.series[0].data[ind].itemStyle.color = '#e91e63';
      } else {
        this.option.series[0].data[ind].itemStyle.color = '#3f51b5';
      }
    });

    this.option = {...this.option};
  }

  initGraph() {
    this.option = _.cloneDeep(empty);
    const that = this;
    this.tables.forEach(t => {
      this.option.series[0].data.push({
        name: t.table.name,
        itemStyle: {
          color: t.selected ? '#e91e63' : '#3f51b5'
        }
      });

      t.table.exportedKeys.forEach(exp =>
        this.option.series[0].links.push({
          source: exp.primary.tableName,
          target: exp.foreign.tableName,
          label: {
            show: true,
            formatter: function(params) {
              return `${that.join(params.data)}`;
            }
          }
        }));
    });
  }

  initJoins() {
    if (this.joins.length) {
      return;
    }

    const joins = [];

    this.tables.map(t => t.table.exportedKeys.forEach(exp => joins.push({
      primaryKey: {tableName: exp.primary.tableName, name: exp.primary.name},
      foreignKey: {tableName: exp.foreign.tableName, name: exp.foreign.name},
      type: JOIN_TYPES.INNER
    })));

    const combined = [ ...joins];
    joins.forEach(j => combined.push(
      { primaryKey: j.foreignKey,
        foreignKey: j.primaryKey,
        type: j.type === JOIN_TYPES.INNER || j.type === JOIN_TYPES.FULL ? j.type :
          j.type === JOIN_TYPES.LEFT ? JOIN_TYPES.RIGHT : JOIN_TYPES.LEFT
      }
    ));

    this.joins = combined;
    this.notifyJoins.emit(this.joins);
  }

  join(data): string {
    const matchedPrimaryToForeign = this.joins.filter(item => item.primaryKey.tableName === data.source &&
      item.foreignKey.tableName === data.target);
    const matchedForeignToPrimary = this.joins.filter(item => item.foreignKey.tableName === data.source &&
      item.primaryKey.tableName === data.target);
    if (matchedForeignToPrimary.length !== 1 && matchedPrimaryToForeign.length !== 1) {
      // throw new Error('Unknown join');
      console.error('unknown join', data);
    }
    return matchedPrimaryToForeign.length === 1 ? matchedPrimaryToForeign[0].type : matchedForeignToPrimary[0].type;
  }

  onChartEvent(event: any, type: string) {
    switch (type) {
      case 'chartClick':
        if (event.dataType === 'edge') {
          const join: IJoin = this.joins.filter(j =>
            j.primaryKey.tableName === event.data.source && j.foreignKey.tableName === event.data.target ||
            j.primaryKey.tableName === event.data.target && j.foreignKey.tableName === event.data.source)[0];
          this.openJoinDialog(join);
        }
        return;
      default:
        return;
    }
  }

  openJoinDialog(join: IJoin): void {
    const dialogRef = this.dialog.open(JoinDialogComponent, { data: join });

    dialogRef.afterClosed().subscribe((result: IJoin) => {
      if (!result) {
        return;
      }
      let ind1, ind2;
      this.joins.forEach((j, ind) => {
        if (j.primaryKey === result.primaryKey && j.foreignKey === result.foreignKey) {
          ind1 = ind;
        } else if (j.foreignKey === result.primaryKey && j.primaryKey === result.foreignKey) {
          ind2 = ind;
        }
      });

      if (!ind1 || !ind2 ) {
        throw new Error('Could not change join type');
      }

      const oppositeJoin: IJoin = {
        primaryKey: result.foreignKey,
        foreignKey: result.primaryKey,
        type: (result.type === JOIN_TYPES.INNER || result.type === JOIN_TYPES.FULL) ? result.type :
          result.type === JOIN_TYPES.RIGHT ? JOIN_TYPES.LEFT : JOIN_TYPES.RIGHT
      };
      this.joins[ind1] = result;
      this.joins[ind2] = oppositeJoin;
      this.updateGraph();
      this.preview();
    });
  }
}
