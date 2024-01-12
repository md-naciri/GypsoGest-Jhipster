import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IReturned, NewReturned } from '../returned.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReturned for edit and NewReturnedFormGroupInput for create.
 */
type ReturnedFormGroupInput = IReturned | PartialWithRequiredKeyOf<NewReturned>;

type ReturnedFormDefaults = Pick<NewReturned, 'id'>;

type ReturnedFormGroupContent = {
  id: FormControl<IReturned['id'] | NewReturned['id']>;
  paymentCode: FormControl<IReturned['paymentCode']>;
};

export type ReturnedFormGroup = FormGroup<ReturnedFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReturnedFormService {
  createReturnedFormGroup(returned: ReturnedFormGroupInput = { id: null }): ReturnedFormGroup {
    const returnedRawValue = {
      ...this.getFormDefaults(),
      ...returned,
    };
    return new FormGroup<ReturnedFormGroupContent>({
      id: new FormControl(
        { value: returnedRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      paymentCode: new FormControl(returnedRawValue.paymentCode, {
        validators: [Validators.required],
      }),
    });
  }

  getReturned(form: ReturnedFormGroup): IReturned | NewReturned {
    return form.getRawValue() as IReturned | NewReturned;
  }

  resetForm(form: ReturnedFormGroup, returned: ReturnedFormGroupInput): void {
    const returnedRawValue = { ...this.getFormDefaults(), ...returned };
    form.reset(
      {
        ...returnedRawValue,
        id: { value: returnedRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReturnedFormDefaults {
    return {
      id: null,
    };
  }
}
