import { NextResponse } from 'next/server';

const dataSets = [
  { name: 'datasetA', data: 'Data for dataset A' },
  { name: 'datasetB', data: 'Data for dataset B' },
  // 추가 데이터셋
];

export async function GET() {
  return NextResponse.json(dataSets);
}
