import{s as A,r as D,A as x,f as v,a as I,g as w,C as j,c as b,h as N,d as c,j as k,i as p,y as E}from"./scheduler.73f085c3.js";import{S,i as W,b as d,d as f,m as g,a as _,t as $,e as h}from"./index.2825cf06.js";import{g as q,a as P,C as G}from"./Icon.4d869700.js";import{L as K}from"./layout.2ad11be7.js";import{I as U}from"./index.56efbc3e.js";function R(u){let e,s="Hey friends!",i,n,a;return n=new U({props:{src:"/media/tree.jpg",alt:"image"}}),{c(){e=v("p"),e.textContent=s,i=I(),d(n.$$.fragment)},l(t){e=w(t,"P",{"data-svelte-h":!0}),j(e)!=="svelte-10dfq3u"&&(e.textContent=s),i=b(t),f(n.$$.fragment,t)},m(t,o){p(t,e,o),p(t,i,o),g(n,t,o),a=!0},p:E,i(t){a||(_(n.$$.fragment,t),a=!0)},o(t){$(n.$$.fragment,t),a=!1},d(t){t&&(c(e),c(i)),h(n,t)}}}function T(u){let e,s="Markdown",i,n,a,t,o,m;return n=new G({props:{width:"sm",$$slots:{default:[R]},$$scope:{ctx:u}}}),o=new U({props:{src:"/media/page.png",alt:"image"}}),{c(){e=v("h2"),e.textContent=s,i=I(),d(n.$$.fragment),a=I(),t=v("figure"),d(o.$$.fragment),this.h()},l(r){e=w(r,"H2",{id:!0,"data-svelte-h":!0}),j(e)!=="svelte-1d849be"&&(e.textContent=s),i=b(r),f(n.$$.fragment,r),a=b(r),t=w(r,"FIGURE",{});var l=N(t);f(o.$$.fragment,l),l.forEach(c),this.h()},h(){k(e,"id","markdown")},m(r,l){p(r,e,l),p(r,i,l),g(n,r,l),p(r,a,l),p(r,t,l),g(o,t,null),m=!0},p(r,l){const C={};l&2&&(C.$$scope={dirty:l,ctx:r}),n.$set(C)},i(r){m||(_(n.$$.fragment,r),_(o.$$.fragment,r),m=!0)},o(r){$(n.$$.fragment,r),$(o.$$.fragment,r),m=!1},d(r){r&&(c(e),c(i),c(a),c(t)),h(n,r),h(o)}}}function L(u){let e,s;const i=[u[0],y];let n={$$slots:{default:[T]},$$scope:{ctx:u}};for(let a=0;a<i.length;a+=1)n=D(n,i[a]);return e=new K({props:n}),{c(){d(e.$$.fragment)},l(a){f(e.$$.fragment,a)},m(a,t){g(e,a,t),s=!0},p(a,[t]){const o=t&1?q(i,[t&1&&P(a[0]),t&0&&P(y)]):{};t&2&&(o.$$scope={dirty:t,ctx:a}),e.$set(o)},i(a){s||(_(e.$$.fragment,a),s=!0)},o(a){$(e.$$.fragment,a),s=!1},d(a){h(e,a)}}}const y={title:"Air Pollution in Northern India during Winters | Prasanta Kumar Dutta",description:"Investigating the causes behind the air quality crisis in northern India every winter and its extent, using data collected from air quality monitors, satellite imagery from NASA and photographic evidence.",keywords:"Data Journalist, Graphics Journalist, Reuters Graphics Journalist, Data Visualisation Developer, Data Visualization Developer, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User-centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveller, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute of Technology Durgapur, Prasanta, PrasantaKrDutta, Prasanta Kumar Dutta, Prasanta KrDutta, pkddapacific, pkd.dapacific, pkd_da_pacific, daPacific.",image:"tree.jpg",type:"project",date:"2017-4-9",published:!0,categories:["Reuters","Data Visuallisation","Infographics"],links:[{type:"project",url:"https://www.reuters.com/graphics/INDIA-POLLUTION/010080SY1KE/",label:"📔 View Project",target:"_blank"},{type:"doc",url:"projects/delhi-winter-pollution/",label:"🗒️ Read more"}],intro:{hed:"Air Pollution in Northern India during Winters",dek:"per, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User-centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveller, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute",img:"projects/dodata/hero.jpg",duration:"4 weeks",client:"Reuters",quote:"“As our world turns digital, donating data is the most efficient way of donating” — dodata.org"}};function O(u,e,s){return u.$$set=i=>{s(0,e=D(D({},e),x(i)))},e=x(e),[e]}class V extends S{constructor(e){super(),W(this,e,O,L,A,{})}}const X=Object.freeze(Object.defineProperty({__proto__:null,default:V,metadata:y},Symbol.toStringTag,{value:"Module"}));export{X as _};