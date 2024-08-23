import {
  CommandType,
  ParsedResponse,
  RdyResponse,
  StartJSONResponse,
  VerResponse,
  JSONPKResponse,
  GEOResponse,
  DIAGResponse,
  CSVResponse,
  DBGResponse,
} from './atCommandParser.types';

export function parsePSTResponse(response: string): ParsedResponse | null {
  const pattern = /^\$PST;(\w+);(.*)$/;
  const match = response.match(pattern);

  if (!match) {
    return null;
  }

  const command = match[1] as CommandType;
  const rawParams = match[2];

  switch (command) {
    case 'Rdy': {
      const status = rawParams;
      return { command, status, rawParams } as RdyResponse;
    }

    case 'StartJSON': {
      const [, totalGrpNo] = rawParams.split(';');
      return { command, totalGrpNo, rawParams } as StartJSONResponse;
    }

    case 'Ver': {
      const [model, firmware, ...otherParams] = rawParams.split(';');
      return {
        command,
        model,
        firmware,
        otherParams,
        rawParams,
      } as VerResponse;
    }

    case 'JSON_PK': {
      const [parameterNum, checkSum, jsonData] = rawParams.split(';');
      return {
        command,
        parameterNum,
        checkSum,
        jsonData,
        rawParams,
      } as JSONPKResponse;
    }

    case 'GEO': {
      if (rawParams === 'NoData') {
        return {
          command,
          dataGroups: [],
          total: '0',
          rawParams,
        } as GEOResponse;
      } else {
        const geoParams = rawParams.split(';');
        const dataGroups = [];
        let i = 0;
        while (i < geoParams.length - 1) {
          const data = {
            id: geoParams[i++],
            active: geoParams[i++],
            lat: geoParams[i++],
            lon: geoParams[i++],
            radius: geoParams[i++],
          };
          dataGroups.push(data);
        }
        const total = geoParams[geoParams.length - 1];
        return { command, dataGroups, total, rawParams } as GEOResponse;
      }
    }

    case 'DIAG': {
      const [gpsState, gprsState] = rawParams.split(';');
      return { command, gpsState, gprsState, rawParams } as DIAGResponse;
    }

    case 'CSV': {
      return { command, csvData: rawParams, rawParams } as CSVResponse;
    }

    case 'DBG': {
      return { command, status: rawParams, rawParams } as DBGResponse;
    }

    default: {
      throw new Error(`Unhandled command type: ${command}`);
    }
  }
}
