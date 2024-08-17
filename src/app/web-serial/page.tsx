'use client';

import { useEffect, useState } from 'react';
import { useTransformConfigData } from '@/hooks/useTransformConfigData';

const WebSerialPage = () => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jsonData, setJsonData] = useState<any>();
  // console.log(jsonData);
  const transformedData = useTransformConfigData(jsonData?.synctrak);
  console.log(transformedData);

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

  const disconnectSerial = async () => {
    if (port) {
      await port.close();
      setPort(null);
      console.log('Serial port closed');
    }
  };

  const jsonParsing = async () => {};

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
