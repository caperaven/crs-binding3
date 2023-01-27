/**
 * @function getPathOfFile - Returns the path of a file.
 * This function ensures that the path you send on ends with a /
 * @param file {string} - The file to get the path of.
 * @returns {string|*}
 */
export function getPathOfFile(file) {
    if (file == null) return;
    if (file.endsWith("/")) return file;

    const parts = file.split("/");
    parts.pop();
    return `${parts.join("/")}/`;
}

