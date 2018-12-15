import { Component, OnInit } from '@angular/core';
import { IJoin, ITableMetaData, JdbcConnection } from '../services/model';
import { ActivatedRoute } from '@angular/router';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material';
import { ConnectionsApiService } from '../services/connections-api.service';
import { of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  connection: JdbcConnection;
  tables: ITableMetaData[] = [];
  allTables: ITableMetaData[] = [];
  joins: IJoin[] = [];
  selectedTab = 0;
  vendors: string[] = [];

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private connectionService: ConnectionsApiService) {
    this.route.data.subscribe(data => {
      if (!data.vendors) {
        this.handleError();
      } else {
        this.vendors = data.vendors;
      }
    }, err => this.handleError());
  }

  ngOnInit() {

  }

  handleConnected(connection: JdbcConnection) {
    this.connection = connection;
    this.selectedTab = connection ? 1 : 0;
  }

  handleSelected(tables: ITableMetaData[]) {
    this.tables = tables;
  }

  handleJoins(joins: IJoin[]) {
    this.joins = joins;
  }

  handleAllTables(tables: ITableMetaData[]) {
    this.allTables = tables;
  }

  handleData = data => {
    if (!data) {
      this.handleError();
    } else {
      this.vendors = data;
    }
  }

  fetchVendors() {
    this.connectionService.vendors().pipe(
      map(res => res),
      catchError((err) => {
        return of(null);
      })
    ).subscribe(data => this.handleData(data));
  }

  handleError() {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {data: {
        message: 'Could not get the list of supported vendors from the server.',
        accept: 'Retry?',
        decline: 'Cancel'
      }});
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.fetchVendors();
      }
    });
  }
}
