import dayjs from 'dayjs/esm';

import { ISale, NewSale } from './sale.model';

export const sampleWithRequiredData: ISale = {
  id: 22267,
  date: dayjs('2024-01-12T08:56'),
};

export const sampleWithPartialData: ISale = {
  id: 5028,
  date: dayjs('2024-01-12T09:59'),
};

export const sampleWithFullData: ISale = {
  id: 11229,
  date: dayjs('2024-01-12T01:11'),
};

export const sampleWithNewData: NewSale = {
  date: dayjs('2024-01-12T08:57'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
