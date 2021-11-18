/**
 * De-serializes the data stored as JSON in database.
 * (Because underlying sqlite library will return a string but postgres library returns parsed JSON value)
 * @param column the column with JSON data type
 */
export const parseJsonColumn = <TData = any>(column: string): TData => {
  try {
    return JSON.parse(column);
  } catch (error) {
    // @ts-ignore
    return column;
  }
};
