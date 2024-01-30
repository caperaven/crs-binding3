export function toKebabCase(value) {
    return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function toCamelCase(value) {
    return value.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}