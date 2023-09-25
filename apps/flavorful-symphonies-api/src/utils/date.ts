import format from 'date-fns/format';

export const barCodeFormatData = (date: Date = new Date()): string => {
  return format(date, 'ddMMyy');
};

export const getDate = (givenDate = new Date()): string => {
  const offset = givenDate.getTimezoneOffset();
  givenDate = new Date(givenDate.getTime() - offset * 60 * 1000);
  return givenDate.toISOString().split('T')[0];
};
