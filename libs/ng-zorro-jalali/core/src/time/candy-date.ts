/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { inject } from '@angular/core';

import { IndexableObject } from 'ng-zorro-antd/core/types';

import { NzDateAdapter } from './date-adapter';

export type CandyDateMode =
  | 'decade'
  | 'year'
  | 'quarter'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second';
export type NormalizedMode = 'decade' | 'year' | 'month';
export type WeekDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CandyDateType<D extends string | number | Date = Date> =
  CandyDate<D> | null;
export type SingleValue = CandyDate | null;
export type CompatibleValue = SingleValue | SingleValue[];
export type CandyDateFac = (date?: any) => CandyDate<any>;

export function wrongSortOrder(rangeValue: SingleValue[]): boolean {
  const [start, end] = rangeValue;
  return !!start && !!end && end.isBeforeDay(start);
}

export function normalizeRangeValue(
  adapter: NzDateAdapter,
  value: SingleValue[],
  hasTimePicker: boolean,
  type: NormalizedMode = 'month',
  activePart: 'left' | 'right' = 'left'
): CandyDate[] {
  const [start, end] = value;
  let newStart: CandyDate = start || new CandyDate(adapter);
  let newEnd: CandyDate =
    end || (hasTimePicker ? newStart : newStart.add(1, type));

  if (start && !end) {
    newStart = start;
    newEnd = hasTimePicker ? start : start.add(1, type);
  } else if (!start && end) {
    newStart = hasTimePicker ? end : end.add(-1, type);
    newEnd = end;
  } else if (start && end && !hasTimePicker) {
    if (start.isSame(end, type)) {
      newEnd = newStart.add(1, type);
    } else {
      if (activePart === 'left') {
        newEnd = newStart.add(1, type);
      } else {
        newStart = newEnd.add(-1, type);
      }
    }
  }
  return [newStart, newEnd];
}

export function cloneDate(value: CompatibleValue): CompatibleValue {
  if (Array.isArray(value)) {
    return value.map((v) => (v instanceof CandyDate ? v.clone() : null));
  } else {
    return value instanceof CandyDate ? value.clone() : null;
  }
}

export function CANDY_DATE_FACTORY(adapter: NzDateAdapter<any>): CandyDateFac {
  return (date?: any): CandyDate<any> => new CandyDate<any>(adapter, date);
}

/**
 * Wrapping kind APIs for date operating and unify
 * NOTE: every new API return new CandyDate object without side effects to the former Date object
 * NOTE: most APIs are based on local time other than customized locale id (this needs tobe support in future)
 * TODO: support format() against to angular's core API
 */
import { InjectionToken } from '@angular/core';

// Provide an injection token that yields a CandyDate factory function.
export const CANDY_DATE = new InjectionToken<CandyDateFac>('CANDY_DATE', {
  providedIn: 'root',
  factory: () => CANDY_DATE_FACTORY(inject(NzDateAdapter))
});

export class CandyDate<D extends Date | string | number = Date> implements IndexableObject {
  // Use a late-initialized property and set it in constructor so we can support
  // both DI (no-arg) construction and manual construction with an adapter.
  private dateAdapter!: NzDateAdapter<D>;

  date!: D;
  nativeDate!: Date;

  // locale: string; // Custom specified locale ID

  // Accept optional adapter and date to match usages like `new CandyDate(adapter, date)`
  constructor(adapter?: NzDateAdapter<D>, date?: D | Date | string | number) {
    // If adapter not provided, fall back to DI
    this.dateAdapter = adapter ?? inject<NzDateAdapter<D>>(NzDateAdapter);

    if (date) {
      if (typeof date === 'string' || typeof date === 'number')
        console.warn(
          'The string type is not recommended for date-picker, use "Date" type'
        );

      try {
        this.date = this.dateAdapter.deserialize(date as any);
      } catch (e) {
        throw new Error(
          'The input date type is not supported ("Date" is now recommended)'
        );
      }
    } else {
      this.date = this.dateAdapter.today();
    }

    this.nativeDate = this.dateAdapter.toNativeDate(this.date);
  }

  calendarStart(options?: {
    weekStartsOn: WeekDayIndex | undefined;
  }): CandyDate<D> {
    return new CandyDate<D>(
      this.dateAdapter,
      this.dateAdapter.calendarStartOfWeek(
        this.dateAdapter.calendarStartOfMonth(this.date),
        options
      )
    );
  }

  // ---------------------------------------------------------------------
  // | Native shortcuts
  // -----------------------------------------------------------------------------\

  getYear(): number {
    return this.dateAdapter.getYear(this.date);
  }

  getMonth(): number {
    return this.dateAdapter.getMonth(this.date);
  }

  getDay(): number {
    return this.dateAdapter.getDay(this.date);
  }

  getTime(): number {
    return this.dateAdapter.getTime(this.date);
  }

  getDate(): number {
    return this.dateAdapter.getDate(this.date);
  }

  getHours(): number {
    return this.dateAdapter.getHours(this.date);
  }

