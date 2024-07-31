import { getData, updateData } from '@/app/api/datasets/mockData';

export async function GET(
  req: Request,
  { params }: { params: { key: string } }
) {
  const data: any[] = getData(params.key as 'a');

  return Response.json({ data });
}

export async function PUT(
  req: Request,
  { params }: { params: { key: string } }
) {
  const body = await req.json();

  updateData(params.key as 'a', body as never[]);

  return Response.json({ data: body });
}
