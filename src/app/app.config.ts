import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';

export function tokenGetter() {
  return sessionStorage.getItem('token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    // IMPORTANTE: Combinar las características de HttpClient en una sola llamada para no sobreescribir los interceptores del JwtModule
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:8080'],
           disallowedRoutes: [
             'http://localhost:8080/login/forget',
          //allowedDomains: ['grupo-2arqui-production-backend.up.railway.app'],
          //disallowedRoutes: [
          //  'xdaxdhttps://grupo-2arqui-production-backend.up.railway.app/login/forget',
          //],
          // allowedDomains: ['localhost:8080'],
          // disallowedRoutes: [
          //   'http://localhost:8080/login/forget',
           ],
        },
      })
    )
  ],
};