  getMinutes(): number {
    return this.dateAdapter.getMinutes(this.date);
  }

  getSeconds(): number {
    return this.dateAdapter.getSeconds(this.date);
  }

  getMilliseconds(): number {
    return this.dateAdapter.getMilliseconds(this.date);
  }

  // ---------------------------------------------------------------------
  // | New implementing APIs
  // ---------------------------------------------------------------------

  clone(): CandyDate<D> {
    return new CandyDate<D>(
      this.dateAdapter,
      this.dateAdapter.clone(this.date)
    );
  }

  setHms(hour: number, minute: number, second: number): CandyDate<D> {
    return new CandyDate<D>(
      this.dateAdapter,
      this.dateAdapter.setHms(this.date, hour, minute, second)
    );
  }

  setYear(year: number): CandyDate<D> {
    return new CandyDate<D>(
      this.dateAdapter,
      this.dateAdapter.setYear(this.date, year)
    );
  }

  addYears(amount: number): CandyDate<D> {
    return new CandyDate<D>(
      this.dateAdapter,
      this.dateAdapter.addYears(this.date, amount)
    );
  }

  // NOTE: month starts from 0
  // NOTE: Don't use the native API for month manipulation as it not restrict the date when it overflows, eg. (new Date('2018-7-31')).setMonth(1) will be date of 2018-3-03 instead of 2018-2-28
  setMonth(month: number): CandyDate<D> {
    return new CandyDate<D>(
      this.dateAdapter,
      this.dateAdapter.setMonth(this.date, month)
    );
  }

  addMonths(amount: number): CandyDate<D> {
    return new CandyDate<D>(
      this.dateAdapter,
      this.dateAdapter.addMonths(this.date, amount)
    );
  }

  setDay(day: number, options?: { weekStartsOn: WeekDayIndex }): CandyDate<D> {
    return new CandyDate(
      this.dateAdapter,
      this.dateAdapter.setDay(this.date, day, options)
    );
  }

  setDate(amount: number): CandyDate<D> {
    return new CandyDate<D>(
      this.dateAdapter,
      this.dateAdapter.setDate(this.date, amount)
    );
  }

  getQuarter(): number {
    return this.dateAdapter.getQuarter(this.date);
  }

  setQuarter(quarter: number): CandyDate<D> {
    return new CandyDate<D>(
      this.dateAdapter,
      this.dateAdapter.setQuarter(this.date, quarter)
    );
  }

  addDays(amount: number): CandyDate<D> {
    return new CandyDate<D>(
      this.dateAdapter,
      this.dateAdapter.addDays(this.date, amount)
    );
  }

  add(amount: number, mode: NormalizedMode): CandyDate<D> {
    switch (mode) {
      case 'decade':
        return this.addYears(amount * 10);
      case 'year':
        return this.addYears(amount);
      case 'month':
        return this.addMonths(amount);
      default:
        return this.addMonths(amount);
    }
  }

  isSame(candyDate: CandyDateType<D>, grain: CandyDateMode = 'day'): boolean {
    if (!candyDate) return false;

    return this.dateAdapter.isSame(this.date, candyDate.date, grain);
  }

  isSameYear(date: CandyDateType<D>): boolean {
    return this.isSame(date, 'year');
  }

  isSameQuarter(date: CandyDateType<D>): boolean {
    return this.isSame(date, 'quarter');
  }

  isSameMonth(date: CandyDateType<D>): boolean {
    return this.isSame(date, 'month');
  }

  isSameDay(date: CandyDateType<D>): boolean {
    return this.isSame(date, 'day');
  }

  isSameHour(date: CandyDateType<D>): boolean {
    return this.isSame(date, 'hour');
  }

  isSameMinute(date: CandyDateType<D>): boolean {
    return this.isSame(date, 'minute');
  }

  isSameSecond(date: CandyDateType<D>): boolean {
    return this.isSame(date, 'second');
  }

  isBefore(candyDate: CandyDateType<D>, grain: CandyDateMode = 'day'): boolean {
    if (!candyDate) return false;

    return this.dateAdapter.isBefore(this.date, candyDate.date, grain);
  }

  isBeforeYear(date: CandyDateType<D>): boolean {
    return this.isBefore(date, 'year');
  }

  isBeforeQuarter(date: CandyDateType<D>): boolean {
    return this.isBefore(date, 'quarter');
  }

  isBeforeMonth(date: CandyDateType<D>): boolean {
    return this.isBefore(date, 'month');
  }

  isBeforeDay(date: CandyDateType<D>): boolean {
    return this.isBefore(date, 'day');
  }

  // Equal to today accurate to "day"
  isToday(): boolean {
    return this.dateAdapter.isToday(this.date);
  }

  isValid(): boolean {
    return this.dateAdapter.isValid(this.date);
  }

  isFirstDayOfMonth(): boolean {
    return this.dateAdapter.isFirstDayOfMonth(this.date);
  }

  isLastDayOfMonth(): boolean {
    return this.dateAdapter.isLastDayOfMonth(this.date);
  }
}
