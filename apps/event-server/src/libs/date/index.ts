import * as dayjs from 'dayjs';

export function startOfDay(date: CalendarDate) {
  return dayjs(date).startOf('day').format('YYYY-MM-DD');
}

export function add(
  date: CalendarDate,
  count: number,
  unit: 'day' | 'month' | 'year',
) {
  return dayjs(date).add(count, unit).format('YYYY-MM-DD');
}
