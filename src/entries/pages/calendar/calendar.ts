const eventSpacing = 30;

// temporarily disabled
export function coolboxifyCalendar() {
    // setInterval(() => {
    //     cCalendar();
    // }, 500);
}
function cCalendar() {
    if (!document.querySelector(".fc-button-active[title='Month view']")) {return}
    const days: HTMLDivElement[] = Array.from(document.querySelectorAll(".fc-daygrid-day-frame"));
    let carryOverEvents = 0;
    for (const day of days) {
        day.querySelector(".fc-daygrid-day-bottom")?.remove();
        const events: HTMLDivElement[] = Array.from(day.querySelectorAll(".fc-daygrid-event-harness"));
        let eventCount = 0;
        for (const event of events) {
            if ((event.style.right && event.style.right !== "0px") || !event.querySelector(".fc-event").matches(".fc-event-start.fc-event-end:not(.source5)")) {
                event.style.visibility = "hidden";
                continue;
            }
            event.style.visibility = "visible";
            event.style.top = `${(eventCount + carryOverEvents) * eventSpacing}px`
            event.style.marginTop = "0px";
            event.classList.add("fc-daygrid-event-harness-abs");
            const inner = event.querySelector(".fc-event-main");
            if (inner.scrollWidth > inner.clientWidth) {
                inner.classList.add('expandable');
            }
            eventCount += 1;
        }
        day.style.height = `${Math.max((eventCount + carryOverEvents + 1) * eventSpacing, 70)}px`;
    }
}
// todo, fancify week events?