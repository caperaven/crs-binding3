class ObjectActions {
  static async perform(step, context, process, item) {
    return await this[step.action](step, context, process, item);
  }
  static async set(step, context, process, item) {
    const properties = await crs.process.getValue(step.args.properties, context, process, item);
    const keys = Object.keys(properties);
    for (let property of keys) {
      const value = await crs.process.getValue(properties[property], context, process, item);
      property = formatProperty(property);
      await crs.process.setValue(property, value, context, process, item);
    }
  }
  static async get(step, context, process, item) {
    const properties = await crs.process.getValue(step.args.properties, context, process, item);
    const result = [];
    for (let property of properties) {
      property = formatProperty(property);
      const value = await crs.process.getValue(property, context, process, item);
      result.push(value);
    }
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async delete(step, context, process, item) {
    const properties = await crs.process.getValue(step.args.properties, context, process, item);
    for (let property of properties) {
      property = formatProperty(property);
      let target = context;
      if (property.indexOf("$process") != -1) {
        target = process;
      }
      if (property.indexOf("$item") != -1) {
        target = process;
      }
      await deleteOnPath(target, property);
    }
  }
  static async copy_on_path(step, context, process, item) {
    const source = await crs.process.getValue(step.args.source, context, process, item);
    const target = await crs.process.getValue(step.args.target, context, process, item);
    const properties = await crs.process.getValue(step.args.properties, context, process, item);
    for (let property of properties) {
      property = property.split("/").join(".");
      await copyPath(source, target, property);
    }
  }
  static async create(step, context, process, item) {
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, {}, context, process, item);
    }
  }
  static async assign(step, context, process, item) {
    const source = await crs.process.getValue(step.args.source, context, process, item);
    const target = await crs.process.getValue(step.args.target, context, process, item);
    return Object.assign(target, source);
  }
  static async clone(step, context, process, item) {
    const source = await crs.process.getValue(step.args.source, context, process, item);
    const properties = await crs.process.getValue(step.args.properties, context, process, item);
    if (properties == null) {
      const result2 = Object.assign({}, source);
      if (step.args.target != null) {
        await crs.process.setValue(step.args.target, result2, context, process, item);
      }
      return result2;
    }
    const result = {};
    for (let property of properties) {
      result[property] = source[property];
    }
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async json_clone(step, context, process, item) {
    const source = await crs.process.getValue(step.args.source, context, process, item);
    const json = JSON.stringify(source);
    const newValue = JSON.parse(json);
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, newValue, context, process, item);
    }
    return newValue;
  }
  static async assert(step, context, process, item) {
    let isValid = true;
    const source = await crs.process.getValue(step.args.source, context, process, item);
    if (source == null)
      return false;
    const paths = await crs.process.getValue(step.args.properties, context, process, item);
    for (const path of paths) {
      const value = await getValueOnPath(source, path);
      if (value == null) {
        isValid = false;
        break;
      }
    }
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, isValid, context, process, item);
    }
    return isValid;
  }
}
function formatProperty(property) {
  if (property.indexOf("$") == -1) {
    property = `$context.${property}`;
  }
  return property.split("/").join(".");
}
async function setValueOnPath(obj, path, value) {
  const parts = path.split(".").join("/").split("/");
  const property = parts[parts.length - 1];
  let target = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    const isArray = isNaN(nextPart) == false;
    if (isArray == true) {
      parts[i + 1] = Number(nextPart);
    }
    if (target[part] == null) {
      target[part] = isArray ? [] : {};
    }
    target = target[part];
  }
  target[property] = value;
}
async function getValueOnPath(obj, path) {
  const parts = path.split(".").join("/").split("/");
  const property = parts[parts.length - 1];
  let target = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (target == null) {
      return null;
    }
    if (Array.isArray(target)) {
      target = target[Number(parts[i])];
    } else {
      target = target[parts[i]];
    }
  }
  if (target == null)
    return null;
  return target[property];
}
async function deleteOnPath(obj, path) {
  if (obj == null)
    return;
  const parts = path.split("$context.").join("").split(".").join("/").split("/");
  let target = obj;
  const collection = [obj];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (target[part] == null)
      return;
    target = target[part];
    collection.push(target);
  }
  const index = parts.length - 1;
  const property = parts[index];
  target = collection[index];
  if (Array.isArray(target)) {
    target.splice(Number(property), 1);
  } else {
    delete target[property];
  }
}
async function copyPath(source, target, path) {
  const value = await getValueOnPath(source, path);
  if (value == null)
    return;
  const newValue = await crs.call("object", "json_clone", {
    source: value
  });
  await setValueOnPath(target, path, newValue);
}
crs.intent.object = ObjectActions;
export {
  ObjectActions
};
