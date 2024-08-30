export const dateHandler = (baseDate: Date) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  return { firstOfMonth, lastOfMonth };
};
