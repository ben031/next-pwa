import { NextRequest, NextResponse } from 'next/server';

const dataSets: { [key: string]: any } = {
  datasetA: { name: 'datasetA', data: 'Data for dataset A' },
  datasetB: { name: 'datasetB', data: 'Data for dataset B' },
  // 추가 데이터셋
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const datasetName = searchParams.get('datasetName');

  if (datasetName && dataSets[datasetName]) {
    return NextResponse.json(dataSets[datasetName]);
  } else {
    return NextResponse.json({ message: 'Dataset not found' }, { status: 404 });
  }
}
