import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ITable } from '../services/connections-api.service';

@Component({
  selector: 'app-joins',
  templateUrl: './joins.component.html',
  styleUrls: ['./joins.component.scss']
})
export class JoinsComponent implements OnInit, OnChanges {

  @Input()
  tables: ITable[];
  option = null;

  constructor() {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tables.currentValue) {
      this.tables = changes.tables.currentValue;
      this.option = { ...empty };
      const join = this.join;
      this.tables.forEach(t => {
        this.option.series[0].data.push({name: t.table.name});

        t.table.exportedKeys.forEach(exp =>
          this.option.series[0].links.push({
            source: exp.primary.tableName,
            target: exp.foreign.tableName,
            label: {
              show: true,
              formatter: function(params) {
                return `${params.data.source}-${join(params.data)}-${params.data.target}`;
              }
            }
          }));
      });
      console.log(JSON.stringify(this.option));
    }
  }

  join(data) {
    return 'inner';
  }

  onChartEvent(event: any, type: string) {
    switch (type) {
      case 'chartClick':
        console.log('clicked on chart', event);
        return;
      default:
        console.log('other event', event);
        return;
    }
  }
}

const empty = {
  // tooltip: {
  //   formatter: function(params) {
  //     return !params.data.source ? null :
  //       `<div>${params.data.source}<img src="../../assets/inner-join.png" alt="inner join" height="32" />${params.data.target}</div>`;
  //   }
  // },
  series : [
    {
      type: 'graph',
      layout: 'circular',
      symbolSize: 50,
      roam: true,
      label: {
        normal: {
          show: true
        }
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      data: [],
      links: [],
      lineStyle: {
        normal: {
          opacity: 0.9,
          width: 2,
          curveness: 0
        }
      }
    }
  ]
};


const dummy = {
  title: {
    text: 'Dummy Graph'
  },
  tooltip: {
    formatter: function(params) {
      return `<div>${params.data.source}<img src="../../assets/inner-join.png" alt="inner join" height="32" />${params.data.target}</div>`;
    }
  },
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series : [
    {
      type: 'graph',
      layout: 'none',
      symbolSize: 50,
      roam: true,
      label: {
        normal: {
          show: true
        }
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        // normal: {
        //   textStyle: {
        //     fontSize: 20
        //   }
        // }
        formatter: function(params) {
          // console.log('--->', params);
          return 'LABEL';
        }
      },
      data: [{
        name: 'table 1',
        x: 300,
        y: 300
      }, {
        name: 'table 2',
        x: 800,
        y: 300
      }, {
        name: 'table 3',
        x: 550,
        y: 100
      }, {
        name: 'table 4',
        x: 550,
        y: 500
      }],
      links: [{
        source: 0,
        target: 1,
        symbolSize: [5, 20],
        label: {
          normal: {
            show: true
          }
        },
        lineStyle: {
          normal: {
            width: 5,
            curveness: 0.2
          }
        }
      }, {
        source: 'table 2',
        target: 'table 1',
        label: {
          normal: {
            show: true
          }
        },
        lineStyle: {
          normal: { curveness: 0.2 }
        }
      }, {
        source: 'table 1',
        target: 'table 3'
      }, {
        source: 'table 2',
        target: 'table 3'
      }, {
        source: 'table 2',
        target: 'table 4'
      }, {
        source: 'table 1',
        target: 'table 4'
      }],
      lineStyle: {
        normal: {
          opacity: 0.9,
          width: 2,
          curveness: 0
        }
      }
    }
  ]
};
