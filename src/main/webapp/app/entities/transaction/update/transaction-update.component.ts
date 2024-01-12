import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { TransactionService } from '../service/transaction.service';
import { ITransaction } from '../transaction.model';
import { TransactionFormService, TransactionFormGroup } from './transaction-form.service';

@Component({
  standalone: true,
  selector: 'jhi-transaction-update',
  templateUrl: './transaction-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TransactionUpdateComponent implements OnInit {
  isSaving = false;
  transaction: ITransaction | null = null;
  paymentTypeValues = Object.keys(PaymentType);

  clientsSharedCollection: IClient[] = [];

  editForm: TransactionFormGroup = this.transactionFormService.createTransactionFormGroup();

  constructor(
    protected transactionService: TransactionService,
    protected transactionFormService: TransactionFormService,
    protected clientService: ClientService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareClient = (o1: IClient | null, o2: IClient | null): boolean => this.clientService.compareClient(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transaction }) => {
      this.transaction = transaction;
      if (transaction) {
        this.updateForm(transaction);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transaction = this.transactionFormService.getTransaction(this.editForm);
    if (transaction.id !== null) {
      this.subscribeToSaveResponse(this.transactionService.update(transaction));
    } else {
      this.subscribeToSaveResponse(this.transactionService.create(transaction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransaction>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(transaction: ITransaction): void {
    this.transaction = transaction;
    this.transactionFormService.resetForm(this.editForm, transaction);

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing<IClient>(
      this.clientsSharedCollection,
      transaction.client,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing<IClient>(clients, this.transaction?.client)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));
  }
}
