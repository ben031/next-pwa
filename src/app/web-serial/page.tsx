'use client';

import { useEffect, useState } from 'react';
const WebSerialPage = () => {
  const [port, setPort] = useState<any>(null);
  const [usbDevice, setUsbDevice] = useState<USBDevice | null>(null);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const connectDevice = async () => {
    try {
      const getDevice = await navigator.usb.getDevices();
      console.log(getDevice);
      const device = await navigator.usb.requestDevice({ filters: [{}] });
      console.log('Device  here ->', device);
      setUsbDevice(device);
    } catch (error) {
      console.log(error);
    }
  };

  const openAndConfigureDeivce = async () => {
    if (!usbDevice) return;
    try {
      await usbDevice.open();
      console.log(usbDevice);
      if (usbDevice.configuration === null)
        await usbDevice.selectConfiguration(1);
      await usbDevice.claimInterface(0);

      console.log('Device configured');
      console.log('opened!');
    } catch (error) {
      console.log(error);
    }
  };

  const sendCommand = async (command: string) => {};

  const disconnectSerial = async () => {};

  useEffect(() => {
    async function connectToDevice() {
      try {
        const device = await navigator.usb.requestDevice({ filters: [] });
        await device.open();
        if (device.configuration === null) {
          await device.selectConfiguration(1);
        }
        await device.claimInterface(0);
        console.log('Device connected:', device);
        // 이후에 데이터를 읽고 처리하는 로직 추가
      } catch (error) {
        console.error('Failed to connect to USB device:', error);
      }
    }

    connectToDevice();
  }, []);

  return (
    <>
      Web Serial Page
      <div>
        <button onClick={connectDevice}>Connect Serial</button>
      </div>
      <div>
        <button onClick={openAndConfigureDeivce}>Open Device</button>
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
      <pre>{isLoading ? 'is Loading..' : 'is not Loading'}</pre>
    </>
  );
};

export default WebSerialPage;
