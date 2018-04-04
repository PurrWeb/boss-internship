const colors = [
  '#8395a7',
  '#eb4d4b',
  '#6ab04c',
  '#1289A7',
  '#D980FA',
  '#ffa502',
  '#74b9ff',
  '#20bf6b',
  '#82589f',
  '#ff7f50',
];

export default id => {
  const index = id % colors.length;
  return colors[index];
};
