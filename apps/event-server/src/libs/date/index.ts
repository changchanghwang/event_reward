import * as dayjs from 'dayjs';

export function startOfDay(date: Date) {
  return dayjs(date).startOf('day').toDate();
}

export function endOfDay(date: Date) {
  return dayjs(date).endOf('day').toDate();
}

export function add(date: Date, count: number, unit: 'day' | 'month' | 'year') {
  return dayjs(date).add(count, unit).toDate();
}
