<p align="center">
  <a href="https://ng.ant.design">
    <img alt="logo" width="230" src="https://img.alicdn.com/tfs/TB1TFFaHAvoK1RjSZFwXXciCFXa-106-120.svg">
  </a>
</p>

<h1 align="center">
ng-zorro-jalali
</h1>


A library that adds Jalali (Persian) calendar support to `ng-zorro-antd` date components in Angular apps. It provides a pluggable date adapter, Persian i18n, and customizable date formats for a seamless Persian user experience.

---

### Table of Contents

1. [Features](#features)
2. [Prerequisites & Compatibility](#prerequisites--compatibility)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [Date & i18n Configuration](#date--i18n-configuration)
6. [Usage Examples](#usage-examples)
    - Single DatePicker
    - RangePicker
    - Calendar
    - Reactive Forms
    - Disabling Dates
7. [API & Tokens](#api--tokens)
8. [Tips & Common Pitfalls](#tips--common-pitfalls)
9. [Development & Contribution](#development--contribution)
10. [Changelog](#changelog)
11. [License](#license)

---

### Features

- Full Jalali (Persian) calendar support in `ng-zorro-antd` date components
- Switchable date adapter (defaults to `date-fns`, optional `jalali-moment` adapter)
- Integrated with Angular i18n and locale (provides `fa_IR` for Zorro and `fa` for Angular)
- Fully customizable display formats via `NZ_DATE_CONFIG`
- Works with both Reactive and Template-driven Forms
- Modular, maintainable design

---

### Prerequisites & Compatibility

- Angular: 20.x
- ng-zorro-antd: 20.x
- Node: 18+ recommended

Note: This library uses `date-fns` by default. If you prefer a custom adapter like `jalali-moment`, install it yourself and provide it in `providers`.

---

### Installation

Install with npm or yarn:

```bash
# Install the library and recommended peer deps
npm i ng-zorro-jalali jalali-moment
# or
yarn add ng-zorro-jalali jalali-moment
```

If your project doesn’t already use `ng-zorro-antd`, add it first.

---

### Quick Start

For Standalone apps (Angular 16+), add the providers in `app.config.ts`:

```ts
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNzI18n } from 'ng-zorro-antd/i18n';
import { NzDateAdapter } from 'ng-zorro-jalali/core';
import { NZ_DATE_CONFIG, NZ_DATE_LOCALE, fa_IR } from 'ng-zorro-jalali/i18n';
import { faIR } from 'date-fns/locale';
import { registerLocaleData } from '@angular/common';
import fa from '@angular/common/locales/fa';

// Run once
registerLocaleData(fa);

// Optional: use a custom adapter (e.g., jalali-moment)
import { JalaliMomentDateAdapter } from './nz-jalali-moment.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideNzI18n(fa_IR),              // Persian i18n for ng-zorro
    { provide: LOCALE_ID, useValue: 'fa' },
    { provide: NZ_DATE_LOCALE, useValue: faIR }, // locale for date-fns

    // The library defaults to a date-fns-based adapter.
    // To switch to jalali-moment, uncomment the following line:
    { provide: NzDateAdapter, useClass: JalaliMomentDateAdapter },

    // Display formats and date config
    {
      provide: NZ_DATE_CONFIG,
      useValue: {
        displayFormats: {
          dateInput: 'yyyy/MM/dd',        // note date-fns casing
          dateTimeInput: 'yyyy-MM-dd HH:mm:ss',
          shortWeekLabel: 'EEEEE',
          veryShortWeekLabel: 'EEEEEE',
        },
      },
    },
  ],
};
```

You can now use `ng-zorro-antd` date components as usual; the Jalali calendar and formatting will apply automatically.

---

### Date & i18n Configuration

- `NZ_DATE_CONFIG`:
    - `firstDayOfWeek`: sets the first day of the week (0–6)
    - `displayFormats`: a set of display formats such as `dateInput`, `dateTimeInput`, `monthYearLabel`, etc.
- `NZ_DATE_LOCALE`: sets the locale for the date library (use `faIR` for `date-fns`)
- `provideNzI18n(fa_IR)`: enables Persian translations for Zorro components
- `LOCALE_ID = 'fa'`: enables Persian date/number formatting across Angular

Internal defaults (excerpt):

```json
{
  "displayFormats": {
    "dateInput": "yyyy-MM-dd",
    "dateTimeInput": "yyyy-MM-dd HH:mm:ss",
    "dayLabel": "dd",
    "weekLabel": "ddd",
    "monthLabel": "MMM",
    "yearLabel": "yyyy",
    "weekYearLabel": "yyyy-ww",
    "quarterLabel": "yyyy-[Q]Q",
    "monthYearLabel": "yyyy-MM",
    "shortWeekLabel": "EEEEE",
    "veryShortWeekLabel": "EEEEEE"
  }
}
```

---

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

#### 5) Disabling Dates
```ts
isDisabled = (d: Date) => {
  // Example: disable Fridays
  return d.getDay() === 5;
};
```
```html
<nz-date-picker [nzDisabledDate]="isDisabled"></nz-date-picker>
```

---

### API & Tokens

- `NzDateAdapter` (Abstract): abstraction for date operations. Default: `DateFnsDateAdapter`.
- `NZ_DATE_CONFIG: InjectionToken<NzDateConfig>`: date configuration and display formats.
- `NZ_DATE_LOCALE: InjectionToken<any>`: locale for the date library (use `faIR` for `date-fns`).
- `fa_IR`: Persian i18n configuration for `ng-zorro-antd`.

In short, by providing these tokens in your `providers`, all Zorro date controls become consistent and Jalali-enabled.

---

### Tips & Common Pitfalls

- `date-fns` pattern casing matters: `yyyy` = year, `MM` = month, `dd` = day of month. Do not use `DD` (that’s a moment.js pattern).
- If you don’t set `fa_IR`, component labels may remain in English.
- For a custom adapter (e.g., `jalali-moment`), ensure you correctly provide the adapter class to `NzDateAdapter`.
- When using SSR, call `registerLocaleData(fa)` only in the browser or add appropriate guards.

---

### Development & Contribution

- Built and developed with Nx. Project structure:
    - Library: `libs/ng-zorro-jalali`
    - Playground app: `apps/playground`
- Contributions are welcome! Please open an Issue or submit a Pull Request for improvements to the API or docs.

Common commands (may vary based on your workspace setup):

```bash
# Build the library
npx nx build ng-zorro-jalali

# Serve the playground (if configured)
npx nx serve playground
```

---

### Changelog

Track changes via Releases or Git log.

---

### License

MIT