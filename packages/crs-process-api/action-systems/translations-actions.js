class l{static async perform(a,t,s,r){await this[a.action]?.(a,t,s,r)}static async add(a,t,s,r){const e=await crs.process.getValue(a.args.translations,t,s,r),n=await crs.process.getValue(a.args.context,t,s,r);await crsbinding.translations.add(e,n)}static async get(a,t,s,r){let e=await crs.process.getValue(a.args.key,t,s,r);e=e.split("/").join(".");let n=await crsbinding.translations.get(e);return a.args.target!=null&&await crs.process.setValue(a.args.target,n,t,s,r),n}static async delete(a,t,s,r){const e=await crs.process.getValue(a.args.context,t,s,r);await crsbinding.translations.delete(e)}static async translate_elements(a,t,s,r){const e=await crs.dom.get_element(a.args.element);await crsbinding.translations.parseElement(e)}static async inflate(a,t,s,r){const e=await crs.process.getValue(a.args.key,t,s,r),n=await crs.process.getValue(a.args.parameters,t,s,r);let c=await crsbinding.translations.get(e),i=await crs.call("string","inflate",{template:c,parameters:n},t,s,r);return a.args.target!=null&&await crs.process.setValue(a.args.target,i,t,s,r),i}}crs.intent.translations=l;export{l as TranslationsActions};
