import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IItem } from '../item.model';
import { ItemService } from '../service/item.service';

@Component({
  standalone: true,
  templateUrl: './item-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ItemDeleteDialogComponent {
  item?: IItem;

  constructor(
    protected itemService: ItemService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
