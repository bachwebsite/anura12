class ExtensionResources{constructor(fs){this.fs=fs.promises;this.regularFs=fs;this.resourcesUri="chrome-extension://";this.resourcesUrl=window.location.origin+"/extension";}
static new(fsName="aboutproxy-extensions"){return new Promise((resolve,reject)=>{let filesystem=new Filer.FileSystem({name:fsName},(err,fs)=>{if(err)reject(err);let cls=new ExtensionResources(fs);cls.setUpSw().then(()=>{resolve(cls);},(val)=>{reject(val);},);});});}
setUpSw(){return window.navigator.serviceWorker.register("/nohost-sw.js?route=extension&fsName=aboutproxy-extensions",{scope:"/extension"},);}}