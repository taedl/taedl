import { Component, OnChanges, OnInit } from '@angular/core';
import { StateService } from '../services/state.service';
import { ConnectionsApiService } from '../services/connections-api.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  tables;
  constructor(private stateService: StateService, private connectionApiSerice: ConnectionsApiService) { }

  ngOnInit() {
  }

  isConnected() {
    return this.stateService.isConnected();
  }

  getTables() {
    this.connectionApiSerice.tables(this.stateService.getConnection())
      .subscribe(result => this.tables = result,
          error => console.error('failed to get tables', error));
  }
}
