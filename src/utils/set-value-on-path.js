/**
 * @function setValueOnPath - Sets a value on an object at a given path. (e.g. "person.name")
 * @param obj {object} - The object to set the value on.
 * @param path {string} - The path to the value.
 * @param value {*} - The value to set.
 */
export function setValueOnPath(obj, path, value) {
    if (obj == null || (path || "").length == 0) return;

    const parts = path.split(".");
    const field = parts.pop();

    for (const part of parts) {
        obj = (obj[part] ||= {});
    }

    obj[field] = value;
}