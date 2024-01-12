import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IReturned } from '../returned.model';
import { ReturnedService } from '../service/returned.service';
import { ReturnedFormService, ReturnedFormGroup } from './returned-form.service';

@Component({
  standalone: true,
  selector: 'jhi-returned-update',
  templateUrl: './returned-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReturnedUpdateComponent implements OnInit {
  isSaving = false;
  returned: IReturned | null = null;

  editForm: ReturnedFormGroup = this.returnedFormService.createReturnedFormGroup();

  constructor(
    protected returnedService: ReturnedService,
    protected returnedFormService: ReturnedFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ returned }) => {
      this.returned = returned;
      if (returned) {
        this.updateForm(returned);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const returned = this.returnedFormService.getReturned(this.editForm);
    if (returned.id !== null) {
      this.subscribeToSaveResponse(this.returnedService.update(returned));
    } else {
      this.subscribeToSaveResponse(this.returnedService.create(returned));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReturned>>): void {
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

  protected updateForm(returned: IReturned): void {
    this.returned = returned;
    this.returnedFormService.resetForm(this.editForm, returned);
  }
}
