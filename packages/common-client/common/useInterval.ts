import React from 'react';

export const useInterval = (
  callback: (...args: any[]) => void,
  ms: number,
  ...args: any[]
) => {
  const savedHandler = React.useRef((...innerArgs: any[]) => {
    return;
  });

  React.useEffect(() => {
    savedHandler.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const handler = () => savedHandler.current(...args);

    if (ms !== null) {
      const id = setInterval(handler, ms);
      return () => clearInterval(id);
    }

    return;
  }, [args, ms]);
};
