export const generateAppTransId = (): string => {
  const now = Date.now();
  return `zp_${now}_${Math.floor(Math.random() * 10000)}`;
};
