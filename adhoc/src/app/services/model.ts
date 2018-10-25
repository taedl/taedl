export interface IResultTable {
  headers: string[];
  data: any[][];
}

export class JdbcConnection {
  endpoint: string;
  constructor(endpoint: string, database: string, public user: string,
              public password: string, public vendor: string) {
    this.endpoint = `jdbc:${vendor}://${endpoint}/${database}`;
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
  AVG: 'AVG'
};

export const STRING_FILTER_TYPES = [
  'EQUALS', 'STARTS_WITH', 'ENDS_WITH', 'CONTAINS'
];

export const NUMERIC_FILTER_TYPES = ['EQUALS', 'LESS', 'LESS_OR_EQUAL', 'GREATER_OR_EQUAL', 'GREATER'];

export const FILTER_TYPES = [
  {
    name: 'EQUALS',
    label: '='
  }, {
    name: 'STARTS_WITH',
    label: 'starts with'
  },
  {
    name: 'ENDS_WITH',
    label: 'ends with'
  },
  {
    name: 'CONTAINS',
    label: 'contains'
  },
  {
    name: 'LESS',
    label: '<'
  },
  {
    name: 'LESS_OR_EQUAL',
    label: '<='
  },
  {
    name: 'GREATER',
    label: '>'
  },
  {
    name: 'GREATER_OR_EQUAL',
    label: '>='
  },
];

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
