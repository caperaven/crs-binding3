export function clear(uuid, events, handler) {
    for (const event of Object.keys(events)) {
        delete events[event][uuid];

        if (Object.keys(events[event]).length === 0) {
            delete events[event];
            document.removeEventListener(event, handler);
        }
    }
}