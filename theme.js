class ThemeDummy{constructor(){}
inject(){}
injectIntoFrame(){}
getCSSForTheme(){return[];}}
class Theme{constructor(themeJson){this.json=themeJson;if(!themeJson.version||!themeJson.name||!themeJson.theme||!themeJson.theme.colors)
throw new Error("Invalid theme, did not contain any of version, name, theme, or theme.colors",);this.version=themeJson.version;this.name=themeJson.name;this.isAboutBrowserTheme=!!themeJson.aboutbrowser;this.colorMap=themeJson.theme.colors;this.flags=[];let colorMap=this.colorMap;let colorMapContains=Object.keys(colorMap);for(const k of["frame","toolbar","tab_text","tab_background_text"])
if(!colorMapContains.includes(k))
throw new Error("Invalid theme, did not contain "+k);if(!colorMapContains.includes("background_tab"))
colorMap.background_tab=colorMap.frame;if(!colorMapContains.includes("button_background"))
colorMap.button_background=colorMap.frame;if(!colorMapContains.includes("ntp_background"))
colorMap.ntp_background=colorMap.toolbar;if(!colorMapContains.includes("ntp_link"))
colorMap.ntp_link=colorMap.tab_text;if(!colorMapContains.includes("ntp_text"))
colorMap.ntp_text=colorMap.tab_text;if(!colorMapContains.includes("omnibox_background"))
colorMap.omnibox_background=gcp.Grey100;if(!colorMapContains.includes("omnibox_text"))
colorMap.omnibox_text=gcp.Grey900;if(!colorMapContains.includes("toolbar_button_icon"))
colorMap.toolbar_button_icon=colorMap.tab_text;if(!colorMapContains.includes("toolbar_text"))
colorMap.toolbar_text=colorMap.tab_text;if(!colorMapContains.includes("bookmark_text"))
colorMap.bookmark_text=colorMap.tab_text;if(arraysEqual(colorMap.frame,colorMap.toolbar))
this.flags.push("theme-need-tab-contrast");if(this.isAboutBrowserTheme){for(const k of["accent_color","ui_search_background","ui_toolbar_background","ui_sidebar_background","ui_sidebar_active_foreground","ui_layer1_background","ui_layer1_foreground",])
if(!colorMapContains.includes(k))
throw new Error("Invalid theme, did not contain "+k);if(!colorMapContains.includes("ui_toolbar_foreground"))
colorMap.ui_toolbar_foreground=colorMap.tab_text;if(!colorMapContains.includes("ui_sidebar_foreground"))
colorMap.ui_sidebar_foreground=colorMap.tab_text;if(!colorMapContains.includes("ui_search_foreground"))
colorMap.ui_search_foreground=colorMap.tab_text;if(!colorMapContains.includes("ui_sidebar_active_foreground"))
colorMap.ui_sidebar_active_foreground=colorMap.tab_text;}
this.colorToCSSMap={frame:"--aboutbrowser-frame-bg",toolbar:"--aboutbrowser-toolbar-bg",toolbar_button_icon:"--aboutbrowser-toolbar-button-fg",toolbar_text:"--aboutbrowser-toolbar-fg",background_tab:"--aboutbrowser-inactive-tab-bg",tab_text:"--aboutbrowser-active-tab-fg",tab_background_text:"--aboutbrowser-inactive-tab-fg",button_background:"--aboutbrowser-button-bg",ntp_background:"--aboutbrowser-ui-bg",ntp_link:"--aboutbrowser-ui-link-fg",ntp_text:"--aboutbrowser-ui-fg",omnibox_background:"--aboutbrowser-omnibox-bg",omnibox_text:"--aboutbrowser-omnibox-fg",bookmark_text:"--aboutbrowser-bookmark-fg",};this.aboutBrowserColorToCSSMap={accent_color:"--aboutbrowser-ui-accent",ui_search_background:"--aboutbrowser-ui-search-bg",ui_search_foreground:"--aboutbrouser-ui-search-fg",ui_toolbar_background:"--aboutbrowser-ui-toolbar-bg",ui_toolbar_foreground:"--aboutbrowser-ui-toolbar-fg",ui_sidebar_background:"--aboutbrowser-ui-sidebar-bg",ui_sidebar_foreground:"--aboutbrowser-ui-sidebar-fg",ui_sidebar_active_background:"--aboutbrowser-ui-sidebar-active-bg",ui_sidebar_active_foreground:"--aboutbrowser-ui-sidebar-active-fg",ui_layer1_background:"--aboutbrowser-ui-layer1-bg",ui_layer1_foreground:"--aboutbrowser-ui-layer1-fg",};}#rgbArrayToCSSDirective(colorData){return("rgb("+colorData[0]+", "+colorData[1]+", "+colorData[2]+")");}#removeAllAboutbrowserTagsFromEl(el){let tags=el.getAttributeNames();for(const tag of tags){if(tag.startsWith("data-aboutbrowser-"))el.removeAttribute(tag);}}
inject(){let style=document.documentElement.style;let css=this.getCSSForTheme(false);for(const directive of css){style.setProperty(directive[0],directive[1]);}
this.#removeAllAboutbrowserTagsFromEl(document.documentElement);for(const flag of this.flags)
document.documentElement.setAttribute("data-aboutbrowser-"+flag,"");}
injectIntoFrame(frame,isNtp){let style=frame.contentWindow.document.documentElement.style;let css=this.getCSSForTheme(isNtp);for(const directive of css){style.setProperty(directive[0],directive[1]);}
this.#removeAllAboutbrowserTagsFromEl(document.documentElement);for(const flag of this.flags)
document.documentElement.setAttribute("data-aboutbrowser-"+flag,"");if(this.isAboutBrowserTheme||isNtp)return;css=Extension.internalThemeExtension.theme.getCSSForTheme(isNtp);for(const directive of css){if(!directive[0].includes("--aboutbrowser-ui"))continue;style.setProperty(directive[0],directive[1]);}}
getCSSForTheme(isNtp){let themeCSS=[];if(this.isAboutBrowserTheme){for(const color of Object.entries(this.aboutBrowserColorToCSSMap)){themeCSS.push([color[1],this.#rgbArrayToCSSDirective(this.colorMap[color[0]]),]);}}
for(const color of Object.entries(this.colorToCSSMap)){if(!this.isAboutBrowserTheme&&!isNtp&&color[1].includes("--aboutbrowser-ui"))
continue;themeCSS.push([color[1],this.#rgbArrayToCSSDirective(this.colorMap[color[0]]),]);}
return themeCSS;}
toJSON(){return this.json;}}