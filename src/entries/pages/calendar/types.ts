export type Day = {
    number: number; // number within the month
    weekNo: number;
    month: number; // 1-12
    id: string; // unique id for Vue list rendering
}

export type Week = {
    days: Day[];
    month: number; // 0-11
    showMonthTitle?: boolean;
    id: number; // unique id for Vue list rendering
}

export type Event = {
    coolbox: boolean; // if it's a custom event or not
    title: string;
    due: Date;
    all_day: boolean;
    type?: "assessment" | "homework" | string;
    subject?: string;
    colour?: string;
}

export type SchoolboxApiEvent= {
    title: string;
    allDay: boolean;
    color: string; // hex
    start: string; // date string
    end: string; // date string
    className: string;
    data: {
        meta: {
            // who knows what most of these keys are tbh, AI wrote this typedef
            editable: boolean;
            eventId: number;
            time: string;
            detail: string;
            location: string;
            eventTypeId: number;
            eventType: string;
            variant: string;
            type: string;
            author: string;
            authorId: number;
            level: string;
            completed: boolean;
            seriesId: null | number;
        };
        links: {
            category: {
                id: number;
                name: string;
            };
        };
    };
};