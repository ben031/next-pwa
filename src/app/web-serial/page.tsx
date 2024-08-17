'use client';

import { useEffect, useState } from 'react';
import ConfigTabs from '@/components/ConfigTabs';
import { useTransformedConfigData } from '@/hooks/useTransformConfigData';

const WebSerialPage = () => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [output, setOutput] = useState('');
  const [jsonData, setJsonData] = useState<any>();
  // console.log(jsonData);
  const transformedData = useTransformedConfigData({
    data: jsonData?.synctrak,
  });

  const sendCommand = async (command: string) => {
    console.log(command);
    if (port) {
      console.log(command);
      const encoder = new TextEncoder();
      const writer = await port.writable.getWriter();
      console.log(writer);
      await writer.write(encoder.encode(command + '\r'));
      writer.releaseLock();
    }
  };

  const connectSerial = async () => {
    try {
      // 직렬 포트 선택
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      setPort(selectedPort);
      console.log('Serial port opened');

      // 데이터 읽기
      const reader = selectedPort.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        console.log(new TextDecoder().decode(value));
        setOutput((prevOutput) => prevOutput + new TextDecoder().decode(value));
      }
    } catch (error) {
      console.error('There was an error opening the serial port:', error);
    }
  };
  console.log(jsonData);
  const disconnectSerial = async () => {
    if (port) {
      await port.close();
      setPort(null);
      console.log('Serial port closed');
    }
  };

  useEffect(() => {
    // 클라이언트 사이드에서 JSON 파일을 가져옴
    fetch('/data/data.json')
      .then((response) => response.json())
      .then((data) => setJsonData(data));
  }, []);

  if (!transformedData.length) {
    return <div>Loading...</div>; // 데이터가 로드될 때까지 로딩 표시
  }

  return (
    <>
      Web Serial Page
      <div>
        <button onClick={connectSerial}>Connect Device</button>
      </div>
      <div>
        <button onClick={() => sendCommand('AT^$PSTVer;1234')}>
          Send Command
        </button>
      </div>
      <div>
        <button onClick={() => sendCommand('AT^$PSTGetJson')}>
          Send Command
        </button>
      </div>
      <div>
        <button onClick={() => sendCommand('AT^$ReqJsonPk;No;1')}>
          Send Command
        </button>
      </div>
      <div>
        <button onClick={disconnectSerial}>Disconnect</button>
      </div>
      <pre>{output}</pre>
      <h1>JSON Data</h1>
      <div>
        <ConfigTabs data={jsonData.synctrak} />
      </div>
    </>
  );
};

export default WebSerialPage;
