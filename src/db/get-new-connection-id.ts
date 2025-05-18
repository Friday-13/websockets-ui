let connectionId = 0;
const getNewConnectionId = () => {
  return (connectionId += 1);
};

export { getNewConnectionId as default };
