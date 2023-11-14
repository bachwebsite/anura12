class ExtensionInjectorMV2 extends ExtensionInjector{constructor(extension){super();this.extension=extension;this.manifest=extension.manifest;}
parseManifest(){const content_scripts=this.manifest["content_scripts"];let domcontentloaded=[];let loaded=[];if(!content_scripts)
throw new Error('Manifest does not contain "content_scripts" key.');for(const cs of content_scripts){if(!cs.matches)
throw new Error("Content script id "+
content_scripts.indexOf(cs)+
' does not contain "matches" key.',);for(const m of cs.matches)this.validateMatchSequence(m);if(!cs.run_at||cs.run_at==="document_idle"){loaded.push(cs);}else{domcontentloaded.push(cs);}}
this.domcontentloaded=domcontentloaded;this.loaded=loaded;}
async inject(url,frame,list){let jsToInject=[];let cssToInject=[];for(const cs of list){let matches=false;let excludes=false;let globMatches=false;let globExcludes=false;for(const match of cs.matches){if(this.parseMatchSequence(match,url)){matches=true;break;}}
for(const exclude of cs.exclude_matches||[]){if(this.parseMatchSequence(exclude,url)){excludes=true;break;}}
for(const match of cs.include_globs||[]){if(this.parseChromeGlob(match,url)){globMatches=true;break;}}
for(const exclude of cs.exclude_globs||[]){if(this.parseChromeGlob(exclude,url)){globExcludes=true;break;}}
if(matches&&cs.include_globs&&globMatches&&!excludes&&cs.exclude_globs&&!globExcludes){for(const path of cs.js||[]){let code=await this.extension.resources.fs.readFile("/"+this.extension.id+"/"+path,"utf8",);jsToInject.push(code);}
if(jsToInject.length)
jsToInject.push("/*aboutbrowserExtensionContentScriptSeparator*/");for(const path of cs.css||[]){let code=await this.extension.resources.fs.readFile("/"+this.extension.id+"/"+path,"utf8",);cssToInject.push(code);}
if(cssToInject.length)
cssToInject.push("/*aboutbrowserExtensionContentScriptSeparator*/");}}
let code="(()=>{/*aboutBrowserExtensionApisSeparator*//*aboutbrowserExtensionId="+
this.extension.id+
"*/"+
jsToInject.join(";/*aboutbrowserExtensionInjectedScriptSeparator*/")+
"})();";let el=document.createElement("script");el.innerText=code;frame.contentWindow.document.head.appendChild(el);code="/*aboutbrowserExtensionId="+
this.extension.id+
"*/"+
cssToInject.join("/*aboutBrowserExtensionInjectedCssSeparator*/");el=document.createElement("style");el.innerText=code;frame.contentWindow.document.head.appendChild(el);}
async injectDOMContentLoaded(url,frame){await this.inject(url,frame,this.domcontentloaded);}
async injectLoaded(url,frame){await this.inject(url,frame,this.loaded);}}