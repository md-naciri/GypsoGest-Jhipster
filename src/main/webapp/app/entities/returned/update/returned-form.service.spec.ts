import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../returned.test-samples';

import { ReturnedFormService } from './returned-form.service';

describe('Returned Form Service', () => {
  let service: ReturnedFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnedFormService);
  });

  describe('Service methods', () => {
    describe('createReturnedFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReturnedFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            paymentCode: expect.any(Object),
          }),
        );
      });

      it('passing IReturned should create a new form with FormGroup', () => {
        const formGroup = service.createReturnedFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            paymentCode: expect.any(Object),
          }),
        );
      });
    });

    describe('getReturned', () => {
      it('should return NewReturned for default Returned initial value', () => {
        const formGroup = service.createReturnedFormGroup(sampleWithNewData);

        const returned = service.getReturned(formGroup) as any;

        expect(returned).toMatchObject(sampleWithNewData);
      });

      it('should return NewReturned for empty Returned initial value', () => {
        const formGroup = service.createReturnedFormGroup();

        const returned = service.getReturned(formGroup) as any;

        expect(returned).toMatchObject({});
      });

      it('should return IReturned', () => {
        const formGroup = service.createReturnedFormGroup(sampleWithRequiredData);

        const returned = service.getReturned(formGroup) as any;

        expect(returned).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReturned should not enable id FormControl', () => {
        const formGroup = service.createReturnedFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReturned should disable id FormControl', () => {
        const formGroup = service.createReturnedFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
