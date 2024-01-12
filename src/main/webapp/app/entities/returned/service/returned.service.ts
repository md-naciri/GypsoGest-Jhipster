import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReturned, NewReturned } from '../returned.model';

export type PartialUpdateReturned = Partial<IReturned> & Pick<IReturned, 'id'>;

export type EntityResponseType = HttpResponse<IReturned>;
export type EntityArrayResponseType = HttpResponse<IReturned[]>;

@Injectable({ providedIn: 'root' })
export class ReturnedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/returneds');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(returned: NewReturned): Observable<EntityResponseType> {
    return this.http.post<IReturned>(this.resourceUrl, returned, { observe: 'response' });
  }

  update(returned: IReturned): Observable<EntityResponseType> {
    return this.http.put<IReturned>(`${this.resourceUrl}/${this.getReturnedIdentifier(returned)}`, returned, { observe: 'response' });
  }

  partialUpdate(returned: PartialUpdateReturned): Observable<EntityResponseType> {
    return this.http.patch<IReturned>(`${this.resourceUrl}/${this.getReturnedIdentifier(returned)}`, returned, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReturned>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReturned[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReturnedIdentifier(returned: Pick<IReturned, 'id'>): number {
    return returned.id;
  }

  compareReturned(o1: Pick<IReturned, 'id'> | null, o2: Pick<IReturned, 'id'> | null): boolean {
    return o1 && o2 ? this.getReturnedIdentifier(o1) === this.getReturnedIdentifier(o2) : o1 === o2;
  }

  addReturnedToCollectionIfMissing<Type extends Pick<IReturned, 'id'>>(
    returnedCollection: Type[],
    ...returnedsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const returneds: Type[] = returnedsToCheck.filter(isPresent);
    if (returneds.length > 0) {
      const returnedCollectionIdentifiers = returnedCollection.map(returnedItem => this.getReturnedIdentifier(returnedItem)!);
      const returnedsToAdd = returneds.filter(returnedItem => {
        const returnedIdentifier = this.getReturnedIdentifier(returnedItem);
        if (returnedCollectionIdentifiers.includes(returnedIdentifier)) {
          return false;
        }
        returnedCollectionIdentifiers.push(returnedIdentifier);
        return true;
      });
      return [...returnedsToAdd, ...returnedCollection];
    }
    return returnedCollection;
  }
}
