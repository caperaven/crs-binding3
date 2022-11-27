export async function translateFactory(exp) {
    if (exp?.length > 0 && exp.indexOf("&{") == -1) return exp;

    return replaceTranslation(exp.split("")).join("");
}

function replaceTranslation(expArray) {
    const start = expArray.indexOf("&");
    if (start == -1 || expArray[start + 1] != "{") return expArray;

    const end = expArray.indexOf("}", start);
    const exp = expArray.slice(start + 2, end).join("");
    const code = ["${crs.binding.translations.get('", exp, "')}"].join("");
    expArray.splice(start, exp.length + 3, code);
    return replaceTranslation(expArray);
}

crs.binding.expression.translateFactory = translateFactory;