import { ERROR_MESSAGES } from '../constants';

export const getStatus = (errorMsg: string) => {
  if (errorMsg === null) return 200;

  // eslint-disable-next-line max-len
  const entry = Object.entries(ERROR_MESSAGES).find(([_, messages]) => Object.values(messages).includes(errorMsg));

  return entry ? Number(entry[0]) : 500;
};
