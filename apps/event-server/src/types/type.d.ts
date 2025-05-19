interface Paginated<T> {
  items: T[];
  count: number;
}

type DateTime = string; // ISOString format (YYYY-MM-DDTHH:MM:SS.SSSZ)

type CalendarDate = string; // YYYY-MM-DD
