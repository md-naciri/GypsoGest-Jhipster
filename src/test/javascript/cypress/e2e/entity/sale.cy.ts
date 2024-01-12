import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Sale e2e test', () => {
  const salePageUrl = '/sale';
  const salePageUrlPattern = new RegExp('/sale(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const saleSample = { date: '2024-01-12T01:20:13.698Z' };

  let sale;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/sales+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/sales').as('postEntityRequest');
    cy.intercept('DELETE', '/api/sales/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (sale) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/sales/${sale.id}`,
      }).then(() => {
        sale = undefined;
      });
    }
  });

  it('Sales menu should load Sales page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('sale');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Sale').should('exist');
    cy.url().should('match', salePageUrlPattern);
  });

  describe('Sale page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(salePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Sale page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/sale/new$'));
        cy.getEntityCreateUpdateHeading('Sale');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', salePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/sales',
          body: saleSample,
        }).then(({ body }) => {
          sale = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/sales+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [sale],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(salePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Sale page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('sale');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', salePageUrlPattern);
      });

      it('edit button click should load edit Sale page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Sale');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', salePageUrlPattern);
      });

      it('edit button click should load edit Sale page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Sale');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', salePageUrlPattern);
      });

      it('last delete button click should delete instance of Sale', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('sale').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', salePageUrlPattern);

        sale = undefined;
      });
    });
  });

  describe('new Sale page', () => {
    beforeEach(() => {
      cy.visit(`${salePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Sale');
    });

    it('should create an instance of Sale', () => {
      cy.get(`[data-cy="date"]`).type('2024-01-12T05:37');
      cy.get(`[data-cy="date"]`).blur();
      cy.get(`[data-cy="date"]`).should('have.value', '2024-01-12T05:37');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        sale = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', salePageUrlPattern);
    });
  });
});
