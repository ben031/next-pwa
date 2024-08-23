'use client';

import { useEffect, useState } from 'react';
import { useTransformConfigData } from '@/hooks/useTransformConfigData';
import { parsePSTResponse } from '@/utils/atCommandParser';

// USB 통신 시뮬레이터 함수
const sendCommand = async (command: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (command) {
        case 'AT^$PSTRdy':
          resolve('$PST;Rdy;UP');
          break;
        case 'AT^$PSTVer;1416':
          resolve(
            '$PST;Ver;ST4505T(M.3.0.3)_RVV_STADV_1.1.4;0;2;0;0;0;0;0;0;0;0;0;1;15'
          );
          break;
        default:
          resolve('$PST;UNKNOWN;param1;param2');
          break;
      }
    }, 500); // 500ms delay to simulate async operation
  });
};

const WebSerialPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [jsonData, setJsonData] = useState<any>();
  const transformedData = useTransformConfigData(jsonData?.synctrak);

  const sendAndParseCommand = async (
    command: string,
    expectedCommand: string
  ) => {
    const response = await sendCommand(command);
    const parsedResponse = parsePSTResponse(response);

    if (parsedResponse && parsedResponse.command === expectedCommand) {
      return parsedResponse;
    }

    throw new Error(`Unexpected response for command: ${command}`);
  };

  useEffect(() => {
    (async () => {
      try {
        const parsedRdyResponse = await sendAndParseCommand(
          'AT^$PSTRdy',
          'Rdy'
        );
        if (parsedRdyResponse) {
          const parsedVersionResponse = await sendAndParseCommand(
            'AT^$PSTVer;1416',
            'Ver'
          );
          if (parsedVersionResponse) {
            const data = await fetch('/data/data.json').then((response) =>
              response.json()
            );
            setJsonData(data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  if (!transformedData.length) {
    return <div>Loading...</div>; // 데이터가 로드될 때까지 로딩 표시
  }

  return (
    <>
      Web Serial Page
      <h1>JSON Data</h1>
      <div>
        {transformedData.map((tab, tabIndex) => (
          <div key={tabIndex}>
            <h2>{tab.tabName}</h2>
            {tab.fields.map((field, fieldIndex) => (
              <div key={fieldIndex}>
                <label>{field.fieldName}</label>
                {field.type === 'combo' ? (
                  <select defaultValue={field.value}>
                    {field.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    defaultValue={field.value}
                    maxLength={field.max}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default WebSerialPage;
