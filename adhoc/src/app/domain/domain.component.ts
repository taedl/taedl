import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { StateService } from '../services/state.service';
import { ConnectionsApiService, ITableMetaData, JdbcConnection } from '../services/connections-api.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit, OnChanges {

  @Input()
  connection: JdbcConnection;

  tables: ITable[];
  selectedTables: ITableMetaData[] = [];
  constructor(private stateService: StateService,
              private connectionApiSerice: ConnectionsApiService) { }

  ngOnInit() {
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
    }
  }

  isSelected(): boolean {
    return this.selectedTables.length > 0;
  }
}

interface ITable {
  table: ITableMetaData;
  selected: boolean;
}
