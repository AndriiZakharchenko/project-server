import { ERROR_MESSAGES } from '../constants';

interface IError {
  message: string;
}

export const getStatus = (error: IError | null) => {
  if (error === null) return 200;

  // eslint-disable-next-line max-len
  const entry = Object.entries(ERROR_MESSAGES).find(([_, messages]) => Object.values(messages).includes(error.message));

  return entry ? Number(entry[0]) : 500;
};
