export interface IResultTable {
  headers: string[];
  data: any[][];
}

export class JdbcConnection {
  constructor(public endpoint: string, public user: string,
              public password: string, public vendor: string) {
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

export interface IAggregatedColumn {
  column: IColumn;
  aggregation: string;
}
