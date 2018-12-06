import { Component, Inject, OnInit } from '@angular/core';
import { JoinDialogComponent } from '../join-dialog/join-dialog.component';
import { IJoin, ITableMetaData, JOIN_TYPES } from '../services/model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-join-manual-dialog',
  templateUrl: './join-manual-dialog.component.html',
  styleUrls: ['./join-manual-dialog.component.scss']
})
export class JoinManualDialogComponent implements OnInit {

  join: IJoin;

  constructor(public dialogRef: MatDialogRef<JoinDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public candidates: ITableMetaData[]) {
    this.join = {
      primaryKey: {
        tableName: this.candidates[0].name,
        name: null
      },
      foreignKey: {
        tableName: this.candidates[1].name,
        name: null
      },
      type: JOIN_TYPES.INNER
    };
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
