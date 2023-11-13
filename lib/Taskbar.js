"use strict";class Taskbar{state=stateful({pinnedApps:[],activeApps:[],showBar:false,time:"",bat_icon:"battery_0_bar",});dragged=null;insidedrag=false;element=(React.createElement("footer",null,React.createElement("div",{id:"launcher-button-container"},React.createElement("div",{id:"launcher-button","on:click":()=>{launcher.toggleVisible();}},React.createElement("img",{src:"/assets/icons/launcher.svg",style:"height:100%;width:100%"}))),React.createElement("nav",{id:"taskbar-bar","on:dragover":(e)=>{e.preventDefault();},"on:drop":(e)=>{this.insidedrag=true;e.preventDefault();}},React.createElement("ul",{for:React.use(this.state.pinnedApps),do:this.shortcut.bind(this)}),React.createElement("div",{if:React.use(this.state.showBar),class:styled.new `
                        self {
                            border: 2px solid white;
                            height: 70%;
                            border-radius: 1px;
                            margin: 1em;
                        }
                    `}),React.createElement("ul",{for:React.use(this.state.activeApps),do:this.shortcut.bind(this)})),React.createElement("div",{id:"taskinfo-container"},React.createElement("div",{class:"flex flexcenter"},React.createElement("span",{id:"settings-icn","on:click":()=>{anura.apps["anura.settings"].open();},class:"material-symbols-outlined"},"settings"),React.createElement("span",{class:"material-symbols-outlined"},React.use(this.state.bat_icon)),React.createElement("p",null,React.use(this.state.time))))));shortcut(app){if(!app)
return;return(React.createElement("li",{class:"taskbar-button","bind:tmp":this},React.createElement("input",{type:"image",draggable:"true",src:app?.icon||"","on:dragend":()=>{if(!this.insidedrag){for(const i of app.windows){i.close();}
anura.settings.set("applist",anura.settings.get("applist").filter((p)=>p!=app.package));this.updateTaskbar();}
this.dragged=null;this.insidedrag=false;},"on:dragstart":()=>{this.dragged=$el;},class:"showDialog","on:click":(e)=>{if(app.windows.length==1){app.windows[0].focus();}
else{this.showcontext(app,e);}},"on:contextmenu":(e)=>{this.showcontext(app,e);}}),React.createElement("div",{class:"lightbar",style:"position: relative; bottom: 0px; background-color:#FFF; width:30%; left:50%; transform:translateX(-50%)"+
(app.windows?.length==0?";visibility:hidden":""),"bind:lightbar":this})));}#contextMenu=new ContextMenuAPI();showcontext(app,e){if(app.windows.length>0){this.#contextMenu.removeAllItems();this.#contextMenu.addItem("New Window",()=>{app.open();});let winEnumerator=1;for(const win of app.windows){const displayTitle=win.state.title||"Window "+winEnumerator;this.#contextMenu.addItem(displayTitle,()=>{win.focus();win.unminimize();});winEnumerator++;}
const pinned=anura.settings.get("applist").includes(app.package);this.#contextMenu.addItem(pinned?"Unpin":"Pin",()=>{if(pinned){anura.settings.set("applist",anura.settings.get("applist").filter((p)=>p!=app.package));}
else{anura.settings.set("applist",[...anura.settings.get("applist"),app.package,]);}
this.updateTaskbar();});const c=this.#contextMenu.show(e.x,0);c.style.top="";c.style.bottom="69px";console.log(c);}
else{app.open();}}
constructor(){setInterval(()=>{const date=new Date();this.state.time=date.toLocaleTimeString(navigator.language,{hour:"numeric",minute:"numeric",hour12:true,}).slice(0,-3);},1000);if(navigator.getBattery){navigator.getBattery().then((battery)=>{if(battery.charging){this.state.bat_icon="battery_charging_full";return;}
battery.onchargingchange=()=>{if(battery.charging){this.state.bat_icon="battery_charging_full";return;}
else{const bat_bars=Math.round(battery.level*7)-1;this.state.bat_icon=`battery_${bat_bars}_bar`;return;}};const bat_bars=Math.round(battery.level*7)-1;this.state.bat_icon=`battery_${bat_bars}_bar`;});}}
addShortcut(app){}
killself(){this.element.remove();}
updateTaskbar(){const pinned=anura.settings.get("applist").map((id)=>anura.apps[id]);const activewindows=Object.values(anura.apps).filter((a)=>a.windows&&a.windows.length>0);this.state.pinnedApps=pinned;this.state.activeApps=activewindows.filter((app)=>!pinned.includes(app));this.state.showBar=this.state.pinnedApps.length>0&&this.state.activeApps.length>0;console.log(this.state.activeApps);}}