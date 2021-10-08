/* eslint-disable import/prefer-default-export */
export const isTableDataReady = <T extends {}>(data: T[]) => {
  if (!data) return false;

  return data.length === 0;
};
