import BN from 'bn.js';
import { ethers } from 'ethers';

export type ListResults<T> = [T[], BN];

export function parseListResult<T>(result: ListResults<T>): T[] {
  const [values, size] = result;
  const parsedList = [];
  const len = size.toNumber();
  for (let i = 0; i < len; i++) {
    parsedList.push(values[i]);
  }
  return parsedList;
}

export function getUniqueKey(prefix: string): string {
  return `${prefix}_${Math.random()}`;
}
