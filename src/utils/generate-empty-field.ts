const generateEmptyField = (rows = 10, cols = 10): null[][] => {
  const field = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null));
  return field;
};

export { generateEmptyField as default };
