import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ReturnedComponent } from './list/returned.component';
import { ReturnedDetailComponent } from './detail/returned-detail.component';
import { ReturnedUpdateComponent } from './update/returned-update.component';
import ReturnedResolve from './route/returned-routing-resolve.service';

const returnedRoute: Routes = [
  {
    path: '',
    component: ReturnedComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReturnedDetailComponent,
    resolve: {
      returned: ReturnedResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReturnedUpdateComponent,
    resolve: {
      returned: ReturnedResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReturnedUpdateComponent,
    resolve: {
      returned: ReturnedResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default returnedRoute;
