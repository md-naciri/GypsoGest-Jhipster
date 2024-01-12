import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReturned } from '../returned.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../returned.test-samples';

import { ReturnedService } from './returned.service';

const requireRestSample: IReturned = {
  ...sampleWithRequiredData,
};

describe('Returned Service', () => {
  let service: ReturnedService;
  let httpMock: HttpTestingController;
  let expectedResult: IReturned | IReturned[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReturnedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Returned', () => {
      const returned = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(returned).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Returned', () => {
      const returned = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(returned).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Returned', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Returned', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Returned', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReturnedToCollectionIfMissing', () => {
      it('should add a Returned to an empty array', () => {
        const returned: IReturned = sampleWithRequiredData;
        expectedResult = service.addReturnedToCollectionIfMissing([], returned);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(returned);
      });

      it('should not add a Returned to an array that contains it', () => {
        const returned: IReturned = sampleWithRequiredData;
        const returnedCollection: IReturned[] = [
          {
            ...returned,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReturnedToCollectionIfMissing(returnedCollection, returned);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Returned to an array that doesn't contain it", () => {
        const returned: IReturned = sampleWithRequiredData;
        const returnedCollection: IReturned[] = [sampleWithPartialData];
        expectedResult = service.addReturnedToCollectionIfMissing(returnedCollection, returned);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(returned);
      });

      it('should add only unique Returned to an array', () => {
        const returnedArray: IReturned[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const returnedCollection: IReturned[] = [sampleWithRequiredData];
        expectedResult = service.addReturnedToCollectionIfMissing(returnedCollection, ...returnedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const returned: IReturned = sampleWithRequiredData;
        const returned2: IReturned = sampleWithPartialData;
        expectedResult = service.addReturnedToCollectionIfMissing([], returned, returned2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(returned);
        expect(expectedResult).toContain(returned2);
      });

      it('should accept null and undefined values', () => {
        const returned: IReturned = sampleWithRequiredData;
        expectedResult = service.addReturnedToCollectionIfMissing([], null, returned, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(returned);
      });

      it('should return initial array if no Returned is added', () => {
        const returnedCollection: IReturned[] = [sampleWithRequiredData];
        expectedResult = service.addReturnedToCollectionIfMissing(returnedCollection, undefined, null);
        expect(expectedResult).toEqual(returnedCollection);
      });
    });

    describe('compareReturned', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReturned(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareReturned(entity1, entity2);
        const compareResult2 = service.compareReturned(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareReturned(entity1, entity2);
        const compareResult2 = service.compareReturned(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareReturned(entity1, entity2);
        const compareResult2 = service.compareReturned(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
