/**
 * This function ensures that the path you send on ends with a /
 * @param file
 * @returns {string|*}
 */

export function getPathOfFile(file) {
    if (file == null) return;
    if (file.endsWith("/")) return file;

    const parts = file.split("/");
    parts.pop();
    return `${parts.join("/")}/`;
}

