export const assert = <T = any>(
  value: T | null | undefined,
  message?: string,
): value is T => {
  if (value === null || value === undefined) {
    throw new Error(message || 'value is not defined');
  }

  return true;
};
