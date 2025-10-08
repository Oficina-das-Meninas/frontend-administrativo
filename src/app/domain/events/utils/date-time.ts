export class DateTimeUtils {
  static formatForBackend(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  static combineDateTime(date: Date, time: string): Date {
    const eventDateTime = new Date(date);

    if (time && time !== '--:--' && time.trim() !== '') {
      const [hours, minutes] = time.split(':');
      eventDateTime.setHours(parseInt(hours, 10));
      eventDateTime.setMinutes(parseInt(minutes, 10));
    }

    return eventDateTime;
  }
}
