import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConnectionsApiService } from '../services/connections-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JdbcConnection } from '../services/model';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  @Output()
  notifyConnected: EventEmitter<JdbcConnection> = new EventEmitter<JdbcConnection>();

  @Input()
  vendors: string[];

  form: FormGroup;
  isFormSubmitAttempt = false;
  isConnected = false;
  hide = true;

  constructor(private connectionsApiService: ConnectionsApiService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      endpoint: ['', Validators.required],
      database:  ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required],
      vendor: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.testConnection();
    }
  }

  testConnection() {
    const connection = new JdbcConnection(this.form.get('endpoint').value, this.form.get('database').value,
      this.form.get('user').value, this.form.get('password').value, this.form.get('vendor').value);
    this.connectionsApiService.testConnection(connection)
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log('err', err);
          return of(null);
        }))
      .subscribe(result => {
        this.isFormSubmitAttempt = true;
        if (result) {
          this.connect();
        } else {
          this.handleError();
        }
    }, () => this.disconnect());
  }

  connect() {
    this.isConnected = true;
    this.notifyConnected.emit(new JdbcConnection(this.form.get('endpoint').value, this.form.get('database').value,
      this.form.get('user').value, this.form.get('password').value, this.form.get('vendor').value));
  }

  disconnect() {
    this.isConnected = false;
    this.isFormSubmitAttempt = true;
    this.notifyConnected.emit(null);
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.isFormSubmitAttempt)
    );
  }

  isFieldsSet() {
    const fields: JdbcConnection = this.form.value;
    return fields.endpoint && fields.password && fields.user && fields.vendor;
  }

  handleError(err?) {
    const message = err && err.message ? err.message : 'Could not connect to the server.';
    this.disconnect();
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: {
        message,
        accept: 'Retry?',
        decline: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.testConnection();
      }
    });
  }
}
