import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AdvancedChartConfig } from '../services/model';

@Component({
  selector: 'app-echart',
  templateUrl: './echart.component.html',
  styleUrls: ['./echart.component.scss']
})
export class EchartComponent implements OnInit, OnChanges {

  @Input()
  table;

  @Input()
  config: AdvancedChartConfig;

  option = null;
  defaultGroupByTwoColumnsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: []
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: {show: true},
        dataView: {
          show: true,
          readOnly: false,
          title: 'edit'
        },
        magicType: {
          show: true,
          type: ['line', 'bar', 'stack', 'tiled'],
          title: {line: 'line', bar: 'bar', stack: 'stack', tiled: 'tiled'}
        },
        restore: {
          show: true,
          title: 'refresh'
        },
        saveAsImage: {
          show: true,
          title: 'save'
        }
      }
    },
    calculable: true,
    xAxis: [{
      type: 'category',
      axisTick: {show: false},
      data: []
    }],
    yAxis: [{
      type: 'value'
    }],
    series: []
  };

  defaultGroupByOneColumnOption = {
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: {show: true},
        dataView: {
          show: true,
          readOnly: false,
          title: 'edit'
        },
        magicType: {
          show: true,
          type: ['line', 'bar', 'pie'],
          title: {line: 'line', bar: 'bar', pie: 'pie'}
        },
        restore: {
          show: true,
          title: 'refresh'
        },
        saveAsImage: {
          show: true,
          title: 'save'
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: []
    },
    xAxis: {
      type: 'category',
      axisTick: {show: false},
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [],
      type: 'bar'
    }]
  };

  defaultSunburstOption = {
    visualMap: {
      type: 'continuous',
    },
    series: {
      type: 'sunburst',
      data: [],
      radius: [0, '100%'],
      label: {
        rotate: 'radial'
      }
    }
  };

  constructor() { }

  ngOnInit() {
  }

  generateOptions() {
    if (!this.table) {
      return;
    } else if (this.table.headers.length === 2) {
      this.generateOptionsGroupByOneColumn();
    } else if (this.table.headers.length === 3) {
      this.generateOptionsGroupByTwoColumns();
    } else if (this.config.selected.toString() === 'ComplexChartTypes.DRILLDOWN' && this.config.indexes.length === 2) {
      this.generateOptionsGroupByTwoColumns();
    } else {
      this.generateOptionsSunburst();
    }
  }

  generateOptionsGroupByOneColumn() {
    this.option = { ...this.defaultGroupByOneColumnOption};
    this.option.xAxis.data = Array.from(new Set(this.table.data.map(record => record[0])));
    this.option.series[0].data = Array.from(new Set(this.table.data.map(record => record[1])));
    this.option.legend.data = this.option.series[0].data;
  }

  generateOptionsGroupByTwoColumns() {
    this.option = { ...this.defaultGroupByTwoColumnsOption};
    const groupBy1Index = this.config.indexes.length === 2 ? this.config.indexes[0] : 0;
    const groupBy2Index = this.config.indexes.length === 2 ? this.config.indexes[1] : 1;

    const groupBy1 = Array.from(new Set(this.table.data.map(record => record[groupBy1Index])));
    const groupBy2 = Array.from(new Set(this.table.data.map(record => record[groupBy2Index])));
    this.option.xAxis[0].data = groupBy1;
    this.option.legend.data = groupBy2;

    this.option.series = groupBy2.map(head => {
        return {
          name: head,
          type: 'bar',
          data: new Array<number>(groupBy1.length)
        };
      }
    );

    this.table.data.forEach(record => {
      const g1 = record[groupBy1Index];
      const g2 = record[groupBy2Index];
      const val = record[record.length - 1];
      const seriesInd = this.option.series.map(s => s.name).indexOf(g2);
      const series = this.option.series[seriesInd];
      const ind = groupBy1.indexOf(g1);
      if (ind < 0) {
        throw new Error('Could not find group2 index in chart');
      }
      series.data[ind] = series.data[ind] ? series.data[ind] + parseFloat(val) : parseFloat(val);
    });
  }

  generateOptionsSunburst() {
    this.option = Object.assign({}, this.defaultSunburstOption);
    const sunburst = [];
    this.formatForSunburst(this.table.data, sunburst);
    this.option.series.data = sunburst;
  }


  private formatForSunburst(data, allKeys) {
    if (data[0].length === 1) {
      return;
    }

    const keys = new Set(data.map(row => row[0]));
    keys.forEach(key => {
      const sub = data.filter(row => row[0] === key).map(row => row.slice(1, row.length));
      const total = sub.map(row => row[row.length - 1]).reduce((sum, val) => sum + parseFloat(val), 0);
      allKeys.push({name: key, value: total, children: []});
      const nextKeys = allKeys.filter(k => k.name === key)[0];
      this.formatForSunburst(sub, nextKeys.children);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('table' in changes) {
      this.table = changes.table.currentValue;
      this.option = null;
      this.generateOptions();
    }

    if ('config' in changes) {
      this.config = changes.config.currentValue;
    }
  }
}

