import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReturnedService } from '../service/returned.service';

import { ReturnedComponent } from './returned.component';

describe('Returned Management Component', () => {
  let comp: ReturnedComponent;
  let fixture: ComponentFixture<ReturnedComponent>;
  let service: ReturnedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'returned', component: ReturnedComponent }]),
        HttpClientTestingModule,
        ReturnedComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ReturnedComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReturnedComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReturnedService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.returneds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to returnedService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getReturnedIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getReturnedIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
