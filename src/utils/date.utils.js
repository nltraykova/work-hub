export function formatDateLong(date) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(date);

    return formattedDate;
}

export function formatDateShort(date) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);

    return formattedDate;
}

export function formatLastUpdated(date) {
    if (isToday(date)) {
        return 'Today';
    }

    return formatDateLong(date);
}

export function isToday(date = new Date()) {
    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

export function isGreaterThanOrEqualToToday(date) {
    const today = new Date();

    const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );

    const dateOnly = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );

    return dateOnly >= todayOnly;
}