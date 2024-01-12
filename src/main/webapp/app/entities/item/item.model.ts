import { ISale } from 'app/entities/sale/sale.model';
import { GypseType } from 'app/entities/enumerations/gypse-type.model';

export interface IItem {
  id: number;
  gypseType?: keyof typeof GypseType | null;
  quantity?: number | null;
  unitPrice?: number | null;
  sale?: ISale | null;
}

export type NewItem = Omit<IItem, 'id'> & { id: null };
