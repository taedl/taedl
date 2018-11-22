import { Component, Inject, OnInit } from '@angular/core';
import { Aggregation, IAggregatedColumn, IJoin } from '../services/model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-aggregation-dialog',
  templateUrl: './aggregation-dialog.component.html',
  styleUrls: ['./aggregation-dialog.component.scss']
})
export class AggregationDialogComponent implements OnInit {

  aggregationTypes = Object.keys(Aggregation);

  constructor(public dialogRef: MatDialogRef<AggregationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public row: IAggregatedColumn) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
