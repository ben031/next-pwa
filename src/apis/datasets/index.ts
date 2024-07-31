import request from '@/apis/common/request';

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
};
