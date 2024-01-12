import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISale } from 'app/entities/sale/sale.model';
import { SaleService } from 'app/entities/sale/service/sale.service';
import { GypseType } from 'app/entities/enumerations/gypse-type.model';
import { ItemService } from '../service/item.service';
import { IItem } from '../item.model';
import { ItemFormService, ItemFormGroup } from './item-form.service';

@Component({
  standalone: true,
  selector: 'jhi-item-update',
  templateUrl: './item-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ItemUpdateComponent implements OnInit {
  isSaving = false;
  item: IItem | null = null;
  gypseTypeValues = Object.keys(GypseType);

  salesSharedCollection: ISale[] = [];

  editForm: ItemFormGroup = this.itemFormService.createItemFormGroup();

  constructor(
    protected itemService: ItemService,
    protected itemFormService: ItemFormService,
    protected saleService: SaleService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareSale = (o1: ISale | null, o2: ISale | null): boolean => this.saleService.compareSale(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ item }) => {
      this.item = item;
      if (item) {
        this.updateForm(item);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const item = this.itemFormService.getItem(this.editForm);
    if (item.id !== null) {
      this.subscribeToSaveResponse(this.itemService.update(item));
    } else {
      this.subscribeToSaveResponse(this.itemService.create(item));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItem>>): void {
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

  protected updateForm(item: IItem): void {
    this.item = item;
    this.itemFormService.resetForm(this.editForm, item);

    this.salesSharedCollection = this.saleService.addSaleToCollectionIfMissing<ISale>(this.salesSharedCollection, item.sale);
  }

  protected loadRelationshipsOptions(): void {
    this.saleService
      .query()
      .pipe(map((res: HttpResponse<ISale[]>) => res.body ?? []))
      .pipe(map((sales: ISale[]) => this.saleService.addSaleToCollectionIfMissing<ISale>(sales, this.item?.sale)))
      .subscribe((sales: ISale[]) => (this.salesSharedCollection = sales));
  }
}
