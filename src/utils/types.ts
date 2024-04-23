export type Preset = string;
export type ThemeType = "preset" | "legacy" | "custom"

export type Theme = {
    type: ThemeType,
    changeNavbar: boolean,
    presetData?: PresetData
    legacyData?: LegacyData
    advancedData?: AdvancedData
}

export type PresetData = {
    preset: Preset,
}
export type LegacyData = {
    colour: string,
    style: "light" | "dark",
}
export type AdvancedData = {
    "theme-text":      string,
    "theme-generic":   string,
    "theme-accent":    string,
    "link-colour":     string,
    "body-background": string
    "navigation-background":   string
}

export type Reminder = {
    id: number,
    title: string,
    method: string,
    due: number,
    assessment: null | number,
}

export type widgInfo = {
    col: 'rightCol' | 'leftCol'
    edit: boolean
    add: boolean
    reminders?: Reminder[]
}

export type RoomChange = {
    class_name: string, // id of the class
    assigned_room: string, // room being moved to
    timetabled_room: string, // room being moved from
}