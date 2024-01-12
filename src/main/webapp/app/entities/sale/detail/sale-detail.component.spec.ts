import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SaleDetailComponent } from './sale-detail.component';

describe('Sale Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SaleDetailComponent,
              resolve: { sale: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SaleDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load sale on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SaleDetailComponent);

      // THEN
      expect(instance.sale).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
