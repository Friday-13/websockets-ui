let userId = 0;
const getNewUserId = () => {
  return (userId += 1);
};

export { getNewUserId as default };
