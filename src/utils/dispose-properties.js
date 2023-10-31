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

    // ignore primitives
    // this will include things like strings, numbers, ...
    if (typeof obj != "object") return;

    // ignore frozen objects as they can not be changed
    if (Object.isFrozen(obj)) return;

    // dispose of array items
    if (Array.isArray(obj)) {
        return disposeArray(obj);
    }

    // dispose of set and map items
    if (obj instanceof Set || obj instanceof Map) {
        return disposeMapSet(obj);
    }

    // get all properties of the object that we must dispose of.
    // ignore properties that are in the ignoreDispose array.
    const properties = Object.getOwnPropertyNames(obj).filter(name => ignoreDispose.indexOf(name) == -1);

    for (let property of properties) {
        let pObj = obj[property];

        if (pObj == null) continue;

        if (typeof pObj == "object") {
            if (pObj.autoDispose == false) continue;

            if (Array.isArray(pObj)) {
                disposeArray(pObj);
            }
            else if (pObj instanceof Set || pObj instanceof Map) {
                disposeMapSet(pObj);
            }
            else {
                if (pObj.dispose != null) {
                    pObj.dispose();
                }

                disposeProperties(pObj);
            }
        }

        try {
            pObj = null;
            delete obj[property];
        }
        catch {
            // ignore
        }
    }
}

function disposeArray(array) {
    if (array.length === 0) return;

    for (const item of array) {
        disposeProperties(item);
    }

    array = null;
}

function disposeMapSet(obj) {
    obj.forEach(item => disposeProperties(item));
    obj.clear();
    obj = null;
}