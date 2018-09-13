import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-echart',
  templateUrl: './echart.component.html',
  styleUrls: ['./echart.component.scss']
})
export class EchartComponent implements OnInit {

  option = null;

  constructor() { }

  ngOnInit() {
    this.option = dummy;
  }

  onChartEvent(event: any, type: string) {
    console.log('chart event:', type, event);
  }

}

export const dummy = {
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
        normal: {
          textStyle: {
            fontSize: 20
          }
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
