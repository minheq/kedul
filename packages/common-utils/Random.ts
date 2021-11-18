export const randomString = (length = 100) => {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  return Array(length)
    .join()
    .split(',')
    .map(() => s.charAt(Math.floor(Math.random() * s.length)))
    .join('');
};

export const randomDigits = (n = 6): string => {
  const add = 1;
  let max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return randomDigits(max) + randomDigits(n - max);
  }

  max = Math.pow(10, n + add);
  const min = max / 10; // Math.pow(10, n) basically
  const num = Math.floor(Math.random() * (max - min + 1)) + min;

  return ('' + num).substring(add);
};
