export const sleep = (millisecond = 0) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, millisecond);
  });
};
