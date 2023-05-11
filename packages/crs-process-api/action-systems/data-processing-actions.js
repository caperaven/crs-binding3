import init, { unique_values } from "./../bin/data_processing.js";
await init();
class DataProcessing {
  static async perform(step, context, process, item) {
    await this[step.action](step, context, process, item);
  }
  static async unique_values(step, context, process, item) {
    const data = await crs.process.getValue(step.args.source, context, process, item);
    const fields = await crs.process.getValue(step.args.fields, context, process, item);
    const rows = await crs.process.getValue(step.args.rows, context, process, item);
    if (!Array.isArray(data)) {
      throw new Error("Fields must be an array");
    }
    if (!Array.isArray(fields)) {
      throw new Error("Fields must be an array");
    }
    const result = unique_values(data, fields, rows);
    if (step.args.target) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
}
crs.intent.data_processing = DataProcessing;
export {
  DataProcessing
};
