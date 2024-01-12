import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IReturned } from '../returned.model';
import { ReturnedService } from '../service/returned.service';

@Component({
  standalone: true,
  templateUrl: './returned-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ReturnedDeleteDialogComponent {
  returned?: IReturned;

  constructor(
    protected returnedService: ReturnedService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.returnedService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
