import { Component, Inject, OnInit } from '@angular/core';
import { Aggregation, IAggregatedColumn, IJoin, NUMERIC_TYPES } from '../services/model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-aggregation-dialog',
  templateUrl: './aggregation-dialog.component.html',
  styleUrls: ['./aggregation-dialog.component.scss']
})
export class AggregationDialogComponent implements OnInit {

  aggregationTypes = Object.keys(Aggregation);
  isNumericType: boolean;

  constructor(public dialogRef: MatDialogRef<AggregationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public row: IAggregatedColumn) {
    this.isNumericType = this.isNumeric(row.column.type);
  }

  isNumeric = val => NUMERIC_TYPES.map(item => val.indexOf(item)).filter(item => item !== -1).length > 0;

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
