import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReturned } from '../returned.model';
import { ReturnedService } from '../service/returned.service';

export const returnedResolve = (route: ActivatedRouteSnapshot): Observable<null | IReturned> => {
  const id = route.params['id'];
  if (id) {
    return inject(ReturnedService)
      .find(id)
      .pipe(
        mergeMap((returned: HttpResponse<IReturned>) => {
          if (returned.body) {
            return of(returned.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default returnedResolve;
