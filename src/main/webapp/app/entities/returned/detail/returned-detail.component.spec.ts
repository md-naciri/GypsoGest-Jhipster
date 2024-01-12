import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReturnedDetailComponent } from './returned-detail.component';

describe('Returned Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnedDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ReturnedDetailComponent,
              resolve: { returned: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ReturnedDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load returned on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ReturnedDetailComponent);

      // THEN
      expect(instance.returned).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
