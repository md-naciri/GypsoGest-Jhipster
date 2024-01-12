import { ISale } from 'app/entities/sale/sale.model';
import { ITransaction } from 'app/entities/transaction/transaction.model';

export interface IClient {
  id: number;
  name?: string | null;
  sales?: ISale[] | null;
  transactions?: ITransaction[] | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
