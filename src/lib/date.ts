import { parseISO, format } from 'date-fns';
import { ka } from 'date-fns/locale';

export function formatGeorgianDate(isoDate: string): string {
  return format(parseISO(isoDate), 'd MMMM, yyyy', { locale: ka });
}
