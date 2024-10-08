export function toKebabCase(value) {
    return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function toCamelCase(value) {
    return value.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

/**
 * @function capitalizePropertyPath - Capitalizes a property path
 * if I have a property path like "inner-text" it will be converted to "innerText"
 * if however the result is innerHtml turn it into innerHTML
 * @param str - The property path to capitalize
 */
export function capitalizePropertyPath(str) {
    if (str.indexOf("-") == -1) return str;

    const parts = str.split("-");

    for (let i = 1; i < parts.length; i++) {
        parts[i] = parts[i].capitalize();
    }

    let result = parts.join("");

    if (result === "innerHtml") {
        result = "innerHTML";
    }

    return result;
}