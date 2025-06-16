// helpers/index.ts
export const generate4DigitId = (): number =>
  Math.floor(1000 + Math.random() * 9000);

export const generateUserId = (): string => {
  const random4Digits = () => Math.floor(1000 + Math.random() * 9000);
  return `${random4Digits()}_${random4Digits()}`;
};
