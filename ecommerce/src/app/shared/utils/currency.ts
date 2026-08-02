export const cleanDigits = (str: string) => {
  const cleanString = str.replace(/\D/g, '');
  return Number(cleanString) / 100;
};
