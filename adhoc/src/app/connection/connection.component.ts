import { Component, OnInit } from '@angular/core';
import { ConnectionsApiService } from '../services/connections-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  vendors: string[];
  form: FormGroup;
  isFormSubmitAttempt: boolean;
  isConnected: boolean;

  constructor(private connectionsApiService: ConnectionsApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      endpoint: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required],
      vendor: ['', Validators.required]
    });

    this.connectionsApiService.getVendors()
      .subscribe(vendors => this.vendors = vendors);
  }

  onSubmit() {
    if (this.form.valid) {
      this.connectionsApiService.testConnection(this.form.value)
        .subscribe(result => this.isConnected = true,
            error => this.isConnected = false);
    }
    this.isFormSubmitAttempt = true;
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.isFormSubmitAttempt)
    );
  }

}

// public endpoint: string,
//   public user: string,
//   public password: string,
//   public vendor: string)
