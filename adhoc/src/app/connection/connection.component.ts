import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConnectionsApiService, JdbcConnection } from '../services/connections-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../services/state.service';

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
              private formBuilder: FormBuilder, private stateService: StateService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      endpoint: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required],
      vendor: ['', Validators.required]
    });

    this.connectionsApiService.vendors()
      .subscribe(vendors => this.vendors = vendors);
  }

  onSubmit() {
    if (this.form.valid) {
      this.connectionsApiService.testConnection(this.form.value)
        .subscribe(result => this.connect(), error => this.disconnect());
    }
    this.isFormSubmitAttempt = true;
  }

  connect() {
    this.isConnected = true;
    this.stateService.connect(this.form.value);
    this.notifyConnected.emit(this.form.value);
  }

  disconnect() {
    this.isConnected = false;
    this.stateService.disconnect();
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

// public endpoint: string,
//   public user: string,
//   public password: string,
//   public vendor: string)
