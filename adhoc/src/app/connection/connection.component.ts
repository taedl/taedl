import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConnectionsApiService } from '../services/connections-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../services/state.service';
import { JdbcConnection } from '../services/model';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  @Output()
  notifyConnected: EventEmitter<JdbcConnection> = new EventEmitter<JdbcConnection>();

  vendors: string[];
  form: FormGroup;
  isFormSubmitAttempt: boolean;
  isConnected: boolean;
  hide = true;

  constructor(private connectionsApiService: ConnectionsApiService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      endpoint: ['', Validators.required],
      database:  ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required],
      vendor: ['', Validators.required]
    });

    this.connectionsApiService.vendors()
      .subscribe(vendors => this.vendors = vendors);
  }

  onSubmit() {
    if (this.form.valid) {
      const connection = new JdbcConnection(this.form.get('endpoint').value, this.form.get('database').value,
        this.form.get('user').value, this.form.get('password').value, this.form.get('vendor').value);

      this.connectionsApiService.testConnection(connection)
        .subscribe(result => {
          this.isFormSubmitAttempt = true;
          this.connect();
        }, error => this.disconnect());
    }
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

}
