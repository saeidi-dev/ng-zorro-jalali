import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideNzI18n,
} from 'ng-zorro-antd/i18n';
import { JalaliMomentDateAdapter } from './nz-jalali-moment.adapter';
import { NzDateAdapter } from 'ng-zorro-jalali/core';
import { NZ_DATE_CONFIG, NZ_DATE_LOCALE, fa_IR } from 'ng-zorro-jalali/i18n';
import { faIR } from 'date-fns/locale';
import fa from '@angular/common/locales/fa';
import { registerLocaleData } from '@angular/common';
registerLocaleData(fa);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideNzI18n(fa_IR),
    { provide: LOCALE_ID, useValue: 'fa' },
    { provide: NZ_DATE_LOCALE, useValue: faIR },
    { provide: NzDateAdapter, useClass: JalaliMomentDateAdapter },
    {
      provide: NZ_DATE_CONFIG,
      useValue: {
        displayFormats: {
          veryShortWeekLabel: 'dd',
          dateInput: 'yyyy/MM/DD',
          dateTimeInput: 'yyyy-MM-DD HH:mm:ss',
        },
      },
    },
  ],
};
