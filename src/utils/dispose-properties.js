const ignoreDispose = ["_element"];
export async function disposeProperties(obj) {
    if (obj == null || obj.autoDispose == false) return;
    if (typeof obj != "object") return;
    if (Object.isFrozen(obj)) return;

    const properties = Object.getOwnPropertyNames(obj).filter(name => ignoreDispose.indexOf(name) == -1);

    for (let property of properties) {
        const pObj = obj[property];

        if (typeof pObj == "object") {
            if (Array.isArray(pObj) && pObj.length > 0) {
                if (typeof pObj[0] == "object") {
                    for (const item of pObj) {
                        await disposeProperties(item);
                    }
                }

                pObj.length = 0;
            }
            else {
                if (pObj.dispose != null) {
                    await pObj.dispose();
                }

                await disposeProperties(pObj);
            }
        }

        delete obj[property];
    }
}