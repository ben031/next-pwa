// types.d.ts

interface Navigator {
  usb: USB;
}

interface USB {
  getDevices(): Promise<USBDevice[]>;
  requestDevice(options: USBRequestOptions): Promise<USBDevice>;
}

interface USBControlTransferParameters {
  requestType: 'standard' | 'class' | 'vendor'; // 전송의 종류를 결정
  recipient: 'device' | 'interface' | 'endpoint' | 'other'; // 전송의 수신자
  request: number; // USB 요청의 식별 번호 (보통 8비트)
  value: number; // 요청과 관련된 값 (16비트)
  index: number; // 요청과 관련된 추가 인덱스 정보 (16비트)
}

interface USBInTransferResult {
  data: DataView | null; // 수신된 데이터. 데이터가 없거나 전송에 실패했을 경우 null이 될 수 있음
  status: 'ok' | 'stall' | 'babble'; // 전송의 상태
}

interface USBOutTransferResult {
  bytesWritten: number; // 성공적으로 전송된 바이트 수
  status: 'ok' | 'stall' | 'babble'; // 전송의 상태
}

interface USBConfiguration {
  configurationValue: number;
  configurationName: string | null;
  interfaces: USBInterface[];
}

interface USBInterface {
  interfaceNumber: number;
  alternate: USBAlternateInterface;
  alternates: USBAlternateInterface[];
  claimed: boolean;
}

interface USBAlternateInterface {
  alternateSetting: number;
  interfaceClass: number;
  interfaceSubclass: number;
  interfaceProtocol: number;
  interfaceName: string | null;
  endpoints: USBEndpoint[];
}

interface USBEndpoint {
  endpointNumber: number;
  direction: 'in' | 'out';
  type: 'bulk' | 'interrupt' | 'isochronous';
  packetSize: number;
}

interface USBDevice {
  configuration: USBConfiguration | null;
  open(): Promise<void>;
  close(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
  releaseInterface(interfaceNumber: number): Promise<void>;
  controlTransferIn(
    setup: USBControlTransferParameters,
    length: number
  ): Promise<USBInTransferResult>;
  controlTransferOut(
    setup: USBControlTransferParameters,
    data?: BufferSource
  ): Promise<USBOutTransferResult>;
  transferIn(
    endpointNumber: number,
    length: number
  ): Promise<USBInTransferResult>;
  transferOut(
    endpointNumber: number,
    data: BufferSource
  ): Promise<USBOutTransferResult>;
  reset(): Promise<void>;
}
