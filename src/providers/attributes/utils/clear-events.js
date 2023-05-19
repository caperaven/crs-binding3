export function clear(uuid, handler) {
    for (const event of Object.keys(crs.binding.eventStore)) {
        delete crs.binding.eventStore[event][uuid];

        if (Object.keys(crs.binding.eventStore[event]).length === 0) {
            delete crs.binding.eventStore[event];
            document.removeEventListener(event, handler);
        }
    }
}