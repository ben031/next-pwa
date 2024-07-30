let dataSetsMock = {
  a: [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' },
    { id: 3, title: 'test 3' },
    { id: 4, title: 'test 4' },
  ],
  b: [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' },
    { id: 3, title: 'test 3' },
    { id: 4, title: 'test 4' },
  ],
  c: [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' },
    { id: 3, title: 'test 3' },
    { id: 4, title: 'test 4' },
  ],
  d: [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' },
    { id: 3, title: 'test 3' },
    { id: 4, title: 'test 4' },
  ],
  e: [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' },
    { id: 3, title: 'test 3' },
    { id: 4, title: 'test 4' },
  ],
  f: [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' },
    { id: 3, title: 'test 3' },
    { id: 4, title: 'test 4' },
  ],
  g: [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' },
    { id: 3, title: 'test 3' },
    { id: 4, title: 'test 4' },
  ],
  h: [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' },
    { id: 3, title: 'test 3' },
    { id: 4, title: 'test 4' },
  ],
  i: [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' },
    { id: 3, title: 'test 3' },
    { id: 4, title: 'test 4' },
  ],
  j: [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' },
    { id: 3, title: 'test 3' },
    { id: 4, title: 'test 4' },
  ],
};

export const getData = (key: keyof typeof dataSetsMock) => dataSetsMock[key];

export const updateData = (
  key: keyof typeof dataSetsMock,
  updatedItem: never[]
) => {
  dataSetsMock[key] = updatedItem;

  return null;
};
