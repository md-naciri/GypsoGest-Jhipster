import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SaleComponent } from './list/sale.component';
import { SaleDetailComponent } from './detail/sale-detail.component';
import { SaleUpdateComponent } from './update/sale-update.component';
import SaleResolve from './route/sale-routing-resolve.service';

const saleRoute: Routes = [
  {
    path: '',
    component: SaleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SaleDetailComponent,
    resolve: {
      sale: SaleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SaleUpdateComponent,
    resolve: {
      sale: SaleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SaleUpdateComponent,
    resolve: {
      sale: SaleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default saleRoute;
