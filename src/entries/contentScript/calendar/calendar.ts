const eventSpacing = 30;

export function coolboxifyCalendar() {
    // document.addEventListener("OVERLAY_LOADER_HIDE", () => {
    //     setTimeout(() => {
    //         cCalendar();
    //     })
    // })
    // // const calendar = document.getElementById("calendar");
    // const loading = document.querySelector(".preview.loader");
    // if (!loading) {
    //     cCalendar();
    // }
    // return
    setInterval(() => {
        cCalendar();
    }, 500);
    // const observer = new MutationObserver((mutations) => {
    //     console.log(mutations);
    // })
    // observer.observe(calendar, {childList: true, subtree: true});
    // observer.observe(document.querySelector(".preview.loader"), {childList: true, subtree: true});
}
function cCalendar() {
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