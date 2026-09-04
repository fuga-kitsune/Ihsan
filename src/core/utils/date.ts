export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatHeaderDates(dateKey?: string, offsetDays: number = 0): { gregorian: string; hijri: string } {
  let targetDate = new Date();
  if (dateKey) {
    const parts = dateKey.split('-');
    if (parts.length === 3) {
      targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  }

  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
  const gregorian = targetDate.toLocaleDateString('en-US', options);

  let hijri = '1447 AH';
  try {
    const adjustedForHijri = new Date(targetDate);
    if (offsetDays !== 0) {
      adjustedForHijri.setDate(adjustedForHijri.getDate() + offsetDays);
    }

    const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijri = hijriFormatter.format(adjustedForHijri);
  } catch {
    const day = targetDate.getDate() + offsetDays;
    hijri = `${day} Rabi al-Awwal 1447 AH`;
  }

  return { gregorian, hijri };
}


