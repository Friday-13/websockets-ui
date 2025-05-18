let roomId = 0;
const getNewRoomId = () => {
  return (roomId += 1);
};

export { getNewRoomId as default };
