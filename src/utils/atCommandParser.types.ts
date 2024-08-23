export type CommandType =
  | 'Rdy'
  | 'StartJSON'
  | 'Ver'
  | 'JSON_PK'
  | 'GEO'
  | 'DIAG'
  | 'CSV'
  | 'DBG';

export interface ParsedResponseBase {
  command: CommandType;
  rawParams: string;
}

export interface RdyResponse extends ParsedResponseBase {
  command: 'Rdy';
  status: string;
}

export interface StartJSONResponse extends ParsedResponseBase {
  command: 'StartJSON';
  totalGrpNo: string;
}

export interface VerResponse extends ParsedResponseBase {
  command: 'Ver';
  model: string;
  firmware: string;
  otherParams: string[];
}

export interface JSONPKResponse extends ParsedResponseBase {
  command: 'JSON_PK';
  parameterNum: string;
  checkSum: string;
  jsonData: string;
}

export interface GEOResponse extends ParsedResponseBase {
  command: 'GEO';
  dataGroups: Array<{
    id: string;
    active: string;
    lat: string;
    lon: string;
    radius: string;
  }>;
  total: string;
}

export interface DIAGResponse extends ParsedResponseBase {
  command: 'DIAG';
  gpsState: string;
  gprsState: string;
}

export interface CSVResponse extends ParsedResponseBase {
  command: 'CSV';
  csvData: string;
}

export interface DBGResponse extends ParsedResponseBase {
  command: 'DBG';
  status: string;
}

// Union type for all possible parsed responses
export type ParsedResponse =
  | RdyResponse
  | StartJSONResponse
  | VerResponse
  | JSONPKResponse
  | GEOResponse
  | DIAGResponse
  | CSVResponse
  | DBGResponse;
