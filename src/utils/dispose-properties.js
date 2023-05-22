const ignoreDispose = ["_element"];

/**
 * Disposes all properties of an object that are objects.
 * If the object has a dispose method, it will be called.
 * Properties are deleted from the object.
 *
 * This is a recursive function, so it does an aggressive cleanup.
 * @param obj {Object} - The object to dispose.
 */
export function disposeProperties(obj) {
    if (obj == null || obj.autoDispose == false) return;
    if (typeof obj != "object") return;
    if (Object.isFrozen(obj)) return;
    if (Array.isArray(obj)) {
        return obj.length = 0;
    }

    const properties = Object.getOwnPropertyNames(obj).filter(name => ignoreDispose.indexOf(name) == -1);

    for (let property of properties) {
        let pObj = obj[property];

        if (typeof pObj == "object") {
            if (Array.isArray(pObj) && pObj.length > 0) {
                if (typeof pObj[0] == "object") {
                    for (const item of pObj) {
                        disposeProperties(item);
                    }
                }

                pObj.length = 0;
            }
            else if (pObj.constructor.name === "Set" || pObj.constructor.name === "Map") {
                pObj.clear();
            }
            else {
                if (pObj.dispose != null) {
                    pObj.dispose();
                }

                disposeProperties(pObj);
            }
        }

        pObj = null;
        delete obj[property];
    }
}