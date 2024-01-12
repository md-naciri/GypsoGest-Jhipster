import dayjs from 'dayjs/esm';
import { IItem } from 'app/entities/item/item.model';
import { IClient } from 'app/entities/client/client.model';

export interface ISale {
  id: number;
  date?: dayjs.Dayjs | null;
  items?: IItem[] | null;
  client?: IClient | null;
}

export type NewSale = Omit<ISale, 'id'> & { id: null };
