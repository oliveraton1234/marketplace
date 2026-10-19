const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const integer = new Intl.NumberFormat('es-MX');

/** `3200` → `$3,200` */
export const formatMoney = (amount: number) => mxn.format(amount).replace(/\s?MXN/, '');

/** `1250` → `1,250` */
export const formatNumber = (value: number) => integer.format(value);

/** `2.1` → `2.1 km` */
export const formatDistance = (km: number) => `${km.toFixed(1).replace(/\.0$/, '')} km`;

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
