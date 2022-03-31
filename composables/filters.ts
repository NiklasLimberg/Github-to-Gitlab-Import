export function dateFilter(date: string):string {
    return new Date(date).toLocaleDateString(undefined, { weekday: 'long',
        year: 'numeric',
        month: 'numeric', 
        day: 'numeric' 
    })
}

export function timeElapsedFilter(startTime: string): string {
    const startUnix = Date.parse(startTime);
    return new Date(Date.now() - startUnix).toTimeString().replace(/.*(\d{2}:\d{2})(:\d{2}).*/, "$1");
}

export function capitalize(string: string):string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}