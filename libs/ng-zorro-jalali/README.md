# ng-zorro-jalali

A lightweight Angular library that adds **Jalali (Persian) calendar support** to `ng-zorro-antd` date components. It provides a pluggable date adapter, Persian i18n, and customizable date formats for a seamless Persian user experience.

---

## Installation

Install the library and recommended dependencies:

```bash
npm i ng-zorro-jalali jalali-moment
# or
yarn add ng-zorro-jalali jalali-moment
```

## Quick Start


### Import Modules

```ts
import { CalendarModule } from 'ng-zorro-jalali/calendar';
import { DatePickerModule } from 'ng-zorro-jalali/date-picker';

@NgModule({
  imports: [
    CalendarModule,
    DatePickerModule
  ]
})
export class AppModule {}
```

### Configure Persian Locale (Optional)
```ts
import { LOCALE_ID } from '@angular/core';
import { fa_IR } from 'ng-zorro-jalali/i18n';
import { registerLocaleData } from '@angular/common';
import fa from '@angular/common/locales/fa';

registerLocaleData(fa);

providers: [
  { provide: LOCALE_ID, useValue: 'fa' },
  provideNzI18n(fa_IR)
]

```

### Usage Examples

#### 1) Single DatePicker
```html
<nz-date-picker [(ngModel)]="value" nzFormat="yyyy/MM/dd"></nz-date-picker>
```

#### 2) RangePicker
```html
<nz-range-picker [(ngModel)]="range" nzFormat="yyyy/MM/dd"></nz-range-picker>
```

#### 3) Calendar
```html
<nz-calendar [(ngModel)]="selectedDate"></nz-calendar>
```

#### 4) Reactive Forms
```ts
form = this.fb.group({
  dob: [null],
});
```
```html
<form [formGroup]="form">
  <nz-date-picker formControlName="dob" nzFormat="yyyy/MM/dd"></nz-date-picker>
</form>
```

