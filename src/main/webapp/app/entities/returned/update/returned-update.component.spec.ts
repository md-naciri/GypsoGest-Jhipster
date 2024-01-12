import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReturnedService } from '../service/returned.service';
import { IReturned } from '../returned.model';
import { ReturnedFormService } from './returned-form.service';

import { ReturnedUpdateComponent } from './returned-update.component';

describe('Returned Management Update Component', () => {
  let comp: ReturnedUpdateComponent;
  let fixture: ComponentFixture<ReturnedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let returnedFormService: ReturnedFormService;
  let returnedService: ReturnedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ReturnedUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ReturnedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReturnedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    returnedFormService = TestBed.inject(ReturnedFormService);
    returnedService = TestBed.inject(ReturnedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const returned: IReturned = { id: 456 };

      activatedRoute.data = of({ returned });
      comp.ngOnInit();

      expect(comp.returned).toEqual(returned);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReturned>>();
      const returned = { id: 123 };
      jest.spyOn(returnedFormService, 'getReturned').mockReturnValue(returned);
      jest.spyOn(returnedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ returned });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: returned }));
      saveSubject.complete();

      // THEN
      expect(returnedFormService.getReturned).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(returnedService.update).toHaveBeenCalledWith(expect.objectContaining(returned));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReturned>>();
      const returned = { id: 123 };
      jest.spyOn(returnedFormService, 'getReturned').mockReturnValue({ id: null });
      jest.spyOn(returnedService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ returned: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: returned }));
      saveSubject.complete();

      // THEN
      expect(returnedFormService.getReturned).toHaveBeenCalled();
      expect(returnedService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReturned>>();
      const returned = { id: 123 };
      jest.spyOn(returnedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ returned });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(returnedService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
