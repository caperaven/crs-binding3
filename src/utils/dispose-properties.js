const ignoreDispose = ["_element"];
export function disposeProperties(obj) {
    if (obj == null || obj.autoDispose == false) return;
    if (typeof obj != "object") return;
    if (Object.isFrozen(obj)) return;

    const properties = Object.getOwnPropertyNames(obj).filter(name => ignoreDispose.indexOf(name) == -1);

    for (let property of properties) {
        const pObj = obj[property];

        if (typeof pObj == "object") {
            if (Array.isArray(pObj)) {
                for (const item of pObj) {
                    disposeProperties(item);
                }
                pObj.length = 0;
            }
            else {
                disposeProperties(pObj);
            }
        }

        delete obj[property];
    }
}