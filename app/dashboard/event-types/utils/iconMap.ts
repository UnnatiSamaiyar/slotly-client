import {
    CalendarDays,
    Globe,
    Link2,
    LucideIcon,
    MapPin,
    Phone,
    Users,
    Video,
    Briefcase,
    Handshake,
    Brain,
    Target,
    FileText,
    Home,
    BarChart3,
    Search,
    MessageCircle,
    Zap,
    UserRound,
} from "lucide-react";

const USER_ICON_MAP: Record<string, LucideIcon> = {
    // base / meeting mode
    video: Video,
    google_meet: Video,
    in_person: MapPin,
    map: MapPin,
    pin: MapPin,
    location: MapPin,

    // modal picker matching
    calendar: CalendarDays,
    phone: Phone,
    briefcase: Briefcase,
    handshake: Handshake,
    user: UserRound,
    person: UserRound,
    chart: BarChart3,
    analytics: BarChart3,
    brain: Brain,
    target: Target,
    file: FileText,
    document: FileText,
    home: Home,
    house: Home,
    users: Users,
    team: Users,
    group: Users,
    zap: Zap,
    search: Search,
    discover: Search,
    message: MessageCircle,
    chat: MessageCircle,

    // existing extras
    link: Link2,
    globe: Globe,
};

type ResolveArgs = {
    userIcon?: string | null;
    locationType?: string | null;
};

export function resolveEventIcon({
    userIcon,
    locationType,
}: ResolveArgs): LucideIcon {
    // 1. user selected icon
    if (userIcon) {
        const key = userIcon.toLowerCase().trim();
        if (USER_ICON_MAP[key]) {
            return USER_ICON_MAP[key];
        }
    }

    // 2. meeting type fallback
    const type = String(locationType || "").toLowerCase().trim();
    if (USER_ICON_MAP[type]) {
        return USER_ICON_MAP[type];
    }

    // 3. final fallback
    return CalendarDays;
}