// Configuración de locale para español
export const LOCALE_ES = {
  // Meses
  months: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  
  // Meses cortos
  monthsShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  
  // Días de la semana
  weekdays: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  
  // Días de la semana cortos
  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
  
  // Formato de fecha
  dateFormat: 'dd/MM/yyyy',
  
  // Formato de hora
  timeFormat: 'HH:mm:ss'
};

// Función para formatear fechas en español
export function formatDateSpanish(date: Date | string, format: string = 'MMMM yyyy'): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Fecha inválida';
  }
  
  const month = d.getMonth();
  const year = d.getFullYear();
  
  switch (format) {
    case 'MMMM yyyy':
      return `${LOCALE_ES.months[month]} ${year}`;
    case 'MMMM':
      return LOCALE_ES.months[month];
    case 'MMM yyyy':
      return `${LOCALE_ES.monthsShort[month]} ${year}`;
    case 'yyyy-MM':
      return `${year}-${String(month + 1).padStart(2, '0')}`;
    default:
      return `${LOCALE_ES.months[month]} ${year}`;
  }
}
