const ID_MAX = 1000000000000;
const ID_MIN = 1;

export const generateRandomId = (): number => {
  return Math.floor(Math.random() * (ID_MAX - ID_MIN) + ID_MIN);
};
