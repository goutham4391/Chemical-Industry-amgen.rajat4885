!function(e,t){"function"==typeof define&&define.amd?define([],function(){return e.svg4everybody=t()}):"object"==typeof module&&module.exports?module.exports=t():e.svg4everybody=t()}(this,function(){function e(e,t,n){if(n){var i=document.createDocumentFragment(),o=!t.hasAttribute("viewBox")&&n.getAttribute("viewBox");o&&t.setAttribute("viewBox",o);for(var a=n.cloneNode(!0);a.childNodes.length;)i.appendChild(a.firstChild);e.appendChild(i)}}function t(t){t.onreadystatechange=function(){if(4===t.readyState){var n=t._cachedDocument;n||((n=t._cachedDocument=document.implementation.createHTMLDocument("")).body.innerHTML=t.responseText,t._cachedTarget={}),t._embeds.splice(0).map(function(i){var o=t._cachedTarget[i.id];o||(o=t._cachedTarget[i.id]=n.getElementById(i.id)),e(i.parent,i.svg,o)})}},t.onreadystatechange()}function n(e){for(var t=e;"svg"!==t.nodeName.toLowerCase()&&(t=t.parentNode););return t}return function(i){var o,a=Object(i),r=window.top!==window.self;o="polyfill"in a?a.polyfill:/\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/.test(navigator.userAgent)||(navigator.userAgent.match(/\bEdge\/12\.(\d+)\b/)||[])[1]<10547||(navigator.userAgent.match(/\bAppleWebKit\/(\d+)\b/)||[])[1]<537||/\bEdge\/.(\d+)\b/.test(navigator.userAgent)&&r;var d={},s=window.requestAnimationFrame||setTimeout,u=document.getElementsByTagName("use"),c=0;o&&function i(){for(var r=0;r<u.length;){var l=u[r],g=l.parentNode,f=n(g),m=l.getAttribute("xlink:href")||l.getAttribute("href");if(!m&&a.attributeName&&(m=l.getAttribute(a.attributeName)),f&&m){if(o)if(!a.validate||a.validate(m,f,l)){g.removeChild(l);var v=m.split("#"),b=v.shift(),p=v.join("#");if(b.length){var h=d[b];h||((h=d[b]=new XMLHttpRequest).open("../../../../page-not-found.html",b),h.send(),h._embeds=[]),h._embeds.push({parent:g,svg:f,id:p}),t(h)}else e(g,f,document.getElementById(p))}else++r,++c}else++r}(!u.length||u.length-c>0)&&s(i,67)}()}}),svg4everybody({nosvg:!0,polyfill:!0});