export const getOsEnv = (
  key: string,
  options = { required: false },
): string => {
  const osEnv = process.env[key] as string;
  if (options.required && !osEnv) {
    throw new Error(`Environment variable ${key} is required!`);
  }

  return osEnv;
};

export const toNumber = (value: string): number => {
  return parseInt(value, 10);
};

export const toBool = (value: string): boolean => {
  return value === 'true';
};

export const normalizePort = (port: string): number | string | boolean => {
  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) {
    // named pipe
    return port;
  }
  if (parsedPort >= 0) {
    // port number
    return parsedPort;
  }
  return false;
};

export const isProduction = getOsEnv('NOT_ENV') === 'production';
