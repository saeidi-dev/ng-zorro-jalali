import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { differenceInCalendarDays, setHours, getISOWeek } from 'date-fns';
import {
  DisabledTimeFn,
  DisabledTimePartial,
  NzDatePickerSizeType,
  NzPlacement,
} from 'ng-zorro-antd/date-picker';
import { NzCalendarMode, NzCalendarModule } from 'ng-zorro-jalali/calendar';
import { NzDatePickerModule } from 'ng-zorro-jalali/date-picker';

@Component({
  imports: [
    FormsModule,
    NzCardModule,
    NzSpaceModule,
    NzSelectModule,
    NzTabsModule,
    NzRadioModule,
    NzCalendarModule,
    NzDatePickerModule,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  date = null;
  dateRange = null;
  mode = 'date';
  dateFormat = 'yyyy/MM/DD';
  monthFormat = 'yyyy/MM';
  quarterFormat = 'yyyy/[Q]Q';

  size: NzDatePickerSizeType = 'default';

  today = new Date();
  timeDefaultValue = setHours(new Date(), 0);

  plainFooter = 'plain extra footer';
  footerRender = (): string => 'extra footer';

  rangeDate = null;

  placement: NzPlacement = 'bottomLeft';

  dateCalendar = new Date();
  modeCalendar: NzCalendarMode = 'month';

  panelChange(change: { date: Date; mode: string }): void {
    console.log(change.date, change.mode);
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  getWeek(result: Date[]): void {
    console.log('week: ', result.map(getISOWeek));
  }

  onChangeTime(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onOk(result: Date | Date[] | null): void {
    console.log('onOk', result);
  }

  onCalendarChange(result: Array<Date | null>): void {
    console.log('onCalendarChange', result);
  }

  /** Disabled Date & Time **/

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) > 0;

  disabledDateTime: DisabledTimeFn = () => ({
    nzDisabledHours: () => this.range(0, 24).splice(4, 20),
    nzDisabledMinutes: () => this.range(30, 60),
    nzDisabledSeconds: () => [55, 56],
  });

  disabledRangeTime: DisabledTimeFn = (_value, type?: DisabledTimePartial) => {
    if (type === 'start') {
      return {
        nzDisabledHours: () => this.range(0, 60).splice(4, 20),
        nzDisabledMinutes: () => this.range(30, 60),
        nzDisabledSeconds: () => [55, 56],
      };
    }
    return {
      nzDisabledHours: () => this.range(0, 60).splice(20, 4),
      nzDisabledMinutes: () => this.range(0, 31),
      nzDisabledSeconds: () => [55, 56],
    };
  };
}
