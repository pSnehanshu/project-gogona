import { format } from 'date-fns';

export function formatDate(givenDate: string | Date) {
  const date = typeof givenDate === 'string' ? new Date(givenDate) : givenDate;
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return format(date, 'MMM do, yyyy hh:mm bbb');
}
