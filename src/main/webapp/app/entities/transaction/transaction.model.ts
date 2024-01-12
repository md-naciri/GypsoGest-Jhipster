import dayjs from 'dayjs/esm';
import { IClient } from 'app/entities/client/client.model';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';

export interface ITransaction {
  id: number;
  date?: dayjs.Dayjs | null;
  amount?: number | null;
  paymentCode?: string | null;
  type?: keyof typeof PaymentType | null;
  client?: IClient | null;
}

export type NewTransaction = Omit<ITransaction, 'id'> & { id: null };
