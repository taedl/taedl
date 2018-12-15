import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  IResultTable,
  ITableMetaData,
  ITable,
  JdbcConnection,
  IJoin,
  JOIN_TYPES, COLOURS
} from '../services/model';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ConnectionsApiService } from '../services/connections-api.service';
import { JoinDialogComponent } from '../join-dialog/join-dialog.component';
import * as _ from 'lodash';
import { errorHandler } from '../error-dialog/error-handler';
import { JoinManualDialogComponent } from '../join-manual-dialog/join-manual-dialog.component';

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
        color: COLOURS.ACCENT,
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
  joinCandidateTables: ITableMetaData[] = [];

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
        }, error => {
          errorHandler(this.dialog, 'Could not get tables metadata: ' +  error.error || error.message, 'OK')
            .subscribe(() => { /* nothing */ });
        });
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
    if (this.selectedTables.length === 0) {
      return;
    }
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
      }, error => {
        console.log('error', error);
        errorHandler(this.dialog, 'Could not generate preview: ' + error.error || error.message, 'OK')
          .subscribe(() => { /* nothing */ });
      });
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
        this.option.series[0].data[ind].itemStyle.color = COLOURS.ACCENT;
      } else {
        this.option.series[0].data[ind].itemStyle.color = COLOURS.PRIMARY;
      }
    });

    this.option = {...this.option};
  }

  vertexColour(table: ITable) {
    if (this.joinCandidateTables.indexOf(table.table) !== -1) {
      return 'orange';
    }
    return table.selected ? COLOURS.ACCENT : COLOURS.PRIMARY;
  }

  initGraph() {
    this.option = _.cloneDeep(empty);
    const that = this;
    this.tables.forEach(t => {
      this.option.series[0].data.push({
        name: t.table.name,
        itemStyle: {
          color: this.vertexColour(t)
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

  addJoin(j: IJoin) {
    const reverse = {
      primaryKey: j.foreignKey,
      foreignKey: j.primaryKey,
      type: j.type === JOIN_TYPES.INNER || j.type === JOIN_TYPES.FULL ? j.type :
        j.type === JOIN_TYPES.LEFT ? JOIN_TYPES.RIGHT : JOIN_TYPES.LEFT
    };
    this.joins.push(j);
    this.joins.push(reverse);

    const ind = this.tables.map(item => item.table.name).indexOf(j.primaryKey.tableName);
    const added = {
      primary: {
        name: j.primaryKey.name,
        tableName: j.primaryKey.tableName,
        type: null,
        columnSize: null
      },
      foreign: {
        name: j.foreignKey.name,
        tableName: j.foreignKey.tableName,
        type: null,
        columnSize: null
      }
    };
    if (this.tables[ind].table.exportedKeys.indexOf(added) === -1) {
      this.tables[ind].table.exportedKeys.push(added);
    }

    this.notifyJoins.emit(this.joins);
  }

  join(data): string {
    const matchedPrimaryToForeign = this.joins.filter(item => item.primaryKey.tableName === data.source &&
      item.foreignKey.tableName === data.target);
    const matchedForeignToPrimary = this.joins.filter(item => item.foreignKey.tableName === data.source &&
      item.primaryKey.tableName === data.target);
    if (matchedForeignToPrimary.length !== 1 && matchedPrimaryToForeign.length !== 1) {
      // unknown join
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
        } else if (event.dataType === 'node') {
          const table: ITableMetaData = this.tables.map(t => t.table).filter(t => t.name === event.data.name)[0];
          this.processJoinCandidates(table);
        }
        return;
      default:
        return;
    }
  }

  processJoinCandidates(table: ITableMetaData) {
    const ind = this.joinCandidateTables.indexOf(table);
    if (ind !== -1) {
      this.joinCandidateTables.splice(ind, 1);
      this.initGraph();
      return;
    }

    this.joinCandidateTables.push(table);
    this.initGraph();
    if (this.joinCandidateTables.length === 2) {
      this.openManualJoinDialog();
    }
  }

  openManualJoinDialog(): void {
    const dialogRef = this.dialog.open(JoinManualDialogComponent, {data: this.joinCandidateTables });
    dialogRef.afterClosed().subscribe((result: IJoin) => {
      console.log('manual join: ', result);
      if (!result) {
        return;
      }
      this.addJoin(result);
      this.joinCandidateTables = [];
      this.initGraph();
      if (this.selectedTables.length) {
        this.preview();
      }
    });
  }

  openJoinDialog(join: IJoin): void {

    if (!this.selectedTables.length) {
      errorHandler(this.dialog, 'Please select some tables to preview first.', 'OK').subscribe(() => {});
      return;
    }

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
