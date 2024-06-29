export function toMondayBased(number: number) {
    return (number || 7) - 1;
}

// Credit to https://www.epochconverter.com/daynumbers
export function getDayOfYear(date: Date) {
    return Math.ceil((date.getTime() - new Date(date.getFullYear(),0,1).getTime()) / 86400000);
}

const currentYear = new Date().getFullYear();

export function dayIndexToMonthDay(index: number, year = currentYear): [number, number] {
    const date = new Date(year, 0); // start at the beginning of the year
    date.setDate(index); // set the date to the day of the year
    return [date.getMonth(), date.getDate()];
}