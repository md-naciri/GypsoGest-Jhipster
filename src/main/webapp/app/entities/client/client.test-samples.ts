import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 8049,
  name: 'attentive gleefully ick',
};

export const sampleWithPartialData: IClient = {
  id: 16988,
  name: 'undersell for yippee',
};

export const sampleWithFullData: IClient = {
  id: 8804,
  name: 'overdub',
};

export const sampleWithNewData: NewClient = {
  name: 'strike while per',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
