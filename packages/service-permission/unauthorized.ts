export const UNAUTHORIZED_MSG = 'Unauthorized access';

export const unauthorized = () => {
  throw new Error(UNAUTHORIZED_MSG);
};
