export type Preset = "light" | "dark" | "catppuccin_mocha" | "catppuccin_frappe" | "purple" | "dark_blue";
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

export interface ApiResponse {
    user: {
        name: string;
        id: string;
        year: number;
        role: string;
        is_active: boolean;
        discord: {
            linked: boolean;
            info: {
                id: string;
                username: string;
                avatar: string;
                discriminator: string;
                public_flags: number;
                premium_type: number;
                flags: number;
                banner: string | null;
                accent_color: number;
                global_name: string;
                avatar_decoration_data: string | null;
                banner_color: string;
                mfa_enabled: boolean;
                locale: string;
            };
        };
    };
    status: {
        info: string | null;
        critical: string | null;
        message: string | null;
    };
    reminders: Array<any>;
    weather: {
        last_updated: string;
        forecast: any;
    };
    room_changes: Array<any>;
    daily_verse: {
        content: string;
        reference: string;
        link: string;
    }
}

export type Weather = {
    time: string;
    time_real: string;
    weathercode: {
        icon: string;
        message: string;
    };
    uv_index_max: number;
    temperature_2m_max: number;
    temperature_2m_min: number;
    precipitation_probability_mean: number;
}

export type StatusMessages = {
    info?: string;
    critical?: string;
    message?: string;
}