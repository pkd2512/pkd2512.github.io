var G=Object.defineProperty;var R=(t,e,n)=>e in t?G(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var f=(t,e,n)=>(R(t,typeof e!="symbol"?e+"":e,n),n);function L(){}function z(t,e){for(const n in e)t[n]=e[n];return t}function F(t){return t()}function ct(){return Object.create(null)}function W(t){t.forEach(F)}function I(t){return typeof t=="function"}function lt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let m;function ot(t,e){return t===e?!0:(m||(m=document.createElement("a")),m.href=e,t===m.href)}function ut(t){return Object.keys(t).length===0}function J(t,...e){if(t==null){for(const i of e)i(void 0);return L}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function at(t,e,n){t.$$.on_destroy.push(J(e,n))}function ft(t,e,n,i){if(t){const s=M(t,e,n,i);return t[0](s)}}function M(t,e,n,i){return t[1]&&i?z(n.ctx.slice(),t[1](i(e))):n.ctx}function _t(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const l=[],r=Math.max(e.dirty.length,s.length);for(let o=0;o<r;o+=1)l[o]=e.dirty[o]|s[o];return l}return e.dirty|s}return e.dirty}function ht(t,e,n,i,s,l){if(s){const r=M(e,n,i,l);t.p(r,s)}}function dt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function mt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function pt(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function yt(t){return t&&I(t.destroy)?t.destroy:L}let y=!1;function gt(){y=!0}function bt(){y=!1}function K(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function Q(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const a=e[u];a.claim_order!==void 0&&c.push(a)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,a=(s>0&&e[n[s]].claim_order<=u?s+1:K(1,s,B=>e[n[B]].claim_order,u))-1;i[c]=n[a]+1;const w=a+1;n[w]=c,s=Math.max(w,s)}const l=[],r=[];let o=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(l.push(e[c-1]);o>=c;o--)r.push(e[o]);o--}for(;o>=0;o--)r.push(e[o]);l.reverse(),r.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<r.length;c++){for(;u<l.length&&r[c].claim_order>=l[u].claim_order;)u++;const a=u<l.length?l[u]:null;t.insertBefore(r[c],a)}}function U(t,e){if(y){for(Q(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function V(t,e,n){t.insertBefore(e,n||null)}function X(t,e,n){y&&!n?U(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function v(t){t.parentNode&&t.parentNode.removeChild(t)}function xt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function S(t){return document.createElement(t)}function j(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function T(t){return document.createTextNode(t)}function vt(){return T(" ")}function Et(){return T("")}function Tt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function D(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const Y=["width","height"];function wt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set&&Y.indexOf(i)===-1?t[i]=e[i]:D(t,i,e[i])}function Nt(t,e){for(const n in e)D(t,n,e[n])}function At(t){return t.dataset.svelteH}function kt(t){return Array.from(t.childNodes)}function P(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function C(t,e,n,i,s=!1){P(t);const l=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const o=t[r];if(e(o)){const c=n(o);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),o}}for(let r=t.claim_info.last_index-1;r>=0;r--){const o=t[r];if(e(o)){const c=n(o);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,o}}return i()})();return l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,l}function O(t,e,n,i){return C(t,s=>s.nodeName===e,s=>{const l=[];for(let r=0;r<s.attributes.length;r++){const o=s.attributes[r];n[o.name]||l.push(o.name)}l.forEach(r=>s.removeAttribute(r))},()=>i(e))}function Ht(t,e,n){return O(t,e,n,S)}function Lt(t,e,n){return O(t,e,n,j)}function Z(t,e){return C(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>T(e),!0)}function Mt(t){return Z(t," ")}function N(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return-1}function St(t,e){const n=N(t,"HTML_TAG_START",0),i=N(t,"HTML_TAG_END",n+1);if(n===-1||i===-1)return new A(e);P(t);const s=t.splice(n,i-n+1);v(s[0]),v(s[s.length-1]);const l=s.slice(1,s.length-1);for(const r of l)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new A(e,l)}function jt(t,e){e=""+e,t.data!==e&&(t.data=e)}function Dt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Pt(t,e,n){t.classList.toggle(e,!!n)}function $(t,e,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:i})}function Ct(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const l=s.textContent.trim();l===`HEAD_${t}_END`?(i-=1,n.push(s)):l===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class tt{constructor(e=!1){f(this,"is_svg",!1);f(this,"e");f(this,"n");f(this,"t");f(this,"a");this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=j(n.nodeName):this.e=S(n.nodeType===11?"TEMPLATE":n.nodeName),this.t=n.tagName!=="TEMPLATE"?n:n.content,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.nodeName==="TEMPLATE"?this.e.content.childNodes:this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)V(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(v)}}class A extends tt{constructor(n=!1,i){super(n);f(this,"l");this.e=this.n=null,this.l=i}c(n){this.l?this.n=this.l:super.c(n)}i(n){for(let i=0;i<this.n.length;i+=1)X(this.t,this.n[i],n)}}function Ot(t,e){return new t(e)}let p;function b(t){p=t}function g(){if(!p)throw new Error("Function called outside component initialization");return p}function qt(t){g().$$.on_mount.push(t)}function Bt(t){g().$$.after_update.push(t)}function Gt(t){g().$$.on_destroy.push(t)}function Rt(){const t=g();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const l=$(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,l)}),!l.defaultPrevented}return!0}}const d=[],k=[];let h=[];const H=[],q=Promise.resolve();let E=!1;function et(){E||(E=!0,q.then(it))}function zt(){return et(),q}function nt(t){h.push(t)}const x=new Set;let _=0;function it(){if(_!==0)return;const t=p;do{try{for(;_<d.length;){const e=d[_];_++,b(e),st(e.$$)}}catch(e){throw d.length=0,_=0,e}for(b(null),d.length=0,_=0;k.length;)k.pop()();for(let e=0;e<h.length;e+=1){const n=h[e];x.has(n)||(x.add(n),n())}h.length=0}while(d.length);for(;H.length;)H.pop()();E=!1,x.clear(),b(t)}function st(t){if(t.fragment!==null){t.update(),W(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(nt)}}function Ft(t){const e=[],n=[];h.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),h=e}export{F as $,_t as A,pt as B,mt as C,j as D,Lt as E,Nt as F,U as G,L as H,nt as I,At as J,W as K,yt as L,at as M,xt as N,Gt as O,A as P,St as Q,Rt as R,ot as S,Ct as T,ct as U,it as V,I as W,ut as X,Ft as Y,p as Z,b as _,vt as a,d as a0,et as a1,gt as a2,bt as a3,Bt as b,Mt as c,v as d,Et as e,S as f,Ht as g,kt as h,X as i,D as j,Dt as k,T as l,Z as m,jt as n,qt as o,k as p,Ot as q,ft as r,lt as s,zt as t,z as u,wt as v,Pt as w,Tt as x,ht as y,dt as z};