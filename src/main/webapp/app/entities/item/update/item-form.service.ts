import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItem, NewItem } from '../item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItem for edit and NewItemFormGroupInput for create.
 */
type ItemFormGroupInput = IItem | PartialWithRequiredKeyOf<NewItem>;

type ItemFormDefaults = Pick<NewItem, 'id'>;

type ItemFormGroupContent = {
  id: FormControl<IItem['id'] | NewItem['id']>;
  gypseType: FormControl<IItem['gypseType']>;
  quantity: FormControl<IItem['quantity']>;
  unitPrice: FormControl<IItem['unitPrice']>;
  sale: FormControl<IItem['sale']>;
};

export type ItemFormGroup = FormGroup<ItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemFormService {
  createItemFormGroup(item: ItemFormGroupInput = { id: null }): ItemFormGroup {
    const itemRawValue = {
      ...this.getFormDefaults(),
      ...item,
    };
    return new FormGroup<ItemFormGroupContent>({
      id: new FormControl(
        { value: itemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      gypseType: new FormControl(itemRawValue.gypseType, {
        validators: [Validators.required],
      }),
      quantity: new FormControl(itemRawValue.quantity, {
        validators: [Validators.required],
      }),
      unitPrice: new FormControl(itemRawValue.unitPrice, {
        validators: [Validators.required],
      }),
      sale: new FormControl(itemRawValue.sale),
    });
  }

  getItem(form: ItemFormGroup): IItem | NewItem {
    return form.getRawValue() as IItem | NewItem;
  }

  resetForm(form: ItemFormGroup, item: ItemFormGroupInput): void {
    const itemRawValue = { ...this.getFormDefaults(), ...item };
    form.reset(
      {
        ...itemRawValue,
        id: { value: itemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ItemFormDefaults {
    return {
      id: null,
    };
  }
}
