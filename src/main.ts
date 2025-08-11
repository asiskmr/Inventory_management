import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { enableProdMode } from '@angular/core';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

if (typeof window !== 'undefined' && (window as any).ENABLE_PROD_MODE) {
  enableProdMode();
}

console.log('Running in environment:', typeof window === 'undefined' ? 'Server (SSR)' : 'Browser');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
