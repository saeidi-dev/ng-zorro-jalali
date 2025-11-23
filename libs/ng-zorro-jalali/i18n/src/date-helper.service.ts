/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { formatDate } from '@angular/common';
import { Injectable, inject, Optional, Injector } from '@angular/core';

import { getISOWeek as fnsGetISOWeek, getQuarter } from 'date-fns';
import {
  WeekDayIndex,
  ɵNgTimeParser,
  isCustomAdapter,
  NzDateAdapter,
} from 'ng-zorro-jalali/core';

import { NZ_DATE_CONFIG, NzDateConfig, mergeDateConfig } from './date-config';
import { NzI18nService } from './nz-i18n.service';

export function DATE_HELPER_SERVICE_FACTORY(
  injector: Injector,
): DateHelperService {
  const i18n = injector.get(NzI18nService);
  const dateAdapter = injector.get(NzDateAdapter);

  return i18n.getDateLocale() || isCustomAdapter(dateAdapter)
    ? new DateHelperByDateAdapter(i18n, dateAdapter)
    : new DateHelperByDatePipe(i18n, dateAdapter);
}

/**
 * Abstract DateHelperService(Token via Class)
 * Compatibility: compact for original usage by default which using DatePipe
 */
@Injectable({
  providedIn: 'root',
  useFactory: DATE_HELPER_SERVICE_FACTORY,
  deps: [Injector, [new Optional(), NZ_DATE_CONFIG]],
})
export abstract class DateHelperService {
  protected config: NzDateConfig = mergeDateConfig(
    inject(NZ_DATE_CONFIG, { optional: true })
  );
  constructor(
    protected i18n: NzI18nService,
    protected dateAdapter: NzDateAdapter
  ) {
  }

  abstract getISOWeek(date: Date): number;
  abstract getFirstDayOfWeek(): WeekDayIndex;
  abstract format(date: Date | null, formatStr: string): string;
  abstract parseDate(text: string, formatStr?: string): Date;
  abstract parseTime(text: string, formatStr?: string): Date | undefined;
}

/**
 * DateHelper that handles date formats with date-fns
 */
export class DateHelperByDateAdapter extends DateHelperService {
  getISOWeek(date: Date): number {
    return this.dateAdapter.getISOWeek(date);
  }

  // Use date-fns's "weekStartsOn" to support different locale when "config.firstDayOfWeek" is null
  // https://github.com/date-fns/date-fns/blob/v2.0.0-alpha.27/src/locale/en-US/index.js#L23
  getFirstDayOfWeek(): WeekDayIndex {
    let defaultWeekStartsOn: WeekDayIndex;
    try {
      defaultWeekStartsOn = this.i18n.getDateLocale().options!.weekStartsOn!;
    } catch {
      defaultWeekStartsOn = 1;
    }
    return this.config.firstDayOfWeek == null
      ? defaultWeekStartsOn
      : this.config.firstDayOfWeek;
  }

  /**
   * Format a date
   *
   * @see https://date-fns.org/docs/format#description
   * @param date Date
   * @param formatStr format string
   */
  format(date: Date, formatStr: string): string {
    return date
      ? this.dateAdapter.format(date, formatStr, {
          locale: this.i18n.getDateLocale(),
        })
      : '';
  }

  parseDate(text: string, formatStr: string): Date {
    return this.dateAdapter.toNativeDate(
      this.dateAdapter.parse(text, formatStr)
    );
  }

  parseTime(text: string, formatStr: string): Date | undefined {
    return this.parseDate(text, formatStr);
  }
}

/**
 * DateHelper that handles date formats with angular's date-pipe
 *
 * @see https://github.com/NG-ZORRO/ng-zorro-antd/issues/2406 - DatePipe may cause non-standard week bug, see:
 *
 */
export class DateHelperByDatePipe extends DateHelperService {
  getISOWeek(date: Date): number {
    return +this.format(date, 'w');
  }

  getFirstDayOfWeek(): WeekDayIndex {
    if (this.config.firstDayOfWeek === undefined) {
      const locale = this.i18n.getLocaleId();
      return locale && ['en_US'].indexOf(locale.toLowerCase()) > -1
        ? 1
        : 0;
    }
    return this.config.firstDayOfWeek;
  }

  format(date: Date | null, formatStr: string): string {
    // angular formatDate does not support the quarter format parameter. This is to be compatible with the quarter format "Q" of date-fns.
    return date
      ? this.replaceQuarter(
          formatDate(date, formatStr, this.i18n.getLocaleId())!,
          date
        )
      : '';
  }

  parseDate(text: string): Date {
    return new Date(text);
  }

  parseTime(text: string, formatStr: string): Date {
    const parser = new ɵNgTimeParser(formatStr, this.i18n.getLocaleId());
    return parser.toDate(text);
  }

  private replaceQuarter(dateStr: string, date: Date): string {
    const quarter = getQuarter(date).toString();
    const record: Record<string, string> = {
      Q: quarter,
      QQ: `0${quarter}`,
      QQQ: `Q${quarter}`,
    };
    // Q Pattern format compatible with date-fns (quarter).
    return (
      dateStr
        // Match Q+ outside of brackets, then replace it with the specified quarterly format
        .replace(/Q+(?![^[]*])/g, (match) => record[match] ?? quarter)
        // Match the Q+ surrounded by bracket, then remove bracket.
        .replace(/\[(Q+)]/g, '$1')
    );
  }
}
