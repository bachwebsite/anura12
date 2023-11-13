"use strict";let __effects=[];class React{static get use(){__effects=[];return(sink,mapping)=>{const tmp=__effects;__effects=[];tmp.__alicejs_marker=true;if(mapping)
tmp.__alicejs_mapping=mapping;return tmp;};}
static createElement(type,props,...children){const elm=document.createElement(type);if(props){if("if"in props){const cond=props["if"];const then=props["then"];const elseelm=props["else"];if(typeof cond==="object"&&"__alicejs_marker"in cond){if(then)
elm.appendChild(then);if(elseelm)
elm.appendChild(elseelm);handle(cond,(val)=>{if(then){if(val){then.style.display="";if(elseelm)
elseelm.style.display="none";}
else{then.style.display="none";if(elseelm)
elseelm.style.display="";}}
else{if(val){elm.style.display="";}
else{elm.style.display="none";}}});}
else{if(then){if(cond){elm.appendChild(then);}
else if(elseelm){elm.appendChild(elseelm);}}
else{if(!cond){elm.style.display="none";return document.createTextNode("");}}}
delete props["if"];delete props["then"];delete props["else"];}
if("for"in props&&"do"in props){const predicate=props["for"];const closure=props["do"];if(typeof predicate==="object"&&"__alicejs_marker"in predicate){const __elms=[];let lastpredicate=[];handle(predicate,(val)=>{if(Object.keys(val).length&&Object.keys(val).length==lastpredicate.length){let i=0;for(const index in val){if(deepEqual(val[index],lastpredicate[index])){continue;}
const part=closure(val[index],index,val);elm.replaceChild(part,__elms[i]);__elms[i]=part;i+=1;}
lastpredicate=Object.keys(JSON.parse(JSON.stringify(val)));}
else{for(const part of __elms){part.remove();}
for(const index in val){const value=val[index];const part=closure(value,index,val);if(part instanceof HTMLElement){__elms.push(part);elm.appendChild(part);}}
lastpredicate=[];}});}
else{for(const index in predicate){const value=predicate[index];const part=closure(value,index,predicate);if(part instanceof Node)
elm.appendChild(part);}}
delete props["for"];delete props["do"];}
for(const name in props){const prop=props[name];if(typeof prop==="object"&&"__alicejs_marker"in prop){handle(prop,(val)=>{__assign_prop(elm,name,val);});}
else{__assign_prop(elm,name,prop);}}}
for(const child of children){if(typeof child==="object"&&"__alicejs_marker"in child){const text=document.createTextNode("");elm.appendChild(text);handle(child,(val)=>{text.textContent=val;});}
else if(child instanceof Node){elm.appendChild(child);}
else{elm.appendChild(document.createTextNode(child));}}
return elm;}}
function deepEqual(object1,object2){const keys1=Object.keys(object1);const keys2=Object.keys(object2);if(keys1.length!==keys2.length){return false;}
for(const key of keys1){const val1=object1[key];const val2=object2[key];const areObjects=isObject(val1)&&isObject(val2);if((areObjects&&!deepEqual(val1,val2))||(!areObjects&&val1!==val2)){return false;}}
return true;}
function isObject(object){return object!=null&&typeof object==="object";}
function __assign_prop(elm,name,prop){if(name==="class"){elm.className=prop;return;}
if(typeof prop==="function"&&name.startsWith("on:")){const names=name.substring(3);for(const name of names.split("$")){elm.addEventListener(name,(...args)=>{window.$el=elm;prop(...args);});}
return;}
if(typeof prop==="function"&&name.startsWith("observe")){const observerclass=window[`${name.substring(8)}Observer`];if(!observerclass){console.error(`Observer ${name} does not exist`);return;}
const observer=new observerclass((entries)=>{for(const entry of entries){window.$el=elm;prop(entry);}});observer.observe(elm);return;}
if(name.startsWith("bind:")){const propname=name.substring(5);prop[propname]=elm;return;}
elm.setAttribute(name,prop);}
function stateful(target){target.__listeners=[];const proxy=new Proxy(target,{get(target,prop,reciever){__effects.push([target,prop,reciever]);return Reflect.get(target,prop,reciever);},set(target,prop,val){for(const listener of target.__listeners){listener(target,prop,val);}
return Reflect.set(target,prop,val);},});return proxy;}
function handle(used,callback){if("__alicejs_mapping"in used){const mapping=used["__alicejs_mapping"];const used_props=[];const used_targets=[];const values=new Map();const pairs=[];const partial_update=(target,prop,val)=>{if(used_props.includes(prop)&&used_targets.includes(target)){values.get(target)[prop]=val;}};const full_update=()=>{const flattened_values=pairs.map((pair)=>values.get(pair[0])[pair[1]]);const value=mapping(...flattened_values);callback(value);};for(const p of used){const target=p[0];const prop=p[1];used_props.push(prop);used_targets.push(target);pairs.push([target,prop]);if(!values.has(target)){values.set(target,{});}
partial_update(target,prop,target[prop]);target.__listeners.push((t,p,v)=>{partial_update(t,p,v);full_update();});}
full_update();}
else{const p=used[used.length-1];const closure=(target,prop,val)=>{if(prop==p[1]&&target==p[0]){callback(val);}};p[0].__listeners.push(closure);closure(p[0],p[1],p[0][p[1]]);}}
class styled{static new(strings,...values){const uid=`alicecss-${Array(16).fill(0).map(()=>{return Math.floor(Math.random()*16).toString(16);}).join("")}`;const styleElement=document.createElement("style");document.head.appendChild(styleElement);const flattened_template=[];for(const i in strings){flattened_template.push(strings[i]);if(values[i]){const prop=values[i];if(typeof prop==="object"&&"__alicejs_marker"in prop){const current_i=flattened_template.length;handle(prop,(val)=>{flattened_template[current_i]=String(val);styleElement.textContent=this.parse_css(uid,flattened_template.join(""));});}
else{flattened_template.push(String(prop));}}}
styleElement.textContent=this.parse_css(uid,flattened_template.join(""));return uid+" self";}
static parse_css(uid,css){let cssParsed="";const virtualDoc=document.implementation.createHTMLDocument("");const virtualStyleElement=document.createElement("style");virtualStyleElement.textContent=css;virtualDoc.body.appendChild(virtualStyleElement);for(const rule of virtualStyleElement.sheet.cssRules){rule.selectorText=rule.selectorText.includes("self")?`.${uid}.self${rule.selectorText.replace("self","")}`:`.${uid} ${rule.selectorText}`;cssParsed+=`${rule.cssText}\n`;}
return cssParsed;}}
let css;