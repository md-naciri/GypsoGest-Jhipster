export interface IReturned {
  id: number;
  paymentCode?: string | null;
}

export type NewReturned = Omit<IReturned, 'id'> & { id: null };
