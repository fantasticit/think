const colors = [
  "#47A1FF",
  "#59CB74",
  "#FFB952",
  "#FC6980",
  "#6367EC",
  "#DA65CC",
  "#FBD54A",
  "#ADDF84",
  "#6CD3FF",
  "#659AEC",
  "#9F8CF1",
  "#ED8CCE",
  "#A2E5FF",
  "#4DCCCB",
  "#F79452",
  "#84E0BE",
  "#5982F6",
  "#E37474",
  "#3FDDC7",
  "#9861E5",
];

const total = colors.length;
export const getRandomColor = () => colors[~~(Math.random() * total)];
