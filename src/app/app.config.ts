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
import { environment } from '../environments/environment';

export function tokenGetter() {
  return sessionStorage.getItem('token');
}

// Extraer el dominio (ej: localhost:8080 o app.up.railway.app) desde la base del environment
const getDomain = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return url.replace('http://', '').replace('https://', '').split('/')[0];
  }
};

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
          allowedDomains: [getDomain(environment.base)], // Detecta tu BD automáticamente
          disallowedRoutes: [`${environment.base}/login/forget`],
        },
      })
    )
  ],
};
