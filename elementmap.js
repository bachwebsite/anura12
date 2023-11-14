class ElementMap{constructor(){this.internalList=[];}
set(key,value){this.internalList.push({key:key,value:value});}
get(key){for(const pair of this.internalList){if(key.isSameNode(pair.key)){return pair.value;}}
return undefined;}
remove(key){for(var i=0;i<this.internalList.length;i++){if(this.internalList[i].key.isSameNode(key)){delete this.internalList[i];this.internalList.splice(i,1);return;}}}
delete(key){this.remove(key);}}