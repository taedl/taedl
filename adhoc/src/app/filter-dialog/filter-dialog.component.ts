import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NUMERIC_FILTER_TYPES, STRING_FILTER_TYPES, Filter } from '../services/model';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {

  supportedFilterTypes: string[];

  constructor(public dialogRef: MatDialogRef<FilterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public filter: Filter) { }

  ngOnInit() {
    const type = this.filter.column.type.toLowerCase();
    // TODO: FIXME
    this.supportedFilterTypes = type.indexOf('int') !== -1 || type.indexOf('float') !== -1 ||
    type.indexOf('num') !== -1 || type.indexOf('real') !== -1 || type.indexOf('date') !== -1 ?
      NUMERIC_FILTER_TYPES : STRING_FILTER_TYPES;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

