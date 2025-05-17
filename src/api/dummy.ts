interface IDummyData {
  type: 'reg';
  data: {
    name: string;
    password: string;
  };
  id: 0;
}

const dummeHandler = (data: unknown) => {
  const content = data as IDummyData;
  const response = {
    type: 'reg',
    data: {
      name: content.data.name,
      index: 1,
      error: false,
      errorText: '',
    },
    id: 0,
  };
  return response;
};
