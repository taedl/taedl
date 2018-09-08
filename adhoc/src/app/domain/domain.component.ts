import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { StateService } from '../services/state.service';
import { ConnectionsApiService, JdbcConnection } from '../services/connections-api.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit, OnChanges {

  @Input()
  connection: JdbcConnection;

  tables: string[];
  selectedTables: string[] = [];
  constructor(private stateService: StateService,
              private connectionApiSerice: ConnectionsApiService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.connection.currentValue) {
      this.connectionApiSerice.tables(changes.connection.currentValue)
          .subscribe(result => this.tables = result,
              error => console.error('failed to get tables', error));
    } else {
      this.tables = [];
    }
  }

  onTableDrop(event: any) {
    const ind = this.tables.indexOf(event.dragData);
    if (ind > -1) {
      this.tables.splice(ind, 1);
      this.selectedTables.push(event.dragData);
    }
  }

  isSelected(): boolean {
    return this.selectedTables.length > 0;
  }
}
