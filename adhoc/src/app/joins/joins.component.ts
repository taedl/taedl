import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IJoin, ITable, JOIN_TYPES } from '../services/connections-api.service';

@Component({
  selector: 'app-joins',
  templateUrl: './joins.component.html',
  styleUrls: ['./joins.component.scss']
})
export class JoinsComponent implements OnInit, OnChanges {

  @Input()
  tables: ITable[];

  @Output()
  notifyJoinsChanged: EventEmitter<IJoin[]> = new EventEmitter<IJoin[]>();

  option = null;
  joins: IJoin[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tables.currentValue) {
      this.initGraph(changes)
      this.initJoins();
    }
  }

  initGraph(changes: SimpleChanges) {
    this.tables = changes.tables.currentValue;
    this.option = { ...empty };
    const that = this;
    this.tables.forEach(t => {
      this.option.series[0].data.push({
        name: t.table.name,
        itemStyle: {
          color: t.selected ? '#e91e63' : '#3f51b5'
        }
      });

      t.table.exportedKeys.forEach(exp =>
        this.option.series[0].links.push({
          source: exp.primary.tableName,
          target: exp.foreign.tableName,
          label: {
            show: true,
            formatter: function(params) {
              return `${that.join(params.data)}`;
            }
          }
        }));
    });
  }

  initJoins() {
    if (this.joins.length) {
      return;
    }

    const joins = [];

    this.tables.map(t => t.table.exportedKeys.forEach(exp => joins.push({
      primaryKey: {tableName: exp.primary.tableName, name: exp.primary.name},
      foreignKey: {tableName: exp.foreign.tableName, name: exp.foreign.name},
      type: JOIN_TYPES.INNER
    })));

    const combined = [ ...joins];
    joins.forEach(j => combined.push(
      { primaryKey: j.foreignKey,
        foreignKey: j.primaryKey,
        type: j.type === JOIN_TYPES.INNER || j.type === JOIN_TYPES.FULL ? j.type :
          j.type === JOIN_TYPES.LEFT ? JOIN_TYPES.RIGHT : JOIN_TYPES.LEFT
      }
    ));

    this.joins = combined;
    console.log('joins', this.joins);
    console.log('combined: ', combined);

    this.notifyJoinsChanged.emit(this.joins);
  }

  join(data): string {
    const matchedPrimaryToForeign = this.joins.filter(item => item.primaryKey.tableName === data.source &&
      item.foreignKey.tableName === data.target);
    const matchedForeignToPrimary = this.joins.filter(item => item.foreignKey.tableName === data.source &&
      item.primaryKey.tableName === data.target);
    if (matchedForeignToPrimary.length !== 1 && matchedPrimaryToForeign.length !== 1) {
      throw new Error('Unknown join');
    }
    return matchedPrimaryToForeign.length === 1 ? matchedPrimaryToForeign[0].type : matchedForeignToPrimary[0].type;
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
      itemStyle: {
        color: '#e91e63',
        // color: '#3f51b5',
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

