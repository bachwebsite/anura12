"use strict";const decoder=new TextDecoder();const encoder=new TextEncoder();V86Starter.prototype.serial1_send=function(a){for(let b=0;b<a.length;b++)
this.bus.send("serial1-input",a.charCodeAt(b));};const SLICE_SIZE=2**17*32;const BUF_SIZE=256;async function InitV86Hdd(){const request=indexedDB.open("image",2);request.onupgradeneeded=(event)=>{const db=event.target.result;db.createObjectStore("parts");};const db=(await new Promise((r)=>(request.onsuccess=r))).target.result;const size=(await new Promise((r)=>(db.transaction("parts").objectStore("parts").get("size").onsuccess=r))).target.result;const ro_slice_cache={};const fakefile={size:size,slice:async(start,end)=>{const starti=Math.floor(start/SLICE_SIZE);const endi=Math.floor(end/SLICE_SIZE);let i=starti;let buf=null;while(i<=endi){let part=ro_slice_cache[i];if(!part){part=(await new Promise((r)=>(db.transaction("parts").objectStore("parts").get(i).onsuccess=r))).target.result;ro_slice_cache[i]=part;}
if(!part){i++;continue;}
const slice=part.slice(Math.max(0,start-i*SLICE_SIZE),end-i*SLICE_SIZE);if(buf==null){buf=slice;}
else{buf=catBufs(buf,slice);}
i++;}
return new Blob([buf]);},loadfile:async(f)=>{const trn=db.transaction("parts","readwrite").objectStore("parts");trn.put(f.size,"size");fakefile.size=f.size;let i=0;while(i*SLICE_SIZE<f.size){const buf=await f.slice(i*SLICE_SIZE,(i+1)*SLICE_SIZE).arrayBuffer();await new Promise((r)=>(db.transaction("parts","readwrite").objectStore("parts").put(buf,i).onsuccess=r));i++;console.log(i/(f.size/SLICE_SIZE));}},delete:async()=>{db.close();indexedDB.deleteDatabase("image");window.location.reload();},resize:async(size)=>{fakefile.size=size;let i=0;db.transaction("parts","readwrite").objectStore("parts").put(size,"size");while(i*SLICE_SIZE<size){const block=await new Promise((r)=>(db.transaction("parts","readwrite").objectStore("parts").get(i).onsuccess=r));if(!block.target.result){await new Promise((r)=>(db.transaction("parts","readwrite").objectStore("parts").put(new ArrayBuffer(SLICE_SIZE),i).onsuccess=r));console.log("added block "+i);}
i++;}},save:async(emulator=anura.x86?.emulator)=>{const part_cache={};for(const[offset,buffer]of emulator.disk_images.hda.block_cache){const start=offset*BUF_SIZE;const starti=Math.floor(start/SLICE_SIZE);let i=starti;const offset_rel_to_slice=start%SLICE_SIZE;const end=SLICE_SIZE-offset_rel_to_slice;const slice=buffer.slice(0,Math.min(BUF_SIZE,end));let tmpb=part_cache[i];if(!tmpb){const part=(await new Promise((r)=>(db.transaction("parts").objectStore("parts").get(i).onsuccess=r))).target.result;tmpb=new Uint8Array(part);part_cache[i]=tmpb;}
tmpb.set(slice,start%SLICE_SIZE);if(end<256){i+=1;const slice=buffer.slice(end,BUF_SIZE);let tmpb=part_cache[i];if(!tmpb){const part=(await new Promise((r)=>(db.transaction("parts").objectStore("parts").get(i).onsuccess=r))).target.result;tmpb=new Uint8Array(part);part_cache[i]=tmpb;}
tmpb.set(slice,0);}}
const promises=[];for(const i in part_cache){promises.push(new Promise((r)=>(db.transaction("parts","readwrite").objectStore("parts").put(part_cache[i].buffer,parseInt(i)).onsuccess=r)));}
await Promise.all(promises);anura.notifications.add({title:"x86 Subsystem",description:"Saved root filesystem sucessfully",timeout:5000,});},set_state:()=>{},};fakefile.__proto__=File.prototype;return fakefile;}
class V86Backend{sendQueue=[];nextWrite=null;openQueue=[];onDataCallbacks={};read_intent_phys_addr;write_intent_phys_addr;new_intent_phys_addr;read_nbytes_phys_addr;write_nbytes_phys_addr;s_rows_phys_addr;s_cols_phys_addr;resize_intent_phys_addr;vgacanvas;screen_container=(React.createElement("div",{id:"screen_container",class:styled.new `
                self {
                    background-color: #000;
                }
                canvas {
                    background-color: #000;
                }
            `},React.createElement("div",{style:"white-space: pre; font: 14px monospace; line-height: 14px"}),React.createElement("canvas",{"bind:vgacanvas":this})));ready=true;act=false;cmd_q=null;virt_hda;barepty;xpty;runpty;emulator;constructor(virt_hda){console.log(virt_hda);this.virt_hda=virt_hda;const fs=anura.fs;const Path=Filer.Path;const Buffer=Filer.Buffer;const sh=new fs.Shell();this.emulator=new V86Starter({wasm_path:"/lib/v86.wasm",memory_size:512*1024*1024,vga_memory_size:8*1024*1024,screen_container:this.screen_container,initrd:{url:"/fs/initrd.img",},bzimage:{url:"/fs/bzimage",async:false,},hda:{buffer:virt_hda,async:true,},cmdline:"rw init=/bin/systemd root=/dev/sda rootfstype=ext4 random.trust_cpu=on 8250.nr_uarts=10 spectre_v2=off pti=off",filesystem:{fs,sh,Path,Buffer},bios:{url:"/bios/seabios.bin"},vga_bios:{url:"/bios/vgabios.bin"},network_relay_url:anura.settings.get("relay-url"),autostart:true,uart1:true,uart2:true,});let s0data="";let s1data="";setInterval(()=>{this.virt_hda.save();},1000*90);window.addEventListener("beforeunload",async(event)=>{event.preventDefault();await this.virt_hda.save();});this.emulator.add_listener("serial0-output-char",(char)=>{if(char==="\r"){anura.logger.debug(s0data);this._proc_data(s0data);s0data="";return;}
s0data+=char;});this.emulator.add_listener("serial1-output-char",(char)=>{if(char==="\r"){anura.logger.debug(`111: ${s1data}`);this._proc_data(s1data);s1data="";return;}
s1data+=char;});}
netids=[];registered=false;termready=false;async onboot(){if(this.registered)
return;this.registered=true;anura.notifications.add({title:"x86 Subsystem Ready",description:"x86 OS has booted and is ready for use",timeout:5000,});this.termready=true;let buffer="";this.barepty=await this.openpty("/bin/ptynet",1,1,(data)=>{console.log("BARE: "+data);data=data.replaceAll("\r\n","\n");const split=data.split("\x03");if(split[1]){buffer+=split[0];console.log("recieved"+buffer);navigator.serviceWorker.controller?.postMessage({anura_target:"anura.x86.proxy",id:this.netids.shift(),value:{body:buffer,status:200,},});buffer=split[1];}
else{buffer+=split[0];}});this.xpty=await this.openpty("startx /bin/xfrog",1,1,async(data)=>{console.debug("XFROG "+data);if(data.includes("XFROG-INIT")){anura.apps["anura.xfrog"].startup();this.startMouseDriver();anura.notifications.add({title:"x86 Subsystem",description:"Started XFrog Window Manager",timeout:5000,});}});this.runpty=await this.openpty("DISPLAY=:0 bash",1,1,(data)=>{console.debug("RUNPTY"+data);});anura.apps["anura.term"].open();navigator.serviceWorker.addEventListener("message",async(event)=>{if(event.data?.anura_target=="anura.x86.proxy"){const id=event.data.id;console.log(event);this.netids.push(id);this.writepty(this.barepty,event.data.value.url+"\n");}});}
runcmd(cmd){this.writepty(this.runpty,`( ${cmd} ) & \n`);}
closepty(TTYn){this.emulator.serial0_send(`c\n${TTYn}`);}
async#waitAndTry(command,cols,rows,onData){while(!anura.x86.canopenpty){console.log("waiting for pty");await sleep(1000);}
return await this.openpty(command,cols,rows,onData);}
canopenpty=true;opensafeQueue=[];openpty(command,cols,rows,onData){if(!anura.x86.termready){onData("the x86 subsystem hasn't booted yet, please try again later");return new Promise((resolve)=>{resolve(-1);});}
if(!anura.x86.canopenpty){return this.#waitAndTry(command,cols,rows,onData);}
anura.x86.canopenpty=false;this.write_uint(rows,this.s_rows_phys_addr);this.write_uint(cols,this.s_cols_phys_addr);this.write_uint(1,this.new_intent_phys_addr);if(this.ready){this.ready=false;this.emulator.serial0_send("\x06\n");this.emulator.serial0_send(`${command}\n`);}
else{this.cmd_q=command;this.act=true;}
const waitAndLet=async()=>{await sleep(10);anura.x86.canopenpty=true;};return new Promise((resolve)=>{this.openQueue.push((number)=>{this.onDataCallbacks[number]=onData;resolve(number);anura.logger.debug("Resolved PTY with ID: "+number);waitAndLet();});});}
resizepty(TTYn,cols,rows){if(TTYn==-1){return;}
this.write_uint(rows,this.s_rows_phys_addr);this.write_uint(cols,this.s_cols_phys_addr);this.write_uint(TTYn+1,this.resize_intent_phys_addr);this.write_uint(1336,this.read_intent_phys_addr);if(this.ready){this.ready=false;this.emulator.serial0_send("\x06\n");}
else{this.act=true;}}
async startMouseDriver(){let ready=false;function pack(value1,value2){const result=(value1<<16)+value2;return result;}
let pointer="";const pty=await this.openpty("TERM=xterm DISPLAY=:0 /bin/anuramouse",100,100,(data)=>{pointer=data.slice(0,-2);console.log(pointer);ready=true;});function write_uint(i,addr){const bytes=[i,i>>8,i>>16,i>>24].map((a)=>a%256);anura.x86.emulator.write_memory(bytes,addr);}
function movemouse(x,y){if(!ready)
return;write_uint(pack(x,y),Number(pointer));}
const vgacanvas=this.vgacanvas;function mouseHandler(event){const rect=vgacanvas.getBoundingClientRect();const x=event.clientX-rect.x;const y=event.clientY-rect.y;movemouse(x,y);}
this.vgacanvas.onmousemove=mouseHandler;this.vgacanvas.onmouseleave=function(){movemouse(0,768);};}
writepty(TTYn,data){if(TTYn==-1){return;}
const bytes=encoder.encode(data);if(this.nextWrite){if(this.sendQueue.length>10)
this.nextWrite=null;this.sendQueue.push([data,TTYn]);return;}
this.write_uint(TTYn+1,this.write_intent_phys_addr);this.write_uint(bytes.length,this.write_nbytes_phys_addr);this.nextWrite=bytes;if(this.ready){this.ready=false;this.emulator.serial0_send("\x06\n");}
else{this.act=true;}}
async _proc_data(data){const start=data.indexOf("\x05");if(start===-1)
return;data=data.substring(start+1);const parts=data.split(" ");switch(parts.shift()){case "i":{const arr=parts.map((p)=>parseInt(p));[this.read_intent_phys_addr,this.write_intent_phys_addr,this.new_intent_phys_addr,this.read_nbytes_phys_addr,this.write_nbytes_phys_addr,this.s_rows_phys_addr,this.s_cols_phys_addr,this.resize_intent_phys_addr,]=arr;if(!this.registered)
this.onboot();this.emulator.serial0_send("\x06\n");break;}
case "r":{const addr=parseInt(parts[0]);const n_bytes=this.read_uint(this.read_nbytes_phys_addr);const n_tty=parseInt(parts[1]);const mem=this.emulator.read_memory(addr,n_bytes);const text=decoder.decode(mem);const cb=this.onDataCallbacks[n_tty];if(cb){cb(text);}
this.emulator.serial1_send("\x06\n");break;}
case "w":{const addr=parseInt(parts[0]);this.emulator.write_memory(this.nextWrite,addr);this.nextWrite=null;this.write_uint(0,this.write_intent_phys_addr);const queued=this.sendQueue.shift();if(queued){this.writepty(queued[1],queued[0]);}
this.emulator.serial0_send("\x06\n");break;}
case "n":{const func=this.openQueue.shift();if(func){func(parseInt(parts[0]));}
this.emulator.serial0_send("\x06\n");break;}
case "v":{this.ready=true;if(this.act){this.ready=false;this.act=false;this.emulator.serial0_send("\x06\n");if(this.cmd_q){this.cmd_q=null;this.emulator.serial0_send(`${this.cmd_q}\n`);}}}}}
read_uint(addr){const b=this.emulator.read_memory(addr,4);return b[0]+(b[1]<<8)+(b[2]<<16)+(b[3]<<24);}
write_uint(i,addr){const bytes=[i,i>>8,i>>16,i>>24].map((a)=>a%256);this.emulator.write_memory(bytes,addr);}}
async function savestate(){const new_state=await anura.x86.emulator.save_state();const a=document.createElement("a");a.download="v86state.bin";a.href=window.URL.createObjectURL(new Blob([new_state]));a.dataset.downloadurl="application/octet-stream:"+a.download+":"+a.href;a.click();this.blur();}
async function a(){const emulator=anura.x86.emulator;window.emulator=emulator;await new Promise((resolve)=>setTimeout(resolve,300));const text=await navigator.clipboard.readText();for(const l of text.split("\n")){emulator.serial0_send(`${l}\n`);await new Promise((resolve)=>setTimeout(resolve,10));}
emulator.serial0_send("\n\x04\n");}