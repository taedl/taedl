import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IResultTable } from '../services/model';

@Component({
  selector: 'app-crosstab',
  templateUrl: './crosstab.component.html',
  styleUrls: ['./crosstab.component.scss']
})
export class CrosstabComponent implements OnInit, OnChanges {

  @Input()
  data: IResultTable;

  totalsArray: Array<any> = [];
  totalsTemp: Array<any> = [];
  colours = ['#eff6ee', '#fde7ec', '#e6e6ff', '#fff5e6', '#f2f2f2', '#faf9ea', '#e6e6ff', '#ffe6ee', '#ebfafa'];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.data || !this.data.data || !this.data.headers) {
      return;
    }

    this.totalsArray = this.data.data.map((row, ind) => {
      const n = row[0];
      const val = Number(row[row.length - 1 ]);
      return { name: n, value: val, ind: ind};
    }).reduce((x, y) => {
      if (x.length === 0 || x.map(item => item.name).indexOf(y.name) === -1) {
        x.push({name: y.name, value: y.value, index: y.ind});
      } else {
        const yInd = x.map(item => item.name).indexOf(y.name);
        x[yInd] = {name: y.name, value: x[yInd].value + y.value, index: y.ind};
      }
      return x;
    }, []);

    if (this.data.data[0].length > 2) {
      this.totalsTemp = this.data.data.map((row, ind) => {
        const n = row[1];
        const val = Number(row[row.length - 1 ]);
        return { name: n, value: val, ind: ind};
      }).reduce((x, y) => {
        if (x.length === 0 || x.map(item => item.name).indexOf(y.name) === -1) {
          x.push({name: y.name, value: y.value, index: y.ind});
        } else {
          const yInd = x.map(item => item.name).indexOf(y.name);
          x[yInd] = {name: y.name, value: x[yInd].value + y.value, index: y.ind};
        }
        return x;
      }, []);
    }
  }

  grouped(key: string): Array<{}> {
    return this.data.data.filter(item => item[0] === key);
  }

  colour(ind: number): string {
    return this.colours[ind % this.colours.length];
  }

  isNewValue(total, row, ind: number, cind: number, cell: string) {
    return ind === 0 || cind === row.length - 1 || cell !== this.grouped(total.name)[ind - 1][cind] ||
      (cind > 1 && cell === this.grouped(total.name)[ind - 1][cind] &&
        this.grouped(total.name)[ind][cind - 1] !== this.grouped(total.name)[ind - 1][cind - 1])
      && cind !== 1;
  }
}

