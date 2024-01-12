import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'client',
    data: { pageTitle: 'gypsoGestApp.client.home.title' },
    loadChildren: () => import('./client/client.routes'),
  },
  {
    path: 'sale',
    data: { pageTitle: 'gypsoGestApp.sale.home.title' },
    loadChildren: () => import('./sale/sale.routes'),
  },
  {
    path: 'transaction',
    data: { pageTitle: 'gypsoGestApp.transaction.home.title' },
    loadChildren: () => import('./transaction/transaction.routes'),
  },
  {
    path: 'item',
    data: { pageTitle: 'gypsoGestApp.item.home.title' },
    loadChildren: () => import('./item/item.routes'),
  },
  {
    path: 'returned',
    data: { pageTitle: 'gypsoGestApp.returned.home.title' },
    loadChildren: () => import('./returned/returned.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
