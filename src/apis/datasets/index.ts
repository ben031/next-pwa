import request from '@/apis/common/request';
import { updateData } from '@/app/api/datasets/mockData';

const URL = {
  getDatasets: '/api/datasets',
};

export const getDatasets = async (key: string) => {
  const { data } = await request({
    method: 'GET',
    url: `${URL.getDatasets}/${key}`,
  });

  return data;
};

export const updateDatasets = async (key: string, data: any[]) => {
  await request({
    method: 'PUT',
    url: `${URL.getDatasets}/${key}`,
    requestBody: data,
  });
  //   updateData(key as 'a', data as never[]);
};
