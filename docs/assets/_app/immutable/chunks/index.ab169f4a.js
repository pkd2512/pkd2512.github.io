import{s as c,r as f,f as b,J as v,g as k,h as j,K as y,d as m,a8 as _,F as o,i as A,y as h,z as d,A as H}from"./scheduler.73f085c3.js";import{g as L}from"./Icon.4d869700.js";import{S,i as q}from"./index.2825cf06.js";function z(s){let e,a,n=[s[4],{rel:"noreferrer"},{href:s[0]},{target:s[2]}],i={};for(let t=0;t<n.length;t+=1)i=f(i,n[t]);return{c(){e=b("a"),a=new v(!1),this.h()},l(t){e=k(t,"A",{rel:!0,href:!0,target:!0});var l=j(e);a=y(l,!1),l.forEach(m),this.h()},h(){a.a=null,_(e,i),o(e,"solid",s[3]),o(e,"svelte-3kvj5r",!0)},m(t,l){A(t,e,l),a.m(s[1],e)},p(t,[l]){l&2&&a.p(t[1]),_(e,i=L(n,[l&16&&t[4],{rel:"noreferrer"},l&1&&{href:t[0]},l&4&&{target:t[2]}])),o(e,"solid",t[3]),o(e,"svelte-3kvj5r",!0)},i:h,o:h,d(t){t&&m(e)}}}function B(s,e,a){const n=["url","label","target","solid"];let i=d(e,n),{url:t="#"}=e,{label:l="Read"}=e,{target:u=""}=e,{solid:g=!1}=e;return s.$$set=r=>{e=f(f({},e),H(r)),a(4,i=d(e,n)),"url"in r&&a(0,t=r.url),"label"in r&&a(1,l=r.label),"target"in r&&a(2,u=r.target),"solid"in r&&a(3,g=r.solid)},[t,l,u,g,i]}class J extends S{constructor(e){super(),q(this,e,B,z,c,{url:0,label:1,target:2,solid:3})}}export{J as L};