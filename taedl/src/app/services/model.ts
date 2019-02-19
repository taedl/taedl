export interface IResultTable {
  headers: string[];
  data: any[][];
}

export class JdbcConnection {
  endpoint: string;
  constructor(endpoint: string, database: string, public user: string,
              public password: string, public vendor: string) {
    switch (vendor) {
      case 'sqlserver': {
        this.endpoint = `jdbc:${vendor}://${endpoint};DatabaseName=${database}`;
        break;
      }
      default:
        this.endpoint = `jdbc:${vendor}://${endpoint}/${database}`;
    }
  }
}

export interface IColumn {
  name: string;
  tableName: string;
  type: string;
  columnSize: string;
}

export interface IKey {
  primary: IColumn;
  foreign: IColumn;
}

export interface ITableMetaData {
  name: string;
  primaryKey: IColumn;
  importedKeys: IKey[];
  exportedKeys: IKey[];
  columns: IColumn[];
}
export interface ITable {
  table: ITableMetaData;
  selected: boolean;
}

export interface IJoin {
  primaryKey: {
    tableName: string,
    name: string
  };
  foreignKey: {
    tableName: string,
    name: string
  };
  type: string;
}

export const JOIN_TYPES = {
  INNER: 'inner',
  LEFT: 'left',
  RIGHT: 'right',
  FULL: 'full'
};

export interface IPreview {
  table: IResultTable;
  joinChain: string[];
}

export const Aggregation = {
  COUNT: 'COUNT',
  SUM: 'SUM',
  // AVG: 'AVG'
};

export const STRING_FILTER_TYPES = [
  'STRING_EQUALS', 'STRING_STARTS_WITH', 'STRING_ENDS_WITH', 'STRING_CONTAINS'
];

export const NUMERIC_FILTER_TYPES = ['EQUALS', 'LESS', 'LESS_OR_EQUAL', 'GREATER_OR_EQUAL', 'GREATER'];

export const DATE_FILTER_TYPES = ['DATE_EQUALS', 'DATE_LESS', 'DATE_LESS_OR_EQUAL', 'DATE_GREATER_OR_EQUAL', 'DATE_GREATER'];

export const FILTER_TYPES = {
  STRING_EQUALS: 'equals',
  STRING_STARTS_WITH: 'starts with',
  STRING_ENDS_WITH: 'ends with',
  STRING_CONTAINS: 'contains',
  EQUALS: '=',
  LESS: '<',
  LESS_OR_EQUAL: '<=',
  GREATER: '>',
  GREATER_OR_EQUAL: '>=',
  DATE_EQUALS: '=',
  DATE_LESS: '<',
  DATE_LESS_OR_EQUAL: '<=',
  DATE_GREATER: '>',
  DATE_GREATER_OR_EQUAL: '>='
};

export const NUMERIC_TYPES = ['int', 'integer', 'float', 'double', 'num', 'numeric', 'real', 'serial', 'decimal',
  'smallint', 'smallint unsigned', 'tinyint', 'tinyint unsigned', 'mediumint', 'mediumint unsigned', 'bigint', 'bigint unsigned'];

export const DATE_TYPES = ['date', 'datetime'];

export interface IAggregatedColumn {
  column: IColumn;
  aggregation: string;
}

export enum ComplexChartTypes {
  SUNBURST,
  DRILLDOWN
}

export class ChartConfig {
  constructor (public selected: ComplexChartTypes, public indexes: number[]) {}
  // more to come
}

export class Filter {
  constructor(public column: IColumn, public condition?: string, public constant?: string) {}
}

export interface IError {
  message: string;
  accept: string;
  decline: string;
}

export const COLOURS = {
  PRIMARY: '#032965',
  ACCENT: '#e91e63'
};
