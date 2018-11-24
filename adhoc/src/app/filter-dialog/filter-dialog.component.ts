import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NUMERIC_FILTER_TYPES, STRING_FILTER_TYPES, Filter, NUMERIC_TYPES } from '../services/model';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {

  supportedFilterTypes: string[];

  constructor(public dialogRef: MatDialogRef<FilterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public filter: Filter) { }


  isNumeric = val => NUMERIC_TYPES.map(item => val.indexOf(item)).filter(item => item !== -1).length > 0;

  ngOnInit() {
    const type = this.filter.column.type.toLowerCase();
    this.supportedFilterTypes = this.isNumeric(type) ? NUMERIC_FILTER_TYPES : STRING_FILTER_TYPES;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

