export function isLegacyDay(): boolean {
    return new Date().getDate() === 17 // returns true if today is the 17th day of the month
}