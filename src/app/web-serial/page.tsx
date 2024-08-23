'use client';

import { useEffect, useState } from 'react';
import ConfigTabs from '@/components/ConfigTabs';
import { useTransformedConfigData } from '@/hooks/useTransformConfigData';
import { parsePSTResponse } from '@/utils/atCommandParser';

const fileDownload = (blob: Blob) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'mock.profile');
  document.body.appendChild(link);
  link.click();
};

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

const WebSerialPage = () => {
  const [jsonData, setJsonData] = useState<any>();
  const [atResponse, setAtResponse] = useState<Record<string, any>[]>([]);
  const transformedData = useTransformedConfigData({
    data: jsonData?.synctrak,
  });
  const [blob, setBlob] = useState<Blob>();

  useEffect(() => {
    (async () => {
      try {
        const parsedRdyResponse = await sendAndParseCommand(
          'AT^$PSTRdy',
          'Rdy'
        );
        setAtResponse((prev) => [...prev, parsedRdyResponse]);
        if (parsedRdyResponse) {
          const parsedVersionResponse = await sendAndParseCommand(
            'AT^$PSTVer;1416',
            'Ver'
          );
          setAtResponse((prev) => [...prev, parsedVersionResponse]);
          if (parsedVersionResponse) {
            const profile = await fetch('/data/mock.profile');
            const blobProfile = await profile.blob();
            setBlob(blobProfile);
            const textProfile = await blobProfile.text();
            console.log(textProfile);
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
      {blob && (
        <div>
          <button
            className="border-blue-500 text-blue-500"
            onClick={() => fileDownload(blob)}
          >
            profile 파일 다운로드
          </button>
        </div>
      )}
      <h1>JSON Data</h1>
      {atResponse.map((res) => {
        return <div key={JSON.stringify(res)}>{JSON.stringify(res)}</div>;
      })}
      <div>
        <ConfigTabs data={jsonData.synctrak} />
      </div>
    </>
  );
};

export default WebSerialPage;
