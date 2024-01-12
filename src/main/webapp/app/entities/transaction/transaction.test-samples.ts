import dayjs from 'dayjs/esm';

import { ITransaction, NewTransaction } from './transaction.model';

export const sampleWithRequiredData: ITransaction = {
  id: 8990,
  date: dayjs('2024-01-12T11:06'),
  amount: 22146.17,
  paymentCode: 'gadzooks set',
  type: 'Effet',
};

export const sampleWithPartialData: ITransaction = {
  id: 3594,
  date: dayjs('2024-01-12T06:41'),
  amount: 15254.9,
  paymentCode: 'stab furthermore lemur',
  type: 'Virement',
};

export const sampleWithFullData: ITransaction = {
  id: 32567,
  date: dayjs('2024-01-11T11:53'),
  amount: 3323.8,
  paymentCode: 'woot',
  type: 'Effet',
};

export const sampleWithNewData: NewTransaction = {
  date: dayjs('2024-01-12T09:08'),
  amount: 4798.17,
  paymentCode: 'slimy lamb',
  type: 'Versement',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
