import { IReturned, NewReturned } from './returned.model';

export const sampleWithRequiredData: IReturned = {
  id: 5476,
  paymentCode: 'duh washcloth drat',
};

export const sampleWithPartialData: IReturned = {
  id: 27739,
  paymentCode: 'loathsome outside naturally',
};

export const sampleWithFullData: IReturned = {
  id: 426,
  paymentCode: 'indeed',
};

export const sampleWithNewData: NewReturned = {
  paymentCode: 'principle',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
