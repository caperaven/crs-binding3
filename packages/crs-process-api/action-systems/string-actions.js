class StringActions {
  static async perform(step, context, process, item) {
    await this[step.action]?.(step, context, process, item);
  }
  static async inflate(step, context, process, item) {
    if (step.args.parameters == null) {
      return step.args.template;
    }
    let template = step.args.template;
    let parameters = step.args.parameters;
    let result = await inflate_string(template, parameters, context, process, item);
    if (result.indexOf("&{") != -1) {
      result = translate_string(result);
    }
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async translate(step, context, process, item) {
    const template = await crs.process.getValue(step.args.template, context, process, item);
    let result = template;
    if (result.indexOf("&{") != -1) {
      result = translate_string(result);
    }
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async to_array(step, context, process, item) {
    let str = await crs.process.getValue(step.args.source, context, process, item);
    let result = str.split(step.args.pattern);
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async from_array(step, context, process, item) {
    let array = await crs.process.getValue(step.args.source, context, process, item);
    let separator = step.args.separator || "";
    let result = array.join(separator);
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async replace(step, context, process, item) {
    let str = await crs.process.getValue(step.args.source, context, process, item);
    const pattern = await crs.process.getValue(step.args.pattern, context, process, item);
    const value = await crs.process.getValue(step.args.value, context, process, item);
    let result = str.split(pattern).join(value);
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async get_query_string(step, context, process, item) {
    const str = await crs.process.getValue(step.args.source, context, process, item);
    const complex_parameters = await crs.process.getValue(step.args.complex_parameters, context, process, item);
    if ((str || "").trim() === "")
      return;
    let result;
    const queryStr = str.includes("?") ? str.split("?")[1] : str;
    const searchParams = new URLSearchParams(queryStr);
    for (const [key, value] of searchParams) {
      if ((key || "").trim() === "" || (value || "").trim() === "")
        continue;
      if ((complex_parameters || []).includes(key)) {
        const nestedParamPairs = value.split(";");
        for (const nestedParamPair of nestedParamPairs) {
          const nestedParamResult = await this.get_query_string({ args: { source: nestedParamPair } });
          if (nestedParamResult != null) {
            result = result || {};
            result[key] = result[key] || {};
            Object.assign(result[key], nestedParamResult);
          }
        }
        continue;
      }
      result = result || {};
      result[key] = value;
    }
    if (step.args.target != null && result != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async template(step, context, process, item) {
    let template = await crs.process.getValue(step.args.template, context, process, item);
    const options = await crs.process.getValue(step.args.options, context, process, item);
    for (const key of Object.keys(options)) {
      template = template.replaceAll(`__${key}__`, options[key]);
    }
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, template, context, process, item);
    }
    return template;
  }
  static async slice(step, context, process, item) {
    const value = await crs.process.getValue(step.args.value, context, process, item);
    const index = await crs.process.getValue(step.args.index || 0, context, process, item);
    const length = await crs.process.getValue(step.args.length, context, process, item);
    const overflow = await crs.process.getValue(step.args.overflow || null, context, process, item);
    const endIndex = index + length;
    let result = value.substring(index, endIndex);
    if (overflow === "ellipsis") {
      if (value.length > result.length) {
        result = `${result.substring(0, length - 3)}...`;
      }
    }
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
}
async function inflate_string(string, parameters, context, process, item) {
  string = string.split("${").join("${context.");
  const localParameters = await sanitise_parameters(parameters, context, process, item);
  let fn = new Function("context", ["return `", string, "`;"].join(""));
  let result = fn(localParameters);
  fn = null;
  return result;
}
async function sanitise_parameters(parameters, context, process, item) {
  const keys = Object.keys(parameters);
  const returnParameters = {};
  for (let key of keys) {
    let value = parameters[key];
    returnParameters[key] = await crs.process.getValue(value, context, process, item);
  }
  return returnParameters;
}
async function translate_string(value) {
  const si = value.indexOf("&{");
  const ei = value.indexOf("}", si + 1);
  const key = value.substring(si + 2, ei);
  const trans = await crsbinding.translations.get(key);
  value = value.split(`&{${key}}`).join(trans);
  if (value.indexOf("&{") != -1) {
    return translate_string(value);
  }
  return value;
}
crs.intent.string = StringActions;
export {
  StringActions
};
