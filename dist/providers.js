class n{#o={};#t={};#e={};#r=[];#i=[];#n=[];get attrProviders(){return this.#t}get textProviders(){return this.#r}get elementProviders(){return this.#e}constructor(t,e){for(const r of Object.keys(t))this.addAttributeProvider(r,t[r]);for(const r of Object.keys(e))this.addElementProvider(r,e[r])}async#s(t){return t=t.replace("$root",crs.binding.root),new(await import(t)).default}async getAttrModule(t){const e=this.#t[t];return typeof e!="string"?e:(this.#t[t]=await this.#s(e),this.#t[t])}addAttributeProvider(t,e){this.#t[t]=e,t.indexOf(".")!=-1&&this.#i.push(t)}addElementProvider(t,e){this.#e[t]=e,this.#n.push(t)}async addTextProvider(t){this.#r.push(await this.#s(t))}async getAttrProvider(t){if(t==="ref")return await this.getAttrModule("ref");if(t.indexOf(".")==-1)return null;if(this.#t[t]!=null)return await this.getAttrModule(t);for(const e of this.#i){if(e[0]==="^"){let r=this.#o[e];if(r==null&&(r=new RegExp(e),this.#o[e]=r),r.test(t))return await this.getAttrModule(e)}if(t.indexOf(e)!=-1)return await this.getAttrModule(e)}}async getElementProvider(t){for(const e of this.#n)if(t.matches(e))return typeof this.#e[e]=="object"?this.#e[e]:(this.#e[e]=await this.#s(this.#e[e]),this.#e[e])}async getTextProviders(){return this.#r}async update(t,...e){const r=crs.binding.elements[t];r.__events!=null&&r.__events.indexOf("change")!=-1&&this.#t[".bind"].update(t);for(const i of this.#r)i.store[t]!=null&&i.update(t);for(const i of this.#i){const s=this.#t[i];typeof s!="string"&&s.store?.[t]!=null&&s.update?.(t,...e)}}async updateProviders(t,...e){for(const r of e){let i;r===".textContent"?i=this.#r[0]:i=this.#t[r]||this.#e[r],i.update(t)}}async clear(t){for(const e of this.#r)e.clear(t);for(const e of this.#i)this.#t[e].clear?.(t)}}export{n as Providers};
