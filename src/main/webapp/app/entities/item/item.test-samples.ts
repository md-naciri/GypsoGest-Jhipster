import { IItem, NewItem } from './item.model';

export const sampleWithRequiredData: IItem = {
  id: 24873,
  gypseType: 'Plafond',
  quantity: 22909.57,
  unitPrice: 23465.72,
};

export const sampleWithPartialData: IItem = {
  id: 18990,
  gypseType: 'MortierProjeteUltra',
  quantity: 30317.21,
  unitPrice: 14601.44,
};

export const sampleWithFullData: IItem = {
  id: 16519,
  gypseType: 'Plafond',
  quantity: 23974.92,
  unitPrice: 5305.41,
};

export const sampleWithNewData: NewItem = {
  gypseType: 'Plafond',
  quantity: 11177.74,
  unitPrice: 2714.48,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
