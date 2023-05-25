export function getShortWeekDays() {
    const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });

    return Array.from(Array(7).keys())
        .map((day) => formatter.format(new Date(0, 0, day)))
        .map((weekDay) => weekDay.substring(0, 3).toUpperCase());
}

export function getWeekDayLong(day: number) {
    const weekDayLong = new Date(0, 0, day).toLocaleString('pt-BR', { weekday: 'long' });

    return weekDayLong.charAt(0).toUpperCase() + weekDayLong.slice(1);
}

export function convertTimeStringToMinutes(timeString: string) {
    const [hours, minutes] = timeString.split(':').map(Number);

    return hours * 60 + minutes;
}
