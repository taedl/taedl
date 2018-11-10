import { Component, OnInit } from '@angular/core';
import { IJoin, ITableMetaData, JdbcConnection } from '../services/model';
import { ActivatedRoute } from '@angular/router';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material';
import { catchError } from 'rxjs/operators';
import { Error } from 'tslint/lib/error';
import { throwError } from 'rxjs';
import { of } from 'rxjs';

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

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.route.data.subscribe(data => {
      if (!data.vendors.length) {
        this.handleError();
      }
      this.vendors = data.vendors;
    }, error => this.handleError());
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

  handleError() {
    console.log('handling error');
    const dialogRef = this.dialog.open(ErrorDialogComponent, {data: {
        message: 'Could not get list of supported vendors from the server',
        accept: 'Retry?',
        decline: 'Cancel'
      }});
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (!res) {
        return;
      }
      console.log('need to reset all');
    });
  }
}
