/*! modernizr 3.11.2 (Custom Build) | MIT *
 * https://modernizr.com/download/?-cssanimations-csscolumns-customelements-flexbox-history-picture-pointerevents-postmessage-sizes-srcset-webgl-websockets-webworkers-addtest-domprefixes-hasevent-mq-prefixedcssvalue-prefixes-setclasses-testallprops-testprop-teststyles !*/
!function(e,t,n,r){function o(e,t){return typeof e===t}function i(e){var t=b.className,n=w._config.classPrefix||"";if(S&&(t=t.baseVal),w._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}w._config.enableClasses&&(e.length>0&&(t+=" "+n+e.join(" "+n)),S?b.className.baseVal=t:b.className=t)}function s(e,t){if("object"==typeof e)for(var n in e)T(e,n)&&s(n,e[n]);else{var r=(e=e.toLowerCase()).split("."),o=w[r[0]];if(2===r.length&&(o=o[r[1]]),void 0!==o)return w;t="function"==typeof t?t():t,1===r.length?w[r[0]]=t:(!w[r[0]]||w[r[0]]instanceof Boolean||(w[r[0]]=new Boolean(w[r[0]])),w[r[0]][r[1]]=t),i([(t&&!1!==t?"":"no-")+r.join("-")]),w._trigger(e,t)}return w}function a(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):S?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function l(e,t,r,o){var i,s,l,u,f="modernizr",c=a("div"),d=function(){var e=n.body;return e||((e=a(S?"svg":"body")).fake=!0),e}();if(parseInt(r,10))for(;r--;)(l=a("div")).id=o?o[r]:f+(r+1),c.appendChild(l);return(i=a("style")).type="text/css",i.id="s"+f,(d.fake?d:c).appendChild(i),d.appendChild(c),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(n.createTextNode(e)),c.id=f,d.fake&&(d.style.background="",d.style.overflow="hidden",u=b.style.overflow,b.style.overflow="hidden",b.appendChild(d)),s=t(c,e),d.fake?(d.parentNode.removeChild(d),b.style.overflow=u,b.offsetHeight):c.parentNode.removeChild(c),!!s}function u(e,n,r){var o;if("getComputedStyle"in t){o=getComputedStyle.call(t,e,n);var i=t.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(i){i[i.error?"error":"log"].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!n&&e.currentStyle&&e.currentStyle[r];return o}function f(e,t){return!!~(""+e).indexOf(t)}function c(e){return e.replace(/([A-Z])/g,(function(e,t){return"-"+t.toLowerCase()})).replace(/^ms-/,"-ms-")}function d(e,n){var o=e.length;if("CSS"in t&&"supports"in t.CSS){for(;o--;)if(t.CSS.supports(c(e[o]),n))return!0;return!1}if("CSSSupportsRule"in t){for(var i=[];o--;)i.push("("+c(e[o])+":"+n+")");return l("@supports ("+(i=i.join(" or "))+") { #modernizr { position: absolute; } }",(function(e){return"absolute"===u(e,null,"position")}))}return r}function p(e){return e.replace(/([a-z])-([a-z])/g,(function(e,t,n){return t+n.toUpperCase()})).replace(/^-/,"")}function A(e,t,n,i){function s(){u&&(delete z.style,delete z.modElem)}if(i=!o(i,"undefined")&&i,!o(n,"undefined")){var l=d(e,n);if(!o(l,"undefined"))return l}for(var u,c,A,m,h,v=["modernizr","tspan","samp"];!z.style&&v.length;)u=!0,z.modElem=a(v.shift()),z.style=z.modElem.style;for(A=e.length,c=0;c<A;c++)if(m=e[c],h=z.style[m],f(m,"-")&&(m=p(m)),z.style[m]!==r){if(i||o(n,"undefined"))return s(),"pfx"!==t||m;try{z.style[m]=n}catch(e){}if(z.style[m]!==h)return s(),"pfx"!==t||m}return s(),!1}function m(e,t){return function(){return e.apply(t,arguments)}}function h(e,t,n,r,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+E.join(s+" ")+s).split(" ");return o(t,"string")||o(t,"undefined")?A(a,t,r,i):function(e,t,n){var r;for(var i in e)if(e[i]in t)return!1===n?e[i]:o(r=t[e[i]],"function")?m(r,n||t):r;return!1}(a=(e+" "+_.join(s+" ")+s).split(" "),t,n)}function v(e,t,n){return h(e,r,r,t,n)}var g=[],y={_version:"3.11.2",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout((function(){t(n[e])}),0)},addTest:function(e,t,n){g.push({name:e,fn:t,options:n})},addAsyncTest:function(e){g.push({name:null,fn:e})}},w=function(){};w.prototype=y,w=new w;var C=[],b=n.documentElement,S="svg"===b.nodeName.toLowerCase(),x="Moz O ms Webkit",_=y._config.usePrefixes?x.toLowerCase().split(" "):[];y._domPrefixes=_;var T,P=y._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];y._prefixes=P,function(){var e={}.hasOwnProperty;T=o(e,"undefined")||o(e.call,"undefined")?function(e,t){return t in e&&o(e.constructor.prototype[t],"undefined")}:function(t,n){return e.call(t,n)}}(),y._l={},y.on=function(e,t){this._l[e]||(this._l[e]=[]),this._l[e].push(t),w.hasOwnProperty(e)&&setTimeout((function(){w._trigger(e,w[e])}),0)},y._trigger=function(e,t){if(this._l[e]){var n=this._l[e];setTimeout((function(){var e;for(e=0;e<n.length;e++)(0,n[e])(t)}),0),delete this._l[e]}},w._q.push((function(){y.addTest=s}));var B=function(){var e=!("onblur"in b);return function(t,n){var o;return!!t&&(n&&"string"!=typeof n||(n=a(n||"div")),!(o=(t="on"+t)in n)&&e&&(n.setAttribute||(n=a("div")),n.setAttribute(t,""),o="function"==typeof n[t],n[t]!==r&&(n[t]=r),n.removeAttribute(t)),o)}}();y.hasEvent=B;var k=function(){var e=t.matchMedia||t.msMatchMedia;return e?function(t){var n=e(t);return n&&n.matches||!1}:function(e){var t=!1;return l("@media "+e+" { #modernizr { position: absolute; } }",(function(e){t="absolute"===u(e,null,"position")})),t}}();y.mq=k;y.prefixedCSSValue=function(e,t){var n=!1,r=a("div").style;if(e in r){var o=_.length;for(r[e]=t,n=r[e];o--&&!n;)r[e]="-"+_[o]+"-"+t,n=r[e]}return""===n&&(n=!1),n};var E=y._config.usePrefixes?x.split(" "):[];y._cssomPrefixes=E;var O={elem:a("modernizr")};w._q.push((function(){delete O.elem}));var z={style:O.elem.style};w._q.unshift((function(){delete z.style})),y.testAllProps=h,y.testAllProps=v,y.testProp=function(e,t,n){return A([e],r,t,n)},y.testStyles=l,w.addTest("customelements","customElements"in t),w.addTest("history",(function(){var e=navigator.userAgent;return!!e&&(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone")||"file:"===location.protocol)&&t.history&&"pushState"in t.history}));var L=[""].concat(_);y._domPrefixesAll=L,w.addTest("pointerevents",(function(){for(var e=0,t=L.length;e<t;e++)if(B(L[e]+"pointerdown"))return!0;return!1}));var N=!0;try{t.postMessage({toString:function(){N=!1}},"*")}catch(e){}w.addTest("postmessage",new Boolean("postMessage"in t)),w.addTest("postmessage.structuredclones",N),w.addTest("webgl",(function(){return"WebGLRenderingContext"in t}));var R=!1;try{R="WebSocket"in t&&2===t.WebSocket.CLOSING}catch(e){}w.addTest("websockets",R),w.addTest("cssanimations",v("animationName","a",!0)),function(){w.addTest("csscolumns",(function(){var e=!1,t=v("columnCount");try{(e=!!t)&&(e=new Boolean(e))}catch(e){}return e}));for(var e,t,n=["Width","Span","Fill","Gap","Rule","RuleColor","RuleStyle","RuleWidth","BreakBefore","BreakAfter","BreakInside"],r=0;r<n.length;r++)e=n[r].toLowerCase(),t=v("column"+n[r]),"breakbefore"!==e&&"breakafter"!==e&&"breakinside"!==e||(t=t||v(n[r])),w.addTest("csscolumns."+e,t)}(),w.addTest("flexbox",v("flexBasis","1px",!0)),w.addTest("picture","HTMLPictureElement"in t),w.addAsyncTest((function(){var e,t,n=a("img"),r="sizes"in n;!r&&"srcset"in n?("data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==",e="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",t=function(){s("sizes",2===n.width)},n.onload=t,n.onerror=t,n.setAttribute("sizes","9px"),n.srcset=e+" 1w,data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw== 8w",n.src=e):s("sizes",r)})),w.addTest("srcset","srcset"in a("img")),w.addTest("webworkers","Worker"in t),function(){var e,t,n,r,i,s;for(var a in g)if(g.hasOwnProperty(a)){if(e=[],(t=g[a]).name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(r=o(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)1===(s=e[i].split(".")).length?w[s[0]]=r:(w[s[0]]&&(!w[s[0]]||w[s[0]]instanceof Boolean)||(w[s[0]]=new Boolean(w[s[0]])),w[s[0]][s[1]]=r),C.push((r?"":"no-")+s.join("-"))}}(),i(C),delete y.addTest,delete y.addAsyncTest;for(var j=0;j<w._q.length;j++)w._q[j]();e.Modernizr=w}(window,window,document);
//# sourceMappingURL=about.3f8421ac.js.map
