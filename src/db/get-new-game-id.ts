let gameId = 0;
const getNewGameId = () => {
  return (gameId += 1);
};

export { getNewGameId as default };
