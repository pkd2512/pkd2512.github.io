var G=Object.defineProperty;var F=(t,e,n)=>e in t?G(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var f=(t,e,n)=>(F(t,typeof e!="symbol"?e+"":e,n),n);function L(){}const _t=t=>t;function I(t,e){for(const n in e)t[n]=e[n];return t}function J(t){return t()}function dt(){return Object.create(null)}function K(t){t.forEach(J)}function Q(t){return typeof t=="function"}function ht(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let m;function mt(t,e){return t===e?!0:(m||(m=document.createElement("a")),m.href=e,t===m.href)}function pt(t){return Object.keys(t).length===0}function U(t,...e){if(t==null){for(const i of e)i(void 0);return L}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function yt(t,e,n){t.$$.on_destroy.push(U(e,n))}function gt(t,e,n,i){if(t){const s=j(t,e,n,i);return t[0](s)}}function j(t,e,n,i){return t[1]&&i?I(n.ctx.slice(),t[1](i(e))):n.ctx}function bt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const c=[],r=Math.max(e.dirty.length,s.length);for(let l=0;l<r;l+=1)c[l]=e.dirty[l]|s[l];return c}return e.dirty|s}return e.dirty}function xt(t,e,n,i,s,c){if(s){const r=j(e,n,i,c);t.p(r,s)}}function wt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function vt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function Et(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function Tt(t){return t&&Q(t.destroy)?t.destroy:L}let b=!1;function Nt(){b=!0}function At(){b=!1}function V(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function X(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let a=0;a<e.length;a++){const u=e[a];u.claim_order!==void 0&&o.push(u)}e=o}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let o=0;o<e.length;o++){const a=e[o].claim_order,u=(s>0&&e[n[s]].claim_order<=a?s+1:V(1,s,W=>e[n[W]].claim_order,a))-1;i[o]=n[u]+1;const M=u+1;n[M]=o,s=Math.max(M,s)}const c=[],r=[];let l=e.length-1;for(let o=n[s]+1;o!=0;o=i[o-1]){for(c.push(e[o-1]);l>=o;l--)r.push(e[l]);l--}for(;l>=0;l--)r.push(e[l]);c.reverse(),r.sort((o,a)=>o.claim_order-a.claim_order);for(let o=0,a=0;o<r.length;o++){for(;a<c.length&&r[o].claim_order>=c[a].claim_order;)a++;const u=a<c.length?c[a]:null;t.insertBefore(r[o],u)}}function P(t,e){t.appendChild(e)}function Y(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function kt(t){const e=x("style");return e.textContent="/* empty */",Z(Y(t),e),e.sheet}function Z(t,e){return P(t.head||t,e),e.sheet}function $(t,e){if(b){for(X(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function tt(t,e,n){t.insertBefore(e,n||null)}function et(t,e,n){b&&!n?$(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function y(t){t.parentNode&&t.parentNode.removeChild(t)}function Mt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function x(t){return document.createElement(t)}function O(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function A(t){return document.createTextNode(t)}function St(){return A(" ")}function Ct(){return A("")}function S(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function k(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const nt=["width","height"];function Dt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set&&nt.indexOf(i)===-1?t[i]=e[i]:k(t,i,e[i])}function Ht(t,e){for(const n in e)k(t,n,e[n])}function Lt(t,e,n){e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:k(t,e,n)}function jt(t){return t.dataset.svelteH}function Pt(t){return Array.from(t.childNodes)}function z(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function q(t,e,n,i,s=!1){z(t);const c=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const l=t[r];if(e(l)){const o=n(l);return o===void 0?t.splice(r,1):t[r]=o,s||(t.claim_info.last_index=r),l}}for(let r=t.claim_info.last_index-1;r>=0;r--){const l=t[r];if(e(l)){const o=n(l);return o===void 0?t.splice(r,1):t[r]=o,s?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,l}}return i()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function B(t,e,n,i){return q(t,s=>s.nodeName===e,s=>{const c=[];for(let r=0;r<s.attributes.length;r++){const l=s.attributes[r];n[l.name]||c.push(l.name)}c.forEach(r=>s.removeAttribute(r))},()=>i(e))}function Ot(t,e,n){return B(t,e,n,x)}function zt(t,e,n){return B(t,e,n,O)}function it(t,e){return q(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>A(e),!0)}function qt(t){return it(t," ")}function C(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return-1}function Bt(t,e){const n=C(t,"HTML_TAG_START",0),i=C(t,"HTML_TAG_END",n+1);if(n===-1||i===-1)return new D(e);z(t);const s=t.splice(n,i-n+1);y(s[0]),y(s[s.length-1]);const c=s.slice(1,s.length-1);for(const r of c)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new D(e,c)}function Rt(t,e){e=""+e,t.data!==e&&(t.data=e)}function Wt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}let p;function st(){if(p===void 0){p=!1;try{typeof window!="undefined"&&window.parent&&window.parent.document}catch(t){p=!0}}return p}function Gt(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=x("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const s=st();let c;return s?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",c=S(window,"message",r=>{r.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{c=S(i.contentWindow,"resize",e),e()}),P(t,i),()=>{(s||c&&i.contentWindow)&&c(),y(i)}}function Ft(t,e,n){t.classList.toggle(e,!!n)}function rt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:i})}function It(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const c=s.textContent.trim();c===`HEAD_${t}_END`?(i-=1,n.push(s)):c===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class ct{constructor(e=!1){f(this,"is_svg",!1);f(this,"e");f(this,"n");f(this,"t");f(this,"a");this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=O(n.nodeName):this.e=x(n.nodeType===11?"TEMPLATE":n.nodeName),this.t=n.tagName!=="TEMPLATE"?n:n.content,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.nodeName==="TEMPLATE"?this.e.content.childNodes:this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)tt(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(y)}}class D extends ct{constructor(n=!1,i){super(n);f(this,"l");this.e=this.n=null,this.l=i}c(n){this.l?this.n=this.l:super.c(n)}i(n){for(let i=0;i<this.n.length;i+=1)et(this.t,this.n[i],n)}}function Jt(t,e){return new t(e)}let g;function v(t){g=t}function w(){if(!g)throw new Error("Function called outside component initialization");return g}function Kt(t){w().$$.on_mount.push(t)}function Qt(t){w().$$.after_update.push(t)}function Ut(t){w().$$.on_destroy.push(t)}function Vt(){const t=w();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const c=rt(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,c)}),!c.defaultPrevented}return!0}}const h=[],H=[];let d=[];const T=[],R=Promise.resolve();let N=!1;function ot(){N||(N=!0,R.then(at))}function Xt(){return ot(),R}function lt(t){d.push(t)}function Yt(t){T.push(t)}const E=new Set;let _=0;function at(){if(_!==0)return;const t=g;do{try{for(;_<h.length;){const e=h[_];_++,v(e),ut(e.$$)}}catch(e){throw h.length=0,_=0,e}for(v(null),h.length=0,_=0;H.length;)H.pop()();for(let e=0;e<d.length;e+=1){const n=d[e];E.has(n)||(E.add(n),n())}d.length=0}while(h.length);for(;T.length;)T.pop()();N=!1,E.clear(),v(t)}function ut(t){if(t.fragment!==null){t.update(),K(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(lt)}}function Zt(t){const e=[],n=[];d.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),d=e}export{v as $,vt as A,lt as B,jt as C,S as D,K as E,Ft as F,Tt as G,yt as H,Mt as I,D as J,Bt as K,gt as L,xt as M,wt as N,bt as O,Gt as P,It as Q,Y as R,kt as S,Q as T,rt as U,_t as V,dt as W,at as X,pt as Y,Zt as Z,g as _,St as a,J as a0,h as a1,ot as a2,Nt as a3,At as a4,Lt as a5,Yt as a6,mt as a7,Dt as a8,Vt as a9,Ut as aa,Qt as b,qt as c,y as d,Ct as e,x as f,Ot as g,Pt as h,et as i,k as j,Wt as k,A as l,it as m,Rt as n,Kt as o,H as p,Jt as q,I as r,ht as s,Xt as t,O as u,zt as v,Ht as w,$ as x,L as y,Et as z};