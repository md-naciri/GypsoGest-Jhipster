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

describe('Returned e2e test', () => {
  const returnedPageUrl = '/returned';
  const returnedPageUrlPattern = new RegExp('/returned(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const returnedSample = { paymentCode: 'convene mechanically' };

  let returned;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/returneds+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/returneds').as('postEntityRequest');
    cy.intercept('DELETE', '/api/returneds/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (returned) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/returneds/${returned.id}`,
      }).then(() => {
        returned = undefined;
      });
    }
  });

  it('Returneds menu should load Returneds page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('returned');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Returned').should('exist');
    cy.url().should('match', returnedPageUrlPattern);
  });

  describe('Returned page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(returnedPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Returned page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/returned/new$'));
        cy.getEntityCreateUpdateHeading('Returned');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', returnedPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/returneds',
          body: returnedSample,
        }).then(({ body }) => {
          returned = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/returneds+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [returned],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(returnedPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Returned page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('returned');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', returnedPageUrlPattern);
      });

      it('edit button click should load edit Returned page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Returned');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', returnedPageUrlPattern);
      });

      it('edit button click should load edit Returned page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Returned');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', returnedPageUrlPattern);
      });

      it('last delete button click should delete instance of Returned', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('returned').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', returnedPageUrlPattern);

        returned = undefined;
      });
    });
  });

  describe('new Returned page', () => {
    beforeEach(() => {
      cy.visit(`${returnedPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Returned');
    });

    it('should create an instance of Returned', () => {
      cy.get(`[data-cy="paymentCode"]`).type('correctly wildly triumphantly');
      cy.get(`[data-cy="paymentCode"]`).should('have.value', 'correctly wildly triumphantly');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        returned = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', returnedPageUrlPattern);
    });
  });
});
