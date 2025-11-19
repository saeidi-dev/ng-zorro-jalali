/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { inject, InjectionToken } from '@angular/core';

import { WeekDayIndex } from 'ng-zorro-antd/core/time';

export interface NzDateDisplayFormats {
  dateInput?: string;
  dateTimeInput?: string;
  dayLabel?: string;
  weekLabel?: string;
  monthLabel?: string;
  quarterLabel?: string;
  yearLabel?: string;
  weekYearLabel?: string;
  monthYearLabel?: string;
  shortWeekLabel?: string;
  veryShortWeekLabel?: string;
}

export interface NzDateConfig {
  /** Customize the first day of a week */
  firstDayOfWeek?: WeekDayIndex;

  /** Customize display formats */
  displayFormats?: NzDateDisplayFormats;
}

export const NZ_DATE_CONFIG = new InjectionToken<NzDateConfig>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'nz-date-config' : ''
);

export const NZ_DATE_CONFIG_DEFAULT: NzDateConfig = {
  firstDayOfWeek: undefined,
  displayFormats: {
    dateInput: 'yyyy-MM-dd',
    dateTimeInput: 'yyyy-MM-dd HH:mm:ss',
    dayLabel: 'dd',
    weekLabel: 'ddd',
    monthLabel: 'MMM',
    yearLabel: 'yyyy',
    weekYearLabel: 'yyyy-ww',
    quarterLabel: 'yyyy-[Q]Q',
    monthYearLabel: 'yyyy-MM',
    shortWeekLabel: 'EEEEE',
    veryShortWeekLabel: 'EEEEEE',
  },
};

export const NZ_DATE_FORMATS = new InjectionToken<NzDateDisplayFormats>(
  'display formats',
  {
    providedIn: 'root',
    factory: () => mergeDateConfig(inject(NZ_DATE_CONFIG)).displayFormats!,
  }
);

export function mergeDateConfig(config: NzDateConfig | null): NzDateConfig {
  return { ...NZ_DATE_CONFIG_DEFAULT, ...config, displayFormats: {
      ...NZ_DATE_CONFIG_DEFAULT.displayFormats,
      ...config?.displayFormats,
    }, };
}