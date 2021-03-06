import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IJoin } from '../services/model';

@Component({
  selector: 'app-join-dialog',
  templateUrl: './join-dialog.component.html',
  styleUrls: ['./join-dialog.component.scss']
})
export class JoinDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<JoinDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public join: IJoin) {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
