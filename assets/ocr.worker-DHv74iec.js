var _w=Object.defineProperty;var bw=(Lt,$t,Vt)=>$t in Lt?_w(Lt,$t,{enumerable:!0,configurable:!0,writable:!0,value:Vt}):Lt[$t]=Vt;var sm=(Lt,$t,Vt)=>bw(Lt,typeof $t!="symbol"?$t+"":$t,Vt);(function(){"use strict";var Lt=Object.defineProperty,$t=(e,t,r)=>t in e?Lt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Vt=(e,t,r)=>$t(e,typeof t!="symbol"?t+"":t,r);let Fa=(e,t)=>new OffscreenCanvas(e,t);function yr(e,t){return Fa(e,t)}function lm(e){Fa=e}function ja(e){return e>0?Math.floor(e):Math.ceil(e)}function lr(e,t,r){return Math.max(t,Math.min(e,r))}function zi(e,t,r,i,n="high"){return dm(e,t,r,i,n).getImageData(0,0,t,r)}function dm(e,t,r,i,n="high"){const s=Gt(e),a=yr(t,r).getContext("2d");return a.imageSmoothingEnabled=n!==!1,n&&(a.imageSmoothingQuality=n),i==="fill"?a.scale(Math.min(t/e.width,1),Math.min(r/e.height,1)):a.scale(t/e.width,r/e.height),a.drawImage(s,0,0),a}function Gt(e,t,r){const i=yr(t||e.width,r||e.height);return i.getContext("2d").putImageData(e,0,0),i}function Ci(e,t,r){const i=e.data,n=[],s=[],a=[];let u=0,l=0;for(let d=0;d<i.length;d+=4)a[l]||(a[l]=[]),s[l]||(s[l]=[]),n[l]||(n[l]=[]),n[l][u]=(i[d]/255-t[0])/r[0],s[l][u]=(i[d+1]/255-t[1])/r[1],a[l][u]=(i[d+2]/255-t[2])/r[2],u++,u===e.width&&(u=0,l++);return[a,s,n]}let Ka=class{constructor(t){Vt(this,"tl",[]),Vt(this,"name"),this.name=t}l(t){const r=performance.now();this.tl.push({t,n:r});const i=[];for(let s=1;s<this.tl.length;s++){const a=this.tl[s].n-this.tl[s-1].n,u=this.tl[s-1].t,l=i.find(d=>d.n===u);l?(l.c++,l.d+=a):i.push({d:a,n:u,c:1})}const n=[];for(const s of i){const a=s.c>1?`${s.n}x${s.c}`:s.n;n.push(`${a} ${s.d}`)}n.push(this.tl.at(-1).t),console.log(`${this.name} ${i.map(s=>s.d).reduce((s,a)=>s+a,0)}ms: `,n.join(" "))}};async function pm(e,t,r,i,n,s){const{transposedData:a,image:u}=cm(e,n,s),l=(await hm(a,u,t,r))[0].data,d=l.reduce((c,f)=>Math.max(c,f)),h=l.findIndex(c=>c===d);return i[h]}function cm(e,t,r){const i=zi(e,t,r);return{transposedData:Ci(i,[.485,.456,.406],[.229,.224,.225]),image:i}}async function hm(e,t,r,i){const n=e.flat(Number.POSITIVE_INFINITY),s=Float32Array.from(n),a=new r.Tensor("float32",s,[1,3,t.height,t.width]),u={};u[i.inputNames[0]]=a;const l=await i.run(u);return Object.values(l)}function fm(e){if(e.length===0)throw new Error("Empty contour");const t=mm([...e]);let r=Number.POSITIVE_INFINITY;const i={center:{x:0,y:0},size:{width:0,height:0},angle:0};for(let n=0;n<t.length;n++){const s=t[n],a=t[(n+1)%t.length],u={x:a.x-s.x,y:a.y-s.y},l=Math.hypot(u.x,u.y),[d,h]=[u.x/l,u.y/l];let c=Number.POSITIVE_INFINITY,f=Number.NEGATIVE_INFINITY,y=Number.POSITIVE_INFINITY,w=Number.NEGATIVE_INFINITY;for(const k of t){const $=(k.x-s.x)*d+(k.y-s.y)*h;c=Math.min(c,$),f=Math.max(f,$);const b=-(k.x-s.x)*h+(k.y-s.y)*d;y=Math.min(y,b),w=Math.max(w,b)}const _=(f-c)*(w-y);if(_<r){r=_;const k=(c+f)/2,$=(y+w)/2;i.center={x:s.x+d*k-h*$,y:s.y+h*k+d*$},i.size={width:f-c,height:w-y},i.angle=Math.atan2(h,d)*(180/Math.PI)}}return i.size.width<i.size.height&&([i.size.width,i.size.height]=[i.size.height,i.size.width],i.angle+=90),i.angle=(i.angle%180+180)%180,i}function mm(e){e.sort((i,n)=>i.x-n.x||i.y-n.y);const t=[];for(const i of e){for(;t.length>=2&&Qa(t[t.length-2],t[t.length-1],i)<=0;)t.pop();t.push(i)}const r=[];for(let i=e.length-1;i>=0;i--){const n=e[i];for(;r.length>=2&&Qa(r[r.length-2],r[r.length-1],n)<=0;)r.pop();r.push(n)}return t.slice(0,-1).concat(r.slice(0,-1))}function Qa(e,t,r){return(t.x-e.x)*(r.y-e.y)-(t.y-e.y)*(r.x-e.x)}function gm(e,t,r="CHAIN_APPROX_SIMPLE"){const i=e.length,n=i>0?e[0].length:0,s=Array.from({length:i},()=>new Array(n).fill(!1));for(let a=0;a<i;a++)for(let u=0;u<n;u++)if(e[a][u]!==0&&!s[a][u]&&Za(e,u,a)){const l=ym(e,s,u,a,r==="CHAIN_APPROX_SIMPLE");t.push(l)}}function Za(e,t,r){return e[r][t]!==0&&(r>0&&e[r-1][t]===0||r<e.length-1&&e[r+1][t]===0||t>0&&e[r][t-1]===0||t<e[0].length-1&&e[r][t+1]===0)}function ym(e,t,r,i,n){const s=[];let a={x:r,y:i},u={x:r-1,y:i};const l=new Map,d=new Map;function h(_){return _.x+_.y*e[0].length}function c(_){const k=Math.floor(_/e[0].length);return{x:_%e[0].length,y:k}}function f(_,k){const $=h(_),b=h(k),I=Ai(k.x-_.x,k.y-_.y),S=Ai(_.x-k.x,_.y-k.y),E=l.get($)??[],A=l.get(b)??[];l.set($,[...E,I]),l.set(b,[...A,S])}function y(_){const k=h(a);u=a,a={x:a.x+Lr[_].dx,y:a.y+Lr[_].dy},f(u,a);const $=(d.get(k)??[]).filter(b=>b!==_);$.length>0?d.set(k,$):d.delete(k)}l.set(h(a),[Ai(-1,0)]);let w=0;do{s.push(a),t[a.y][a.x]=!0;const _=wm(e,l,a);if(_.length===0){if(d.size===0)break;const[k,$]=Array.from(d.entries()).at(0),b=$[0];a=c(k),y(b)}if(_.length>=1){const k=h(a);d.set(k,_);const $=_[0];y($)}w++}while(w<1e9);return n?_m(s):s}const Lr=[{dx:1,dy:0},{dx:1,dy:-1},{dx:0,dy:-1},{dx:-1,dy:-1},{dx:-1,dy:0},{dx:-1,dy:1},{dx:0,dy:1},{dx:1,dy:1}];function wm(e,t,r){function i(a){return a.x+a.y*e[0].length}const n=t.get(i(r))??[],s=[];for(const[a,{dx:u,dy:l}]of Lr.entries()){if(n.includes(a))continue;const d=r.x+u,h=r.y+l;d>=0&&d<e[0].length&&h>=0&&h<e.length&&Za(e,d,h)&&s.push(a)}return s}function Ai(e,t){const r=Lr.findIndex(({dx:i,dy:n})=>e===i&&t===n);return r===-1?0:r}function _m(e){if(e.length<3)return[...e];const t=[e[0]];for(let r=1;r<e.length-1;r++){const i=t[t.length-1],n=e[r],s=e[r+1];bm(i,n,s)||t.push(n)}return t.push(e[e.length-1]),t}function bm(e,t,r){return(t.x-e.x)*(r.y-t.y)===(t.y-e.y)*(r.x-t.x)}const Ht=new Ka("t"),Ct=new Ka("af_det");let ct=!1,Oi=!1;function wr(e,t){var r;const i=document.createElement("canvas");i.width=e.width,i.height=e.height,i.getContext("2d").drawImage(e,0,0),t&&(i.id=t);try{(r=document==null?void 0:document.body)==null||r.append(i)}catch{}}let Vr=(e,t,r)=>new ImageData(e,t,r);function Ze(...e){Oi&&console.log(...e)}function $m(...e){Oi&&console.log(e.map(t=>`%c${t}`).join(""),...e.map(t=>`color: ${t}`))}async function vm(e){Ya(e);const t={det:"det"in e?e.det:{input:e.detPath,ratio:e.detRatio,on:async i=>{e.onDet&&e.onDet(i),e.onProgress&&e.onProgress("det",1,1)}},rec:"rec"in e?e.rec:{input:e.recPath,decodeDic:e.dic,imgh:e.imgh,on:async(i,n,s)=>{e.onRec&&e.onRec(i,{text:n.map(a=>a[0].t).join(""),mean:n.map(a=>a[0].mean).reduce((a,u)=>a+u,0)/n.length}),e.onProgress&&e.onProgress("rec",s,i+1)}},docCls:"rec"in e?e.docCls:e.docClsPath?{input:e.docClsPath}:void 0,analyzeLayout:"rec"in e?e.analyzeLayout:{columnsTip:e.columnsTip,docDirs:e.docDirs},...e};return await km(t)}function Ya(e){ct=!!e.dev,Oi=ct||!!e.log,ct||(Ht.l=()=>{},Ct.l=()=>{}),e.canvas&&lm(e.canvas),e.imageData&&(Vr=e.imageData)}async function xm(e){let t;if(typeof window>"u"){const r=e;if(!r.data||!r.width||!r.height)throw new Error("invalid image data");return r}if(typeof e=="string"?(t=new Image,t.src=e,await new Promise(r=>{t.onload=r})):t=e,t instanceof HTMLImageElement){const r=yr(t.naturalWidth,t.naturalHeight).getContext("2d");if(!r)throw new Error("canvas context is null");r.drawImage(t,0,0),t=r.getImageData(0,0,t.naturalWidth,t.naturalHeight)}if(t instanceof HTMLCanvasElement){const r=t.getContext("2d");if(!r)throw new Error("canvas context is null");t=r.getImageData(0,0,t.width,t.height)}return t}function Mi(){try{yr(1,1),Vr(new Uint8ClampedArray(4),1,1)}catch(e){throw console.log("nodejs need set canvas, please use setOCREnv to set canvas and imageData"),e}}async function km(e){Mi();const t={ort:e.ort,ortOption:e.ortOption},r=e.docCls?await Sm({...e.docCls,...t}):void 0,i=await Im({...e.det,...t}),n=await Tm({...e.rec,...t});return{ocr:async s=>{let a=await xm(s),u=0;r&&(u=await r.docCls(a),Ze("dir",u),a=es(a,360-u));const l=await i.det(a),d=await n.rec(l),h=Gm(d,e.analyzeLayout);return Ze(d,h),Ht.l("end"),{src:d,...h,docDir:u}},det:i.det,rec:n.rec,recRaw:n.rawRec}}function Bi(e,t,r){return e.InferenceSession.create(t,r)}async function Sm(e){const t=await Bi(e.ort,e.input,e.ortOption);return{docCls:async r=>pm(r,e.ort,t,[0,90,180,270],224,224)}}async function Im(e){Mi();let t=1;const r=await Bi(e.ort,e.input,e.ortOption);e.ratio!==void 0&&(t=e.ratio);async function i(n){var s;const a=n;if(ct){const w=Gt(a);wr(w)}Ht.l("pre_det");const{data:u,width:l,height:d}=Cm(a,t),{transposedData:h,image:c}=u;Ht.l("det");const f=await Em(h,c,r,e.ort);Ht.l("aft_det");const y=Am({data:f.data,width:f.dims[3],height:f.dims[2]},l,d,a);return(s=e==null?void 0:e.on)==null||s.call(e,y),y}return{det:i}}async function Tm(e){var t;Mi();let r=48;const i=await Bi(e.ort,e.input,e.ortOption),n=e.decodeDic.split(/\r\n|\r|\n/)||[];n.at(-1)===""?n[n.length-1]=" ":n.push(" "),e.imgh&&(r=e.imgh);const s=((t=e.optimize)==null?void 0:t.space)===void 0?!0:e.optimize.space;async function a(l,d){var h,c,f;const y=[];Ht.l("bf_rec");const w=Lm(l,r),_=(d==null?void 0:d.topK)||((h=e.multiChar)==null?void 0:h.topK)||2,k=(d==null?void 0:d.threshold)||((c=e.multiChar)==null?void 0:c.threshold)||1e-5;for(const[$,b]of w.entries()){const{b:I,imgH:S,imgW:E}=b,A=await zm(I,S,E,i,e.ort),O=Vm(A,n,{topK:_,threshold:k})[0];y.push({text:O,box:l[$].box,style:l[$].style}),(f=e==null?void 0:e.on)==null||f.call(e,$,O,l.length)}return Ht.l("rec_end"),y}async function u(l){const d=[],h=await a(l,{topK:2,threshold:1e-5});for(const c of h){const f=c.text.map(_=>s&&_[0].t===""&&_[1].t===" "&&_[1].mean>.001?_[1]:_[0]),y=f.map(_=>_.t).join("").trim(),w=f.map(_=>_.mean).reduce((_,k)=>_+k,0)/f.length;w<.5||d.push({text:y,mean:w,box:c.box,style:c.style})}return d}return{rec:u,rawRec:a}}async function Em(e,t,r,i){const n=Float32Array.from(e.flat(3)),s=new i.Tensor("float32",n,[1,3,t.height,t.width]),a={};return a[r.inputNames[0]]=s,(await r.run(a))[r.outputNames[0]]}async function zm(e,t,r,i,n){const s=Float32Array.from(e.flat(3)),a=new n.Tensor("float32",s,[1,3,t,r]),u={};return u[i.inputNames[0]]=a,(await i.run(u))[i.outputNames[0]]}function Cm(e,t){const r=Math.max(Math.round(e.height*t/32)*32,32),i=Math.max(Math.round(e.width*t/32)*32,32);if(ct){const a=Gt(e);wr(a)}const n=zi(e,i,r,"fill"),s=Ci(n,[.485,.456,.406],[.229,.224,.225]);if(Ze(n),ct){const a=Gt(n);wr(a)}return{data:{transposedData:s,image:n},width:i,height:r}}function Am(e,t,r,i){Ct.l("");const n=Math.min(i.width,t),s=Math.min(i.height,r),{data:a,width:u,height:l}=e,d=new Uint8Array(u*l);for(let y=0;y<a.length;y++){const w=a[y]>.3?255:0;d[y]=w}if(ct){const y=new Uint8ClampedArray(u*l*4);for(let k=0;k<a.length;k++){const $=k*4,b=a[k]>.3?255:0;y[$]=y[$+1]=y[$+2]=b,y[$+3]=255,d[k]=b}const w=Vr(y,u,l),_=Gt(w);wr(_,"det_ru")}Ct.l("edge");const h=[],c=[];for(let y=0;y<l;y++)c.push(Array.from(d.slice(y*u,y*u+u)));const f=[];if(gm(c,f),ct){const y=document.querySelector("#det_ru").getContext("2d");for(const w of f){y.moveTo(w[0].x,w[0].y);for(const _ of w)y.lineTo(_.x,_.y);y.strokeStyle="red",y.closePath(),y.stroke()}}for(let y=0;y<f.length;y++){Ct.l("get_box");const w=3,_=f[y],{points:k,sside:$}=Rm(_);if($<w)continue;const b=Bm(k),I=b.points;if(b.sside<w+2)continue;const S=i.width/n,E=i.height/s;for(let Q=0;Q<I.length;Q++)I[Q][0]*=S,I[Q][1]*=E;Ct.l("order");const A=Dm(I);for(const Q of A)Q[0]=lr(Math.round(Q[0]),0,i.width),Q[1]=lr(Math.round(Q[1]),0,i.height);const O=ja(Xa(A[0],A[1])),x=ja(Xa(A[0],A[3]));if(O<=3||x<=3)continue;Hm(I,"","red","det_ru"),Ct.l("crop");const D=Pm(i,I);Ct.l("match best");const{bg:U,text:H}=Um(D),K=Wm(I,D,H);h.push({box:K,img:D,style:{bg:U,text:H}})}return Ct.l("e"),Ze(h),h}function Om(e){let t=-1;const r=e.length;let i,n=e[r-1],s=0;for(;++t<r;)i=n,n=e[t],s+=i[1]*n[0]-i[0]*n[1];return s/2}function Mm(e){let t=-1;const r=e.length;let i=e[r-1],n,s,a=i[0],u=i[1],l=0;for(;++t<r;)n=a,s=u,i=e[t],a=i[0],u=i[1],n-=a,s-=u,l+=Math.hypot(n,s);return l}function Bm(e){const t=Math.abs(Om(e)),r=Mm(e),i=t*1.5/r,n=[];for(const[l,d]of e.entries()){const h=e.at((l-1)%4),c=e.at((l+1)%4),f=d[0]-h[0],y=d[1]-h[1],w=Math.sqrt(f**2+y**2),_=f/w*i,k=y/w*i,$=d[0]-c[0],b=d[1]-c[1],I=Math.sqrt($**2+b**2),S=$/I*i,E=b/I*i;n.push([d[0]+_+S,d[1]+k+E])}const s=[n[0][0]-n[1][0],n[0][1]-n[1][1]],a=[n[2][0]-n[1][0],n[2][1]-n[1][1]],u=s[0]*a[1]-s[1]*a[0];return{points:n,sside:Math.abs(u)}}function Nm(e,t,r){const i=t.width,n=t.height,s=r*Math.PI/180,a=Math.cos(s),u=Math.sin(s),l=e.x,d=e.y,h=i*.5,c=n*.5,f=[],y=l-h*a+c*u,w=d-h*u-c*a;f.push([y,w]);const _=l+h*a+c*u,k=d+h*u-c*a;f.push([_,k]);const $=l+h*a-c*u,b=d+h*u+c*a;f.push([$,b]);const I=l-h*a-c*u,S=d-h*u+c*a;return f.push([I,S]),f}function Rm(e){const t=fm(e),r=Array.from(Nm(t.center,t.size,t.angle)).sort((d,h)=>d[0]-h[0]);let i=0,n=1,s=2,a=3;r[1][1]>r[0][1]?(i=0,a=1):(i=1,a=0),r[3][1]>r[2][1]?(n=2,s=3):(n=3,s=2);const u=[r[i],r[n],r[s],r[a]],l=Math.min(t.size.height,t.size.width);return{points:u,sside:l}}function Xa(e,t){return Math.sqrt((e[0]-t[0])**2+(e[1]-t[1])**2)}function Dm(e){const t=[[0,0],[0,0],[0,0],[0,0]],r=e.map(s=>s[0]+s[1]);t[0]=e[r.indexOf(Math.min(...r))],t[2]=e[r.indexOf(Math.max(...r))];const i=e.filter(s=>s!==t[0]&&s!==t[2]),n=i[1].map((s,a)=>s-i[0][a]);return t[1]=i[n.indexOf(Math.min(...n))],t[3]=i[n.indexOf(Math.max(...n))],t}function Pm(e,t){const[r,i,n,s]=t.map(A=>({x:A[0],y:A[1]})),a=Math.sqrt((i.x-r.x)**2+(i.y-r.y)**2),u=Math.sqrt((s.x-r.x)**2+(s.y-r.y)**2),l=i.x-r.x,d=i.y-r.y,h=s.x-r.x,c=s.y-r.y,f=l*c-h*d;if(f===0)throw new Error("点共线，无法形成矩形");const y=a*c/f,w=-h*a/f,_=-u*d/f,k=l*u/f,$=-y*r.x-w*r.y,b=-_*r.x-k*r.y,I=Gt(e),S=yr(Math.ceil(a),Math.ceil(u)),E=S.getContext("2d");return E.setTransform(y,_,w,k,$,b),E.drawImage(I,0,0),E.resetTransform(),E.getImageData(0,0,S.width,S.height)}function Um(e){var t,r;const i=new Map,n=e.data;for(let h=0;h<n.length;h+=4){if(h/4%e.width>e.height*4)continue;const c=n[h],f=n[h+1],y=n[h+2],w=[c,f,y].join(",");i.set(w,(i.get(w)||0)+1)}const s=qm(i,20).map(h=>({el:h.el.split(",").map(Number),count:h.count})),a=((t=s.at(0))==null?void 0:t.el)||[255,255,255],u=((r=s.at(1))==null?void 0:r.el)||[0,0,0];let l=u;const d=100;if(Gr(u,a)<d){const h=s.slice(1).filter(c=>Gr(c.el,a)>50);h.length>0&&(l=[0,1,2].map(c=>Math.round(Ja(h.map(f=>[f.el[c],f.count]))))),(h.length===0||Gr(l,a)<d)&&(l=a.map(c=>255-c)),$m(`rgb(${l.join(",")})`)}return{bg:a,text:l,textEdge:u}}function Gr(e,t){const r=e,i=t;return Math.sqrt((r[0]-i[0])**2+(r[1]-i[1])**2+(r[2]-i[2])**2)}function qm(e,t=1){let r=[];return e.forEach((i,n)=>{r.length===0?r.push({el:n,count:i}):(r.length<t?r.push({el:n,count:i}):r.find(s=>s.count<=i)&&r.push({el:n,count:i}),r.sort((s,a)=>a.count-s.count),r.length>t&&(r=r.slice(0,t)))}),r}function Wm(e,t,r){let i=0,n=t.height,s=0,a=t.width;function u(f){return Gr(f,r)<200}e:for(let f=i;f<t.height;f++)for(let y=0;y<t.width;y++){const w=Hr(t,y,f);if(u(w)){i=f;break e}}e:for(let f=n-1;f>=0;f--)for(let y=0;y<t.width;y++){const w=Hr(t,y,f);if(u(w)){n=f;break e}}e:for(let f=s;f<t.width;f++)for(let y=i;y<=n;y++){const w=Hr(t,f,y);if(u(w)){s=f;break e}}e:for(let f=a-1;f>=0;f--)for(let y=i;y<=n;y++){const w=Hr(t,f,y);if(u(w)){a=f;break e}}const l=lr(i-1,0,4),d=lr(t.height-n-1,0,4),h=lr(s-1,0,4),c=lr(t.width-a-1,0,4);return[[e[0][0]+h,e[0][1]+l],[e[1][0]-c,e[1][1]+l],[e[2][0]-c,e[2][1]-d],[e[3][0]+h,e[3][1]-d]]}function Hr(e,t,r){const i=(r*e.width+t)*4;return Array.from(e.data.slice(i,i+4))}function Lm(e,t){const r=[];function i(n){const s=Math.floor(t*(n.width/n.height)),a=zi(n,s,t,void 0,!1);return ct&&wr(Gt(a,s,t)),{data:a,w:s,h:t}}for(const n of e){let s=n.img;s.width<s.height&&(s=es(s,-90));const a=i(s);r.push({b:Ci(a.data,[.5,.5,.5],[.5,.5,.5]),imgH:a.h,imgW:a.w})}return Ze(r),r}function Vm(e,t,r){const i=e.dims[2],n=[];let s=e.dims[0]-1;const a=r.topK,u=r.threshold;function l(h){return t.at(h-1)??""}for(let h=0;h<e.data.length;h+=i*e.dims[1]){const c=[];for(let f=h;f<h+i*e.dims[1];f+=i){const y=e.data.slice(f,f+i),w=[];for(let _=0;_<y.length;_++){const k=y[_];if(!(k<u)){if(!(w.length===a&&k<=w.at(-1).v)){const $=w.findIndex(b=>b.v>k);$===-1?w.unshift({t:_,v:k}):w.splice($+1,0,{t:_,v:k})}w.length>a&&w.pop()}}c.push(w)}n[s]=d(c),s--}function d(h){const c=[];for(let f=0;f<h.length;f++)h[f][0].t!==0&&(f>0&&h[f-1][0].t===h[f][0].t||c.push(h[f].map(y=>({t:l(y.t),mean:y.v}))));return c}return n}function Gm(e,t){var r;Ze(e);const i=(t==null?void 0:t.docDirs)??[{block:"tb",inline:"lr"},{block:"rl",inline:"tb"}],n={block:"tb",inline:"lr"},s={inline:[1,0],block:[0,1]},a={inline:[1,0],block:[0,1]};if(e.length===0)return{columns:[],parragraphs:[],readingDir:n,angle:{reading:{inline:0,block:90},angle:0}};const u=[{box:[[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],[Number.POSITIVE_INFINITY,Number.NEGATIVE_INFINITY],[Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY],[Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY]],type:"none"}],l=0;function d(z){const M=c.center(z);for(let V=u.length-1;V>=0;V--){const F=u[V].box;if(M[0]>=F[0][0]&&M[0]<=F[1][0]&&M[1]>=F[0][1]&&M[1]<=F[3][1])return V}return l}const h={center:(z,M)=>[(z[0]+M[0])/2,(z[1]+M[1])/2],disByV:(z,M,V)=>Math.abs(V==="block"?f.dotMup(z,a.block)-f.dotMup(M,a.block):f.dotMup(z,a.inline)-f.dotMup(M,a.inline)),compare:(z,M,V)=>V==="block"?f.dotMup(z,a.block)-f.dotMup(M,a.block):f.dotMup(z,a.inline)-f.dotMup(M,a.inline),toInline:z=>f.dotMup(z,a.inline),toBlock:z=>f.dotMup(z,a.block)},c={inlineStart:z=>h.center(z[0],z[3]),inlineEnd:z=>h.center(z[1],z[2]),blockStart:z=>h.center(z[0],z[1]),blockEnd:z=>h.center(z[2],z[3]),inlineSize:z=>z[1][0]-z[0][0],blockSize:z=>z[3][1]-z[0][1],inlineStartDis:(z,M)=>h.disByV(z[0],M[0],"inline"),inlineEndDis:(z,M)=>h.disByV(z[1],M[1],"inline"),blockGap:(z,M)=>h.disByV(z[0],M[3],"block"),inlineCenter:z=>(z[2][0]+z[0][0])/2,blockCenter:z=>(z[2][1]+z[0][1])/2,inlineStartCenter:z=>c.inlineStart(z),center:z=>h.center(z[0],z[2])},f={fromPonts:(z,M)=>[z[0]-M[0],z[1]-M[1]],dotMup:(z,M)=>z[0]*M[0]+z[1]*M[1],numMup:(z,M)=>[z[0]*M,z[1]*M],add:(z,M)=>[z[0]+M[0],z[1]+M[1]]};function y(z){let M=0,V=0;const F=[];for(const[ce,ae]of z.entries()){const ye=ae>180?ae-180:ae,Ce=ye-180,Ae=ce===0?ye:Math.abs(Ce-M)<Math.abs(ye-M)?Ce:ye;F.push(Ae),M=(M*V+Ae)/(V+1),V++}return{av:M,l:F}}function w(z,M){return Math.abs(z-M)<45||Math.abs(z-(M-180))<45||Math.abs(z-180-M)<45}function _(z){z.sort((V,F)=>V-F);const M=Math.floor(z.length/2);return z.length%2===0?(z[M-1]+z[M])/2:z[M]}function k(z){return z==="lr"||z==="rl"?"x":"y"}function $(z,M){let V=Number.POSITIVE_INFINITY,F=-1;for(let ce=0;ce<z.length;ce++){const ae=M(z[ce]);ae<V&&(V=ae,F=ce)}return z[F]}const b={lr:[1,0],rl:[-1,0],tb:[0,1],bt:[0,-1]};function I(z,M){const V=b[z.inline],F=b[z.block],ce=b[M.inline],ae=b[M.block],ye=[f.dotMup(ce,V),f.dotMup(ce,F)],Ce=[f.dotMup(ae,V),f.dotMup(ae,F)];return Ae=>[f.dotMup(Ae,ye),f.dotMup(Ae,Ce)]}function S(z,M){const V=I(z,M);return{b:F=>{for(const ce of F){const[ae,ye]=V(ce);ce[0]=ae,ce[1]=ye}},p:V}}function E(z){return M=>{const V=[[0,0],[0,0],[0,0],[0,0]];for(let F=0;F<z.length;F++)V[F]=M[z[F]];return V}}function A(z,M){return Math.sqrt((z[0]-M[0])**2+(z[1]-M[1])**2)}function O(z){const M=z.flatMap(Be=>Be.map(Se=>Se)),V=Math.min(...M.map(Be=>f.dotMup(Be,a.inline))),F=Math.max(...M.map(Be=>f.dotMup(Be,a.inline))),ce=Math.min(...M.map(Be=>f.dotMup(Be,a.block))),ae=Math.max(...M.map(Be=>f.dotMup(Be,a.block))),ye=f.add(f.numMup(a.inline,V),f.numMup(a.block,ce)),Ce=f.numMup(a.inline,F-V),Ae=f.numMup(a.block,ae-ce);return[ye,f.add(ye,Ce),f.add(f.add(ye,Ce),Ae),f.add(ye,Ae)]}function x(z){let M=null,V=Number.POSITIVE_INFINITY;for(const Ae in Ne){const Be=Ne[Ae].src.at(-1);if(!Be)continue;const Se=A(z.box[0],Be.box[0]);Se<V&&(M=Number(Ae),V=Se)}if(M===null){Ne.push({src:[z]});return}const F=Ne[M].src.at(-1),ce=c.inlineSize(z.box),ae=c.inlineSize(F.box),ye=Math.min(ce,ae),Ce=c.blockSize(z.box);if(!((c.inlineStartDis(z.box,F.box)<3*Ce||c.inlineEndDis(z.box,F.box)<3*Ce||h.disByV(c.center(z.box),c.center(F.box),"inline")<ye*.4)&&c.blockGap(z.box,F.box)<Ce*1.1)){Ne.push({src:[z]});return}Ne[M].src.push(z)}function D(z){var M,V;const F=new RegExp("\\p{Ideographic}","u"),ce=/[。，！？；：“”‘’《》、【】（）…—]/,ae={box:O(z.map(ye=>ye.box)),text:"",mean:Ja(z.map(ye=>[ye.mean,ye.text.length])),style:z[0].style};for(const ye of z){const Ce=ae.text.at(-1);Ce&&(!Ce.match(F)&&!Ce.match(ce)||!((M=ye.text.at(0))!=null&&M.match(F))&&!((V=ye.text.at(0))!=null&&V.match(ce)))&&(ae.text+=" "),ae.text+=ye.text}return ae}function U(z){z.sort((M,V)=>{const F=M.src.at(0)?c.blockSize(M.src.at(0).box):2;return h.disByV(c.blockStart(M.outerBox),c.blockStart(V.outerBox),"block")<F?h.compare(c.inlineStart(M.outerBox),c.inlineStart(V.outerBox),"inline"):h.compare(c.blockStart(M.outerBox),c.blockStart(V.outerBox),"block")})}if(t!=null&&t.columnsTip)for(const z of t.columnsTip)u.push(structuredClone(z));const H={inline:0,block:90},K=e.map(z=>{const M=z.box,V=M[1][0]-M[0][0],F=M[3][1]-M[0][1];let ce={x:0,y:0};if(V<F){const ae=f.fromPonts(h.center(M[2],M[3]),h.center(M[0],M[1]));ce={x:ae[0],y:ae[1]}}else{const ae=f.fromPonts(h.center(M[1],M[2]),h.center(M[0],M[3]));ce={x:ae[0],y:ae[1]}}return Fr(Math.atan2(ce.y,ce.x)*(180/Math.PI))}),Q=y(K),N=K.filter(z=>w(z,Q.av)),X=_(N),Y=_(N.map(z=>Math.abs(z-X))),re=N.filter(z=>Math.abs((z-X)/(Y*1.4826))<2),le=Fr(y(re).av);Ze("dir0",K,Q,N,re,le);const G=Fr(le+90),xe=w(le,0)?"x":"y",W=w(G,90)?"y":"x",q=i.find(z=>xe===k(z.inline)&&W===k(z.block))??i.at(0);q&&(n.block=q.block,n.inline=q.inline);const ie={lr:0,rl:180,tb:90,bt:270};H.inline=$([le,le-360,le-180,le+180],z=>Math.abs(z-ie[n.inline])),H.block=$([G,G-360,G-180,G+180],z=>Math.abs(z-ie[n.block])),s.inline=[Math.cos(H.inline*(Math.PI/180)),Math.sin(H.inline*(Math.PI/180))],s.block=[Math.cos(H.block*(Math.PI/180)),Math.sin(H.block*(Math.PI/180))],Ze("dir",n,H,s,le,G);const ne=[[n.inline[0],n.block[0]],[n.inline[1],n.block[0]],[n.inline[1],n.block[1]],[n.inline[0],n.block[1]]].map(([z,M])=>({lt:0,rt:1,rb:2,lb:3})[z==="l"||z==="r"?z+M:M+z]),ke=S({inline:"lr",block:"tb"},n),lt=E(ne),ft=e.map(z=>{const M=lt(z.box);return ke.b(M),{...z,box:M}});for(const z of u)z.box=lt(z.box),ke.b(z.box);a.inline=ke.p(s.inline),a.block=ke.p(s.block),Ze("相对坐标系",a);const sr=ft.sort((z,M)=>h.compare(c.blockStart(z.box),c.blockStart(M.box),"block")),dt=[];for(const z of sr){const M=d(z.box),V=(r=dt.at(-1))==null?void 0:r.line.at(-1);if(!V){dt.push({line:[{src:z,colId:M}]});continue}const F=c.center(z.box),ce=c.center(V.src.box);if(h.disByV(F,ce,"block")<.5*c.blockSize(z.box)){const ae=dt.at(-1);ae?ae.line.push({src:z,colId:M}):dt.push({line:[{src:z,colId:M}]})}else dt.push({line:[{src:z,colId:M}]})}const qe=[];for(const z of dt){if(z.line.length===1){qe.push({src:z.line[0].src,colId:z.line[0].colId});continue}const M=Ni(z.line.map(F=>c.blockSize(F.src.box)));z.line.sort((F,ce)=>h.compare(c.inlineStart(F.src.box),c.inlineStart(ce.src.box),"inline"));let V=z.line.at(0);for(const F of z.line.slice(1)){const ce=c.inlineEnd(V.src.box),ae=c.inlineStart(F.src.box);u[F.colId].type==="table"||F.colId!==V.colId||h.toInline(ae)-h.toInline(ce)>M?(qe.push({...V}),V=F):(V.src.text+=F.src.text,V.src.mean=(V.src.mean+F.src.mean)/2,V.src.box=O([V.src.box,F.src.box]))}qe.push({...V})}const Ne=[],Je=[],$e=[];for(const z of qe)if(z.colId===l)Je.push(z);else{const M=$e.find(V=>V.colId===z.colId);M?M.src.push(z.src):$e.push({src:[z.src],type:u[z.colId].type,colId:z.colId})}Je.sort((z,M)=>h.compare(c.blockStart(z.src.box),c.blockStart(M.src.box),"block"));for(const z of Je)x(z.src);const oe=[];for(const[z,M]of Ne.entries()){const V=M.src,F=O(V.map(Ce=>Ce.box)),ce=c.blockCenter(F),ae=c.inlineSize(F);if(z===0){oe.push({smallCol:[{src:V,outerBox:F,x:ce,w:ae}]});continue}const ye=oe.find(Ce=>{const Ae=Ce.smallCol.at(-1),Be=c.blockSize(V.at(0).box);return c.inlineStartDis(Ae.outerBox,F)<3*Be&&c.inlineEndDis(Ae.outerBox,F)<3*Be&&c.blockGap(F,Ae.outerBox)<Be*2.1});ye?ye.smallCol.push({src:V,outerBox:F,x:ce,w:ae}):oe.push({smallCol:[{src:V,outerBox:F,x:ce,w:ae}]})}for(const z of oe)z.smallCol.sort((M,V)=>h.compare(c.blockStart(M.outerBox),c.blockStart(V.outerBox),"block"));for(const z of $e)z.src.sort((M,V)=>h.compare(c.blockStart(M.box),c.blockStart(V.box),"block"));const We=[];for(const z of oe){const M=O(z.smallCol.map(F=>F.outerBox)),V=z.smallCol.flatMap(F=>F.src);We.push({src:V,outerBox:M,type:"none"})}U(We);const mt=[];for(const z of We){const M=mt.at(-1);if(!M){mt.push(z);continue}if(M.type!=="none"){mt.push(z);continue}const V=M.outerBox,F=c.blockSize(z.src[0].box);M.src.length===1&&c.inlineStartDis(V,z.outerBox)<3*F||z.src.length===1&&c.inlineStartDis(V,z.outerBox)<3*F||c.inlineStartDis(V,z.outerBox)<3*F&&c.inlineEndDis(V,z.outerBox)<3*F?(M.src.push(...z.src),M.outerBox=O(M.src.map(ce=>ce.box))):mt.push(z)}let St=!1;const Ve=[];for(const z of mt){const M=Ve.at(-1),V={...z,reCal:!1};if(!M){Ve.push(V);continue}const F=c.blockSize(V.src.at(0).box);h.compare(c.blockEnd(V.outerBox),c.blockEnd(M.outerBox),"block")<0&&(c.inlineStartDis(M.outerBox,V.outerBox)<3*F||c.inlineEndDis(M.outerBox,V.outerBox)<3*F)?(M.src.push(...V.src),M.reCal=!0,St=!0):Ve.push(V)}for(const z of Ve)z.reCal&&(z.src.sort((M,V)=>h.compare(c.blockStart(M.box),c.blockStart(V.box),"block")),z.outerBox=O(z.src.map(M=>M.box)));$e.length&&(St=!0);for(const z of $e){const M=O(z.src.map(F=>F.box)),V=z.src;Ve.push({src:V,outerBox:M,type:z.type,reCal:!1})}St&&U(Ve);const Pt=S(n,{inline:"lr",block:"tb"}),Dr=Ve.map(z=>{const M=z.src,V=[];if(z.type==="auto"||z.type==="none"){const ae={};for(let Se=1;Se<M.length;Se++){const Fe=M[Se-1].box,gt=M[Se].box,yt=h.disByV(c.center(gt),c.center(Fe),"block");ae[yt]||(ae[yt]=0),ae[yt]++}const ye=Ni(M.map(Se=>c.blockSize(Se.box))),Ce=[[]];for(const Se of Object.keys(ae).map(Fe=>Number(Fe)).sort()){const Fe=Ce.at(-1),gt=Fe.at(-1);gt!==void 0?Math.abs(gt-Se)<ye*.5?Fe.push(Se):Ce.push([]):Fe.push(Se)}const Ae=Ce.map(Se=>Ni(Se)).sort((Se,Fe)=>Se-Fe).at(0)||0;Ze("d",ae,Ce,Ae),V.push([M[0]]);let Be=M[0];for(let Se=1;Se<M.length;Se++){const Fe=f.add(f.add(c.inlineStartCenter(Be.box),f.numMup(a.block,Ae)),f.numMup(a.inline,-c.inlineStartDis(Be.box,z.outerBox))),gt=c.inlineStartCenter(M[Se].box),yt=c.blockSize(M[Se].box);if(c.inlineEndDis(Be.box,z.outerBox)>2*yt||A(Fe,gt)>yt*.5)V.push([M[Se]]);else{const yi=V.at(-1);yi?yi.push(M[Se]):V.push([M[Se]])}Be=M[Se]}}else(z.type==="table"||z.type==="raw"||z.type==="raw-blank")&&V.push(M);for(const ae of M)Pt.b(ae.box);Pt.b(z.outerBox);const F=[];for(const[ae,ye]of ne.entries())F[ye]=ae;const ce=E(F);for(const ae of M)ae.box=ce(ae.box);return z.outerBox=ce(z.outerBox),Ze(V),{src:M,outerBox:z.outerBox,parragraphs:V.map(ae=>({src:ae,parse:D(ae)}))}}),It=Dr.flatMap(z=>z.parragraphs.map(M=>M.parse));let Tt=0;return n.inline==="lr"&&(Tt=H.inline),n.inline==="rl"&&(Tt=H.inline-180),n.block==="lr"&&(Tt=H.block),n.block==="rl"&&(Tt=H.block-180),Ze("angle",Tt),{columns:Dr,parragraphs:It,readingDir:n,angle:{reading:H,angle:Tt}}}function Ni(e){return e.reduce((t,r)=>t+r,0)/e.length}function Ja(e){const t=e.map(i=>i[1]).reduce((i,n)=>i+n,0);let r=0;for(const i of e)r+=i[0]*i[1]/t;return r}function Fr(e){return(e%360+360)%360}function es(e,t){const r=Fr(t);if(r===0)return e;if(![90,180,270].includes(r))throw new Error("只支持90度的旋转");const i=new Uint8ClampedArray(e.height*e.width*4);for(let a=0;a<e.height;a++)for(let u=0;u<e.width;u++){const l=a*e.width+u,d=r===90?u*e.height+(e.height-a-1):r===180?e.width-u-1+(e.height-a-1)*e.width:(e.width-u-1)*e.height+a;i.set(e.data.slice(l*4,l*4+4),d*4)}const n=r===90||r===270?e.height:e.width,s=r===90||r===270?e.width:e.height;return Vr(i,n,s)}function Hm(e,t="",r,i,n){if(!ct)return;const s=document.querySelector(`#${i}`).getContext("2d");s.beginPath(),s.strokeStyle=r,s.moveTo(e[0][0],e[0][1]),s.lineTo(e[1][0],e[1][1]),s.lineTo(e[2][0],e[2][1]),s.lineTo(e[3][0],e[3][1]),s.lineTo(e[0][0],e[0][1]),s.stroke(),s.strokeStyle="black",s.strokeText(t,e[0][0],e[0][1])}/*!
 * ONNX Runtime Web v1.24.3
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Ri=Object.defineProperty,Fm=Object.getOwnPropertyDescriptor,jm=Object.getOwnPropertyNames,Km=Object.prototype.hasOwnProperty,Qm=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),L=(e,t)=>()=>(e&&(t=e(e=0)),t),dr=(e,t)=>{for(var r in t)Ri(e,r,{get:t[r],enumerable:!0})},Zm=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of jm(t))!Km.call(e,n)&&n!==r&&Ri(e,n,{get:()=>t[n],enumerable:!(i=Fm(t,n))||i.enumerable});return e},_r=e=>Zm(Ri({},"__esModule",{value:!0}),e),br,At,Ft,ts,rs,is=L(()=>{br=new Map,At=[],Ft=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=br.get(e);if(i===void 0)br.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=At.indexOf(e);n!==-1&&At.splice(n,1);for(let s=0;s<At.length;s++)if(br.get(At[s]).priority<=r){At.splice(s,0,e);return}At.push(e)}return}throw new TypeError("not a valid backend")},ts=async e=>{let t=br.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},rs=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?At:r,n,s=[],a=new Set;for(let l of i){let d=await ts(l);typeof d=="string"?s.push({name:l,err:d}):(n||(n=d),n===d&&a.add(l))}if(!n)throw new Error(`no available backend found. ERR: ${s.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:d}of s)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${d}`);let u=t.filter(l=>a.has(typeof l=="string"?l:l.name));return[n,new Proxy(e,{get:(l,d)=>d==="executionProviders"?u:Reflect.get(l,d)})]}}),Ym=L(()=>{is()}),ns,Xm=L(()=>{ns="1.24.3"}),Di,Pe,as=L(()=>{Xm(),Di="warning",Pe={wasm:{},webgl:{},webgpu:{},versions:{common:ns},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Di=e}},get logLevel(){return Di}},Object.defineProperty(Pe,"logLevel",{enumerable:!0})}),Ee,Jm=L(()=>{as(),Ee=Pe}),ss,os,eg=L(()=>{ss=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],s=e.dims[3]):(n=e.dims[3],s=e.dims[2]);let a=(t==null?void 0:t.format)!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,l,d;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?d=[0,0,0,0]:typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(d[3]=u.bias[3]));let h=s*n,c=0,f=h,y=h*2,w=-1;a==="RGBA"?(c=0,f=h,y=h*2,w=h*3):a==="RGB"?(c=0,f=h,y=h*2):a==="RBG"&&(c=0,y=h,f=h*2);for(let _=0;_<s;_++)for(let k=0;k<n;k++){let $=(e.data[c++]-d[0])*l[0],b=(e.data[f++]-d[1])*l[1],I=(e.data[y++]-d[2])*l[2],S=w===-1?255:(e.data[w++]-d[3])*l[3];i.fillStyle="rgba("+$+","+b+","+I+","+S+")",i.fillRect(k,_,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},os=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,s,a;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],s=e.dims[1],a=e.dims[3]):(n=e.dims[3],s=e.dims[2],a=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t==null?void 0:t.norm,d,h;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?h=[0,0,0,0]:typeof l.bias=="number"?h=[l.bias,l.bias,l.bias,l.bias]:(h=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(h[3]=l.bias[3]));let c=s*n;if(t!==void 0&&(t.format!==void 0&&a===4&&t.format!=="RGBA"||a===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let f=4,y=0,w=1,_=2,k=3,$=0,b=c,I=c*2,S=-1;u==="RGBA"?($=0,b=c,I=c*2,S=c*3):u==="RGB"?($=0,b=c,I=c*2):u==="RBG"&&($=0,I=c,b=c*2),i=r.createImageData(n,s);for(let E=0;E<s*n;y+=f,w+=f,_+=f,k+=f,E++)i.data[y]=(e.data[$++]-h[0])*d[0],i.data[w]=(e.data[b++]-h[1])*d[1],i.data[_]=(e.data[I++]-h[2])*d[2],i.data[k]=S===-1?255:(e.data[S++]-h[3])*d[3]}else throw new Error("Can not access image data");return i}}),jr,us,ls,ds,ps,cs,tg=L(()=>{Ui(),jr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},s,a;typeof n.mean=="number"?s=[n.mean,n.mean,n.mean,n.mean]:s=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?a=[n.bias,n.bias,n.bias,n.bias]:a=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*i,h=l==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),c=4,f=0,y=1,w=2,_=3,k=0,$=d,b=d*2,I=-1;u==="RGB"&&(c=3,f=0,y=1,w=2,_=-1),l==="RGBA"?I=d*3:l==="RBG"?(k=0,b=d,$=d*2):l==="BGR"&&(b=0,$=d,k=d*2);for(let S=0;S<d;S++,f+=c,w+=c,y+=c,_+=c)h[k++]=(e[f]+a[0])/s[0],h[$++]=(e[y]+a[1])/s[1],h[b++]=(e[w]+a[2])/s[2],I!==-1&&_!==-1&&(h[I++]=(e[_]+a[3])/s[3]);return l==="RGBA"?new je("float32",h,[1,4,r,i]):new je("float32",h,[1,3,r,i])},us=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,s=typeof e=="string",a,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=h=>typeof HTMLCanvasElement<"u"&&h instanceof HTMLCanvasElement||h instanceof OffscreenCanvas?h.getContext("2d"):null;if(r){let h=l();h.width=e.width,h.height=e.height;let c=d(h);if(c!=null){let f=e.height,y=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(f=t.resizedHeight,y=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=f,u.width=y}else u.tensorFormat="RGBA",u.height=f,u.width=y;c.drawImage(e,0,0),a=c.getImageData(0,0,y,f).data}else throw new Error("Can not access image data")}else if(i){let h,c;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(h=t.resizedHeight,c=t.resizedWidth):(h=e.height,c=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=h,u.width=c,t!==void 0){let f=l();f.width=c,f.height=h;let y=d(f);if(y!=null)y.putImageData(e,0,0),a=y.getImageData(0,0,c,h).data;else throw new Error("Can not access image data")}else a=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let h=l();h.width=e.width,h.height=e.height;let c=d(h);if(c!=null){let f=e.height,y=e.width;return c.drawImage(e,0,0,y,f),a=c.getImageData(0,0,y,f).data,u.height=f,u.width=y,jr(a,u)}else throw new Error("Can not access image data")}else{if(s)return new Promise((h,c)=>{let f=l(),y=d(f);if(!e||!y)return c();let w=new Image;w.crossOrigin="Anonymous",w.src=e,w.onload=()=>{f.width=w.width,f.height=w.height,y.drawImage(w,0,0,f.width,f.height);let _=y.getImageData(0,0,f.width,f.height);u.height=f.height,u.width=f.width,h(jr(_.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(a!==void 0)return jr(a,u);throw new Error("Input data provided is not supported - aborted tensor creation")},ls=(e,t)=>{let{width:r,height:i,download:n,dispose:s}=t,a=[1,i,r,4];return new je({location:"texture",type:"float32",texture:e,dims:a,download:n,dispose:s})},ds=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:s}=t;return new je({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:s})},ps=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:s}=t;return new je({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:s})},cs=(e,t,r)=>new je({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),jt,$r,Pi,hs,rg=L(()=>{jt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),$r=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Pi=!1,hs=()=>{if(!Pi){Pi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(jt.set("int64",BigInt64Array),$r.set(BigInt64Array,"int64")),t&&(jt.set("uint64",BigUint64Array),$r.set(BigUint64Array,"uint64")),i?(jt.set("float16",r),$r.set(r,"float16")):jt.set("float16",Uint16Array)}}}),fs,ms,ig=L(()=>{Ui(),fs=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},ms=(e,t)=>{switch(e.location){case"cpu":return new je(e.type,e.data,t);case"cpu-pinned":return new je({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new je({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new je({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new je({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),je,Ui=L(()=>{eg(),tg(),rg(),ig(),je=class{constructor(e,t,r){hs();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let a=jt.get(i);if(!a)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof a))throw new TypeError(`buffer should be of type ${a.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let a,u;if(typeof e=="string")if(i=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");a=t}else{let l=jt.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?a=l.from(t,BigInt):a=l.from(t)}else if(t instanceof l)a=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")a=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)a=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",a=e;else if(l==="boolean")i="bool",a=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",a=Uint8Array.from(e);else{let l=$r.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,a=e}if(u===void 0)u=[a.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");n=u,this.cpuData=a,this.dataLocation="cpu"}let s=fs(n);if(this.cpuData&&s!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(s/2)===this.cpuData.length))throw new Error(`Tensor's size(${s}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=s}static async fromImage(e,t){return us(e,t)}static fromTexture(e,t){return ls(e,t)}static fromGpuBuffer(e,t){return ds(e,t)}static fromMLTensor(e,t){return ps(e,t)}static fromPinnedBuffer(e,t,r){return cs(e,t,r)}toDataURL(e){return ss(this,e)}toImageData(e){return os(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return ms(this,e)}}}),tt,gs=L(()=>{Ui(),tt=je}),vr,qi,rt,Ye,Ot,Mt,ys=L(()=>{as(),vr=(e,t)=>{(typeof Pe.trace>"u"?!Pe.wasm.trace:!Pe.trace)||console.timeStamp(`${e}::ORT::${t}`)},qi=(e,t)=>{var n;let r=((n=new Error().stack)==null?void 0:n.split(/\r\n|\r|\n/g))||[],i=!1;for(let s=0;s<r.length;s++){if(i&&!r[s].includes("TRACE_FUNC")){let a=`FUNC_${e}::${r[s].trim().split(" ")[1]}`;t&&(a+=`::${t}`),vr("CPU",a);return}r[s].includes("TRACE_FUNC")&&(i=!0)}},rt=e=>{(typeof Pe.trace>"u"?!Pe.wasm.trace:!Pe.trace)||qi("BEGIN",e)},Ye=e=>{(typeof Pe.trace>"u"?!Pe.wasm.trace:!Pe.trace)||qi("END",e)},Ot=e=>{(typeof Pe.trace>"u"?!Pe.wasm.trace:!Pe.trace)||console.time(`ORT::${e}`)},Mt=e=>{(typeof Pe.trace>"u"?!Pe.wasm.trace:!Pe.trace)||console.timeEnd(`ORT::${e}`)}}),ws,ng=L(()=>{is(),gs(),ys(),ws=class om{constructor(t){this.handler=t}async run(t,r,i){rt(),Ot("InferenceSession.run");let n={},s={};if(typeof t!="object"||t===null||t instanceof tt||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let a=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof tt)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");a=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);n[d]=null}if(typeof i=="object"&&i!==null)s=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,h=Object.getOwnPropertyNames(r);for(let c of this.outputNames)if(h.indexOf(c)!==-1){let f=r[c];(f===null||f instanceof tt)&&(d=!0,a=!1,n[c]=f)}if(d){if(typeof i=="object"&&i!==null)s=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else s=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(a)for(let d of this.outputNames)n[d]=null;let u=await this.handler.run(t,n,s),l={};for(let d in u)if(Object.hasOwnProperty.call(u,d)){let h=u[d];h instanceof tt?l[d]=h:l[d]=new tt(h.type,h.data,h.dims)}return Mt("InferenceSession.run"),Ye(),l}async release(){return this.handler.dispose()}static async create(t,r,i,n){rt(),Ot("InferenceSession.create");let s,a={};if(typeof t=="string"){if(s=t,typeof r=="object"&&r!==null)a=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(s=t,typeof r=="object"&&r!==null)a=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let h=t,c=0,f=t.byteLength;if(typeof r=="object"&&r!==null)a=r;else if(typeof r=="number"){if(c=r,!Number.isSafeInteger(c))throw new RangeError("'byteOffset' must be an integer.");if(c<0||c>=h.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${h.byteLength}).`);if(f=t.byteLength-c,typeof i=="number"){if(f=i,!Number.isSafeInteger(f))throw new RangeError("'byteLength' must be an integer.");if(f<=0||c+f>h.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${h.byteLength-c}].`);if(typeof n=="object"&&n!==null)a=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");s=new Uint8Array(h,c,f)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await rs(a),d=await u.createInferenceSessionHandler(s,l);return Mt("InferenceSession.create"),Ye(),new om(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Wi,ag=L(()=>{ng(),Wi=ws}),sg=L(()=>{}),og=L(()=>{}),ug=L(()=>{}),lg=L(()=>{}),_s={};dr(_s,{InferenceSession:()=>Wi,TRACE:()=>vr,TRACE_EVENT_BEGIN:()=>Ot,TRACE_EVENT_END:()=>Mt,TRACE_FUNC_BEGIN:()=>rt,TRACE_FUNC_END:()=>Ye,Tensor:()=>tt,env:()=>Ee,registerBackend:()=>Ft});var Xe=L(()=>{Ym(),Jm(),ag(),gs(),sg(),og(),ys(),ug(),lg()}),Li=L(()=>{}),bs={};dr(bs,{default:()=>$s});var Vi,Gi,$s,dg=L(()=>{var e;rh(),Kt(),Zi(),Vi="ort-wasm-proxy-worker",Gi=((e=globalThis.self)==null?void 0:e.name)===Vi,Gi&&(self.onmessage=t=>{let{type:r,in:i}=t.data;try{switch(r){case"init-wasm":Ji(i.wasm).then(()=>{pa(i).then(()=>{postMessage({type:r})},n=>{postMessage({type:r,err:n})})},n=>{postMessage({type:r,err:n})});break;case"init-ep":{let{epName:n,env:s}=i;ca(s,n).then(()=>{postMessage({type:r})},a=>{postMessage({type:r,err:a})});break}case"copy-from":{let{buffer:n}=i,s=ci(n);postMessage({type:r,out:s});break}case"create":{let{model:n,options:s}=i;fa(n,s).then(a=>{postMessage({type:r,out:a})},a=>{postMessage({type:r,err:a})});break}case"release":ma(i),postMessage({type:r});break;case"run":{let{sessionId:n,inputIndices:s,inputs:a,outputIndices:u,options:l}=i;ya(n,s,a,u,new Array(u.length).fill(null),l).then(d=>{d.some(h=>h[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:d},_a([...a,...d]))},d=>{postMessage({type:r,err:d})});break}case"end-profiling":wa(i),postMessage({type:r});break;default:}}catch(n){postMessage({type:r,err:n})}}),$s=Gi?null:t=>new Worker(t??Ke,{type:"module",name:Vi})}),vs={};dr(vs,{default:()=>ks});async function xs(e={}){var nm,am;var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,n=i&&((nm=self.name)==null?void 0:nm.startsWith("em-pthread"));t.mountExternalData=(o,p)=>{o.startsWith("./")&&(o=o.substring(2)),(t.Zc||(t.Zc=new Map)).set(o,p)},t.unmountExternalData=()=>{delete t.Zc},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,ae:!0}).buffer.constructor;let s=o=>async(...p)=>{var g;try{if(t.$c)throw Error("Session already started");let m=t.$c={Nd:p[0],errors:[]},v=await o(...p);if(t.$c!==m)throw Error("Session mismatch");(g=t.gd)==null||g.flush();let T=m.errors;if(0<T.length){let C=await Promise.all(T);if(C=C.filter(R=>R),0<C.length)throw Error(C.join(`
`))}return v}finally{t.$c=null}};t.jsepInit=(o,p)=>{if(o==="webgpu"){[t.gd,t.Dd,t.Hd,t.jd,t.Gd,t.ac,t.Id,t.Kd,t.Ed,t.Fd,t.Jd]=p;let g=t.gd;t.jsepRegisterBuffer=(m,v,T,C)=>g.registerBuffer(m,v,T,C),t.jsepGetBuffer=m=>g.getBuffer(m),t.jsepCreateDownloader=(m,v,T)=>g.createDownloader(m,v,T),t.jsepOnCreateSession=m=>{g.onCreateSession(m)},t.jsepOnReleaseSession=m=>{g.onReleaseSession(m)},t.jsepOnRunStart=m=>g.onRunStart(m),t.Ld=(m,v)=>{g.upload(m,v)}}else if(o==="webnn"){let g=p[0];[t.Zd,t.vd,t.webnnEnsureTensor,t.xd,t.webnnDownloadTensor,t.Yd,t.webnnEnableTraceEvent]=p.slice(1),t.webnnReleaseTensorId=t.vd,t.webnnUploadTensor=t.xd,t.webnnRegisterMLContext=t.Yd,t.webnnOnRunStart=m=>g.onRunStart(m),t.webnnOnRunEnd=g.onRunEnd.bind(g),t.webnnOnReleaseSession=m=>{g.onReleaseSession(m)},t.webnnCreateMLTensorDownloader=(m,v)=>g.createMLTensorDownloader(m,v),t.webnnRegisterMLTensor=(m,v,T,C)=>g.registerMLTensor(m,v,T,C),t.webnnCreateMLContext=m=>g.createMLContext(m),t.webnnRegisterMLConstant=(m,v,T,C,R,j)=>g.registerMLConstant(m,v,T,C,R,t.Zc,j),t.webnnRegisterGraphInput=g.registerGraphInput.bind(g),t.webnnIsGraphInput=g.isGraphInput.bind(g),t.webnnRegisterGraphOutput=g.registerGraphOutput.bind(g),t.webnnIsGraphOutput=g.isGraphOutput.bind(g),t.webnnCreateTemporaryTensor=g.createTemporaryTensor.bind(g),t.webnnIsGraphInputOutputTypeSupported=g.isGraphInputOutputTypeSupported.bind(g)}};let a=()=>{let o=p=>(...g)=>{let m=_t;return g=p(...g),_t!=m?new Promise((v,T)=>{Ma={resolve:v,reject:T}}):g};(()=>{for(let p of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[p]=o(t[p])})(),s!==void 0&&(t._OrtRun=s(t._OrtRun),t._OrtRunWithBinding=s(t._OrtRunWithBinding)),a=void 0};t.asyncInit=()=>{a==null||a()};var u,l,d=(o,p)=>{throw p},h=self.location.href,c="";if(r||i){try{c=new URL(".",h).href}catch{}i&&(l=o=>{var p=new XMLHttpRequest;return p.open("GET",o,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),u=async o=>{if(O(o))return new Promise((g,m)=>{var v=new XMLHttpRequest;v.open("GET",o,!0),v.responseType="arraybuffer",v.onload=()=>{v.status==200||v.status==0&&v.response?g(v.response):m(v.status)},v.onerror=m,v.send(null)});var p=await fetch(o,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)}}var f,y,w,_,k,$,b=console.log.bind(console),I=console.error.bind(console),S=b,E=I,A=!1,O=o=>o.startsWith("file://");function x(){F.buffer!=U.buffer&&q()}if(n){let o=function(p){try{var g=p.data,m=g.Uc;if(m==="load"){let v=[];self.onmessage=T=>v.push(T),$=()=>{postMessage({Uc:"loaded"});for(let T of v)o(T);self.onmessage=o};for(let T of g.Ad)t[T]&&!t[T].proxy||(t[T]=(...C)=>{postMessage({Uc:"callHandler",zd:T,args:C})},T=="print"&&(S=t[T]),T=="printErr"&&(E=t[T]));F=g.Vd,q(),y=g.Wd,lt(),Ti()}else if(m==="run"){(function(v){var T=(x(),X)[v+52>>>2>>>0];v=(x(),X)[v+56>>>2>>>0],hf(T,T-v),he(T)})(g.Tc),Pa(g.Tc,0,0,1,0,0),z(),Ca(g.Tc),D||(of(),D=!0);try{ce(g.Pd,g.dd)}catch(v){if(v!="unwind")throw v}}else g.target!=="setimmediate"&&(m==="checkMailbox"?D&&bi():m&&(E(`worker: received unknown command ${m}`),E(g)))}catch(v){throw uf(),v}};var D=!1;self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=o}var U,H,K,Q,N,X,Y,re,le,G,xe,W=!1;function q(){var o=F.buffer;t.HEAP8=U=new Int8Array(o),K=new Int16Array(o),t.HEAPU8=H=new Uint8Array(o),Q=new Uint16Array(o),t.HEAP32=N=new Int32Array(o),t.HEAPU32=X=new Uint32Array(o),Y=new Float32Array(o),re=new Float64Array(o),le=new BigInt64Array(o),G=new BigUint64Array(o)}function ie(){W=!0,n?$():zt.tb()}function ne(o){throw E(o="Aborted("+o+")"),A=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),k==null||k(o),o}function ke(){return{a:{ma:My,hb:Oy,g:Ce,J:Be,f:yi,o:f0,h:m0,ha:g0,b:y0,T:w0,Ia:_h,n:_0,_:xh,Ya:kh,Ea:Sh,Ga:Ih,Za:Th,Wa:Eh,Pa:zh,Va:Ch,ka:Ah,Fa:Oh,Ca:Mh,Xa:Bh,Da:Nh,cb:b0,ea:$0,xa:v0,va:k0,da:I0,O:T0,H:E0,wa:z0,Z:R0,ya:D0,Sa:P0,Aa:q0,Ja:W0,ta:L0,fa:V0,Ra:Ca,$a:G0,R:K0,s:J0,c:Ea,ib:ey,y:ty,M:ry,D:iy,m:ny,t:Vh,jb:ay,I:sy,S:oy,j:uy,v:ly,r:dy,l:py,Ma:cy,Na:hy,Oa:fy,Ka:jh,La:Kh,ua:Qh,eb:gy,bb:wy,u:_y,aa:by,ga:$y,ab:yy,V:vy,_a:xy,Ba:ky,F:my,U:Sy,la:Si,za:Ty,gb:Iy,fb:Ey,Ta:Jh,Ua:ef,Ha:St,$:tf,ja:rf,Qa:nf,ia:af,lb:gw,na:lw,mb:mw,oa:uw,G:Jy,d:Dy,q:Ny,w:By,B:jy,pb:aw,K:Zy,x:Uy,pa:sw,X:dw,ba:nw,nb:fw,ob:hw,ra:ew,qa:iw,qb:tw,N:Yy,Y:ow,e:Py,A:qy,k:Ry,kb:yw,p:Ly,z:Vy,C:Wy,E:Gy,L:Ky,rb:Xy,Q:pw,ca:Qy,W:cw,sb:Fy,sa:Hy,P:rw,i:Cy,a:F,db:We}}}async function lt(){function o(m,v){var T=zt=m.exports;m={};for(let[C,R]of Object.entries(T))typeof R=="function"?(T=H0(R),m[C]=T):m[C]=R;return zt=m,zt=function(){var C=zt,R=Z=>pe=>Z(pe)>>>0,j=Z=>()=>Z()>>>0;return(C=Object.assign({},C)).ub=R(C.ub),C.Yb=j(C.Yb),C._b=R(C._b),C.mc=R(C.mc),C.nc=j(C.nc),C.rc=R(C.rc),C}(),Dr.push(zt.$b),sf=(m=zt).ub,of=m.vb,t._OrtInit=m.wb,t._OrtGetLastError=m.xb,t._OrtCreateSessionOptions=m.yb,t._OrtAppendExecutionProvider=m.zb,t._OrtAddFreeDimensionOverride=m.Ab,t._OrtAddSessionConfigEntry=m.Bb,t._OrtReleaseSessionOptions=m.Cb,t._OrtCreateSession=m.Db,t._OrtReleaseSession=m.Eb,t._OrtGetInputOutputCount=m.Fb,t._OrtGetInputOutputMetadata=m.Gb,t._OrtFree=m.Hb,t._OrtCreateTensor=m.Ib,t._OrtGetTensorData=m.Jb,t._OrtReleaseTensor=m.Kb,t._OrtCreateRunOptions=m.Lb,t._OrtAddRunConfigEntry=m.Mb,t._OrtReleaseRunOptions=m.Nb,t._OrtCreateBinding=m.Ob,t._OrtBindInput=m.Pb,t._OrtBindOutput=m.Qb,t._OrtClearBoundOutputs=m.Rb,t._OrtReleaseBinding=m.Sb,t._OrtRunWithBinding=m.Tb,t._OrtRun=m.Ub,t._OrtEndProfiling=m.Vb,t._JsepOutput=m.Wb,t._JsepGetNodeName=m.Xb,Ii=m.Yb,bt=t._free=m.Zb,Ur=t._malloc=m._b,Pa=m.bc,uf=m.cc,lf=m.dc,df=m.ec,Ua=m.fc,pf=m.gc,cf=m.hc,me=m.ic,qr=m.jc,hf=m.kc,he=m.lc,qa=m.mc,fe=m.nc,ff=m.oc,Wa=m.pc,mf=m.qc,gf=m.rc,yf=m.sc,La=m.tc,wf=m.uc,_f=m.vc,bf=m.wc,$f=m.xc,vf=m.yc,xf=m.zc,kf=m.Ac,Sf=m.Bc,If=m.Cc,Tf=m.Dc,Ef=m.Ec,zf=m.Fc,Cf=m.Gc,Af=m.Hc,Of=m.Ic,Mf=m.Jc,Bf=m.Kc,Nf=m.Lc,Rf=m.Mc,Df=m.Nc,Pf=m.Oc,Uf=m.Pc,qf=m.Rc,Wf=m.Sc,Lf=m.bd,Vf=m.cd,Gf=m.hd,Hf=m.kd,Ff=m.ld,jf=m.md,Kf=m.nd,Qf=m.od,Zf=m.pd,Yf=m.qd,Xf=m.rd,Jf=m.wd,em=m.Rd,tm=m.Sd,rm=m.Td,im=m.Ud,y=v,zt}var p,g=ke();return t.instantiateWasm?new Promise(m=>{t.instantiateWasm(g,(v,T)=>{m(o(v,T))})}):n?o(new WebAssembly.Instance(y,ke()),y):(xe??(xe=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",c):c+"ort-wasm-simd-threaded.jsep.wasm":new URL("/Gemini-AI-Translator/assets/ort-wasm-simd-threaded.jsep-C887KxcQ.wasm",self.location.href).href),p=await async function(m){var v=xe;if(!f&&!O(v))try{var T=fetch(v,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(T,m)}catch(C){E(`wasm streaming compile failed: ${C}`),E("falling back to ArrayBuffer instantiation")}return async function(C,R){try{var j=await async function(Z){if(!f)try{var pe=await u(Z);return new Uint8Array(pe)}catch{}if(Z==xe&&f)Z=new Uint8Array(f);else{if(!l)throw"both async and sync fetching of the wasm failed";Z=l(Z)}return Z}(C);return await WebAssembly.instantiate(j,R)}catch(Z){E(`failed to asynchronously prepare wasm: ${Z}`),ne(Z)}}(v,m)}(g),o(p.instance,p.module))}class ft{constructor(p){sm(this,"name","ExitStatus");this.message=`Program terminated with exit(${p})`,this.status=p}}var sr=o=>{o.terminate(),o.onmessage=()=>{}},dt=[],qe=0,Ne=null,Je=o=>{Ve.length==0&&(V(),M(Ve[0]));var p=Ve.pop();if(!p)return 6;Pt.push(p),It[o.Tc]=p,p.Tc=o.Tc;var g={Uc:"run",Pd:o.Od,dd:o.dd,Tc:o.Tc};return p.postMessage(g,o.ud),0},$e=0,oe=(o,p,...g)=>{var m,v=16*g.length,T=fe(),C=qa(v),R=C>>>3;for(m of g)typeof m=="bigint"?((x(),le)[R++>>>0]=1n,(x(),le)[R++>>>0]=m):((x(),le)[R++>>>0]=0n,(x(),re)[R++>>>0]=m);return o=lf(o,0,v,C,p),he(T),o};function We(o){if(n)return oe(0,1,o);if(w=o,!(0<$e)){for(var p of Pt)sr(p);for(p of Ve)sr(p);Ve=[],Pt=[],It={},A=!0}d(0,new ft(o))}function mt(o){if(n)return oe(1,0,o);St(o)}var St=o=>{if(w=o,n)throw mt(o),"unwind";We(o)},Ve=[],Pt=[],Dr=[],It={},Tt=o=>{var p=o.Tc;delete It[p],Ve.push(o),Pt.splice(Pt.indexOf(o),1),o.Tc=0,df(p)};function z(){Dr.forEach(o=>o())}var M=o=>new Promise(p=>{o.onmessage=v=>{var T=v.data;if(v=T.Uc,T.ad&&T.ad!=Ii()){var C=It[T.ad];C?C.postMessage(T,T.ud):E(`Internal error! Worker sent a message "${v}" to target pthread ${T.ad}, but that thread no longer exists!`)}else v==="checkMailbox"?bi():v==="spawnThread"?Je(T):v==="cleanupThread"?_i(()=>{Tt(It[T.Qd])}):v==="loaded"?(o.loaded=!0,p(o)):T.target==="setimmediate"?o.postMessage(T):v==="uncaughtException"?o.onerror(T.error):v==="callHandler"?t[T.zd](...T.args):v&&E(`worker sent an unknown command ${v}`)},o.onerror=v=>{throw E(`worker sent an error! ${v.filename}:${v.lineno}: ${v.message}`),v};var g,m=[];for(g of[])t.propertyIsEnumerable(g)&&m.push(g);o.postMessage({Uc:"load",Ad:m,Vd:F,Wd:y})});function V(){var o=new Worker((()=>{let p=URL;return self.location.href>"file:"&&self.location.href<"file;"?new p("ort.bundle.min.mjs",self.location.href):new URL(self.location.href)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});Ve.push(o)}var F,ce=(o,p)=>{$e=0,o=La(o,p),0<$e?w=o:Ua(o)},ae=[],ye=0;function Ce(o){var p=new gt(o>>>=0);return(x(),U)[p.Vc+12>>>0]==0&&(Se(p,!0),ye--),Fe(p,!1),ae.push(p),gf(o)}var Ae=0,Be=()=>{me(0,0);var o=ae.pop();ff(o.ed),Ae=0};function Se(o,p){p=p?1:0,(x(),U)[o.Vc+12>>>0]=p}function Fe(o,p){p=p?1:0,(x(),U)[o.Vc+13>>>0]=p}class gt{constructor(p){this.ed=p,this.Vc=p-24}}var yt=o=>{var p=Ae;if(!p)return qr(0),0;var g=new gt(p);(x(),X)[g.Vc+16>>>2>>>0]=p;var m=(x(),X)[g.Vc+4>>>2>>>0];if(!m)return qr(0),p;for(var v of o){if(v===0||v===m)break;if(mf(v,m,g.Vc+16))return qr(v),p}return qr(m),p};function yi(){return yt([])}function f0(o){return yt([o>>>0])}function m0(o,p,g,m){return yt([o>>>0,p>>>0,g>>>0,m>>>0])}var g0=()=>{var o=ae.pop();o||ne("no exception to throw");var p=o.ed;throw(x(),U)[o.Vc+13>>>0]==0&&(ae.push(o),Fe(o,!0),Se(o,!1),ye++),Wa(p),Ae=p};function y0(o,p,g){var m=new gt(o>>>=0);throw p>>>=0,g>>>=0,(x(),X)[m.Vc+16>>>2>>>0]=0,(x(),X)[m.Vc+4>>>2>>>0]=p,(x(),X)[m.Vc+8>>>2>>>0]=g,Wa(o),ye++,Ae=o}var w0=()=>ye;function wh(o,p,g,m){return n?oe(2,1,o,p,g,m):_h(o,p,g,m)}function _h(o,p,g,m){if(o>>>=0,p>>>=0,g>>>=0,m>>>=0,!globalThis.SharedArrayBuffer)return 6;var v=[];return n&&v.length===0?wh(o,p,g,m):(o={Od:g,Tc:o,dd:m,ud:v},n?(o.Uc="spawnThread",postMessage(o,v),0):Je(o))}function _0(o){throw Ae||(Ae=o>>>0),Ae}var bh=globalThis.TextDecoder&&new TextDecoder,$h=(o,p,g,m)=>{if(g=p+g,m)return g;for(;o[p]&&!(p>=g);)++p;return p},vh=(o,p=0,g,m)=>{if(16<(g=$h(o,p>>>=0,g,m))-p&&o.buffer&&bh)return bh.decode(o.buffer instanceof ArrayBuffer?o.subarray(p,g):o.slice(p,g));for(m="";p<g;){var v=o[p++];if(128&v){var T=63&o[p++];if((224&v)==192)m+=String.fromCharCode((31&v)<<6|T);else{var C=63&o[p++];65536>(v=(240&v)==224?(15&v)<<12|T<<6|C:(7&v)<<18|T<<12|C<<6|63&o[p++])?m+=String.fromCharCode(v):(v-=65536,m+=String.fromCharCode(55296|v>>10,56320|1023&v))}}else m+=String.fromCharCode(v)}return m},Re=(o,p,g)=>(o>>>=0)?vh((x(),H),o,p,g):"";function xh(o,p,g){return n?oe(3,1,o,p,g):0}function kh(o,p){if(n)return oe(4,1,o,p)}function Sh(o,p){if(n)return oe(5,1,o,p)}function Ih(o,p,g){if(n)return oe(6,1,o,p,g)}function Th(o,p,g){return n?oe(7,1,o,p,g):0}function Eh(o,p){if(n)return oe(8,1,o,p)}function zh(o,p,g){if(n)return oe(9,1,o,p,g)}function Ch(o,p,g,m){if(n)return oe(10,1,o,p,g,m)}function Ah(o,p,g,m){if(n)return oe(11,1,o,p,g,m)}function Oh(o,p,g,m){if(n)return oe(12,1,o,p,g,m)}function Mh(o){if(n)return oe(13,1,o)}function Bh(o,p){if(n)return oe(14,1,o,p)}function Nh(o,p,g){if(n)return oe(15,1,o,p,g)}var b0=()=>ne(""),wt=o=>{o>>>=0;for(var p="";;){var g=(x(),H)[o++>>>0];if(!g)return p;p+=String.fromCharCode(g)}},Ia={},Ta={},gr=class extends Error{constructor(o){super(o),this.name="BindingError"}};function Et(o,p,g={}){return function(m,v,T={}){var C=v.name;if(!m)throw new gr(`type "${C}" must have a positive integer typeid pointer`);if(Ta.hasOwnProperty(m)){if(T.Bd)return;throw new gr(`Cannot register type '${C}' twice`)}Ta[m]=v,Ia.hasOwnProperty(m)&&(v=Ia[m],delete Ia[m],v.forEach(R=>R()))}(o,p,g)}var Rh=(o,p,g)=>{switch(p){case 1:return g?m=>(x(),U)[m>>>0]:m=>(x(),H)[m>>>0];case 2:return g?m=>(x(),K)[m>>>1>>>0]:m=>(x(),Q)[m>>>1>>>0];case 4:return g?m=>(x(),N)[m>>>2>>>0]:m=>(x(),X)[m>>>2>>>0];case 8:return g?m=>(x(),le)[m>>>3>>>0]:m=>(x(),G)[m>>>3>>>0];default:throw new TypeError(`invalid integer width (${p}): ${o}`)}};function $0(o,p,g,m,v){o>>>=0,g>>>=0,p=wt(p>>>0);let T=C=>C;if(m=m===0n){let C=8*g;T=R=>BigInt.asUintN(C,R),v=T(v)}Et(o,{name:p,Qc:T,Xc:(C,R)=>(typeof R=="number"&&(R=BigInt(R)),R),Wc:Rh(p,g,!m),Yc:null})}function v0(o,p,g,m){Et(o>>>=0,{name:p=wt(p>>>0),Qc:function(v){return!!v},Xc:function(v,T){return T?g:m},Wc:function(v){return this.Qc((x(),H)[v>>>0])},Yc:null})}var Dh=[],or=[0,1,,1,null,1,!0,1,!1,1];function Ea(o){9<(o>>>=0)&&--or[o+1]==0&&(or[o]=void 0,Dh.push(o))}var et=o=>{if(!o)throw new gr(`Cannot use deleted val. handle = ${o}`);return or[o]},pt=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=Dh.pop()||or.length;return or[p]=o,or[p+1]=1,p}};function za(o){return this.Qc((x(),X)[o>>>2>>>0])}var x0={name:"emscripten::val",Qc:o=>{var p=et(o);return Ea(o),p},Xc:(o,p)=>pt(p),Wc:za,Yc:null};function k0(o){return Et(o>>>0,x0)}var S0=(o,p)=>{switch(p){case 4:return function(g){return this.Qc((x(),Y)[g>>>2>>>0])};case 8:return function(g){return this.Qc((x(),re)[g>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${o}`)}};function I0(o,p,g){g>>>=0,Et(o>>>=0,{name:p=wt(p>>>0),Qc:m=>m,Xc:(m,v)=>v,Wc:S0(p,g),Yc:null})}function T0(o,p,g,m,v){o>>>=0,g>>>=0,p=wt(p>>>0);let T=R=>R;if(m===0){var C=32-8*g;T=R=>R<<C>>>C,v=T(v)}Et(o,{name:p,Qc:T,Xc:(R,j)=>j,Wc:Rh(p,g,m!==0),Yc:null})}function E0(o,p,g){function m(T){var C=(x(),X)[T>>>2>>>0];return T=(x(),X)[T+4>>>2>>>0],new v((x(),U).buffer,T,C)}var v=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];Et(o>>>=0,{name:g=wt(g>>>0),Qc:m,Wc:m},{Bd:!0})}var Ut=(o,p,g)=>{var m=(x(),H);if(p>>>=0,0<g){var v=p;g=p+g-1;for(var T=0;T<o.length;++T){var C=o.codePointAt(T);if(127>=C){if(p>=g)break;m[p++>>>0]=C}else if(2047>=C){if(p+1>=g)break;m[p++>>>0]=192|C>>6,m[p++>>>0]=128|63&C}else if(65535>=C){if(p+2>=g)break;m[p++>>>0]=224|C>>12,m[p++>>>0]=128|C>>6&63,m[p++>>>0]=128|63&C}else{if(p+3>=g)break;m[p++>>>0]=240|C>>18,m[p++>>>0]=128|C>>12&63,m[p++>>>0]=128|C>>6&63,m[p++>>>0]=128|63&C,T++}}m[p>>>0]=0,o=p-v}else o=0;return o},wi=o=>{for(var p=0,g=0;g<o.length;++g){var m=o.charCodeAt(g);127>=m?p++:2047>=m?p+=2:55296<=m&&57343>=m?(p+=4,++g):p+=3}return p};function z0(o,p){Et(o>>>=0,{name:p=wt(p>>>0),Qc(g){var m=(x(),X)[g>>>2>>>0];return m=Re(g+4,m,!0),bt(g),m},Xc(g,m){m instanceof ArrayBuffer&&(m=new Uint8Array(m));var v=typeof m=="string";if(!(v||ArrayBuffer.isView(m)&&m.BYTES_PER_ELEMENT==1))throw new gr("Cannot pass non-string to std::string");var T=v?wi(m):m.length,C=Ur(4+T+1),R=C+4;return(x(),X)[C>>>2>>>0]=T,v?Ut(m,R,T+1):(x(),H).set(m,R>>>0),g!==null&&g.push(bt,C),C},Wc:za,Yc(g){bt(g)}})}var Ph=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,C0=(o,p,g)=>{if(o>>>=1,16<(p=$h((x(),Q),o,p/2,g))-o&&Ph)return Ph.decode((x(),Q).slice(o,p));for(g="";o<p;++o){var m=(x(),Q)[o>>>0];g+=String.fromCharCode(m)}return g},A0=(o,p,g)=>{if(g??(g=2147483647),2>g)return 0;var m=p;g=(g-=2)<2*o.length?g/2:o.length;for(var v=0;v<g;++v){var T=o.charCodeAt(v);(x(),K)[p>>>1>>>0]=T,p+=2}return(x(),K)[p>>>1>>>0]=0,p-m},O0=o=>2*o.length,M0=(o,p,g)=>{var m="";o>>>=2;for(var v=0;!(v>=p/4);v++){var T=(x(),X)[o+v>>>0];if(!T&&!g)break;m+=String.fromCodePoint(T)}return m},B0=(o,p,g)=>{if(p>>>=0,g??(g=2147483647),4>g)return 0;var m=p;g=m+g-4;for(var v=0;v<o.length;++v){var T=o.codePointAt(v);if(65535<T&&v++,(x(),N)[p>>>2>>>0]=T,(p+=4)+4>g)break}return(x(),N)[p>>>2>>>0]=0,p-m},N0=o=>{for(var p=0,g=0;g<o.length;++g)65535<o.codePointAt(g)&&g++,p+=4;return p};function R0(o,p,g){if(o>>>=0,p>>>=0,g=wt(g>>>=0),p===2)var m=C0,v=A0,T=O0;else m=M0,v=B0,T=N0;Et(o,{name:g,Qc:C=>{var R=(x(),X)[C>>>2>>>0];return R=m(C+4,R*p,!0),bt(C),R},Xc:(C,R)=>{if(typeof R!="string")throw new gr(`Cannot pass non-string to C++ string type ${g}`);var j=T(R),Z=Ur(4+j+p);return(x(),X)[Z>>>2>>>0]=j/p,v(R,Z+4,j+p),C!==null&&C.push(bt,Z),Z},Wc:za,Yc(C){bt(C)}})}function D0(o,p){Et(o>>>=0,{Cd:!0,name:p=wt(p>>>0),Qc:()=>{},Xc:()=>{}})}function P0(o){Pa(o>>>0,!i,1,!r,131072,!1),z()}var _i=o=>{if(!A)try{if(o(),!(0<$e))try{n?Ii()&&Ua(w):St(w)}catch(p){p instanceof ft||p=="unwind"||d(0,p)}}catch(p){p instanceof ft||p=="unwind"||d(0,p)}},U0=!Atomics.waitAsync||((am=globalThis.navigator)==null?void 0:am.userAgent)&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function Ca(o){o>>>=0,U0||(Atomics.waitAsync((x(),N),o>>>2,o).value.then(bi),o+=128,Atomics.store((x(),N),o>>>2,1))}var bi=()=>_i(()=>{var o=Ii();o&&(Ca(o),cf())});function q0(o,p){(o>>>=0)==p>>>0?setTimeout(bi):n?postMessage({ad:o,Uc:"checkMailbox"}):(o=It[o])&&o.postMessage({Uc:"checkMailbox"})}var Aa=[];function W0(o,p,g,m,v){for(p>>>=0,v>>>=0,Aa.length=0,g=v>>>3,m=v+m>>>3;g<m;){var T;T=(x(),le)[g++>>>0]?(x(),le)[g++>>>0]:(x(),re)[g++>>>0],Aa.push(T)}return(p?Va[p]:Ay[o])(...Aa)}var L0=()=>{$e=0};function V0(o){o>>>=0,n?postMessage({Uc:"cleanupThread",Qd:o}):Tt(It[o])}function G0(o){}var $i=o=>{try{o()}catch(p){ne(p)}};function H0(o){var p=(...g)=>{vi.push(o);try{return o(...g)}finally{A||(vi.pop(),_t&&qt===1&&vi.length===0&&(qt=0,$e+=1,$i(tm),typeof Fibers<"u"&&Fibers.ce()))}};return Wh.set(o,p),p}var qt=0,_t=null,Uh=0,vi=[],Oa=new Map,qh=new Map,Wh=new Map,F0=0,Ma=null,j0=[],Lh=o=>function(p){if(!A){if(qt===0){var g=!1,m=!1;p((v=0)=>{if(!A&&(Uh=v,g=!0,m)){qt=2,$i(()=>rm(_t)),typeof MainLoop<"u"&&MainLoop.yd&&MainLoop.resume(),v=!1;try{var T=function(){var j=(x(),N)[_t+8>>>2>>>0];return j=qh.get(j),j=Wh.get(j),--$e,j()}()}catch(j){T=j,v=!0}var C=!1;if(!_t){var R=Ma;R&&(Ma=null,(v?R.reject:R.resolve)(T),C=!0)}if(v&&!C)throw T}}),m=!0,g||(qt=1,_t=function(){var v=Ur(65548),T=v+12;if((x(),X)[v>>>2>>>0]=T,(x(),X)[v+4>>>2>>>0]=T+65536,T=vi[0],!Oa.has(T)){var C=F0++;Oa.set(T,C),qh.set(C,T)}return T=Oa.get(T),(x(),N)[v+8>>>2>>>0]=T,v}(),typeof MainLoop<"u"&&MainLoop.yd&&MainLoop.pause(),$i(()=>em(_t)))}else qt===2?(qt=0,$i(im),bt(_t),_t=null,j0.forEach(_i)):ne(`invalid state: ${qt}`);return Uh}}(p=>{o().then(p)});function K0(o){return o>>>=0,Lh(async()=>{var p=await et(o);return pt(p)})}var Ba=[],Q0=o=>{var p=Ba.length;return Ba.push(o),p},Z0=(o,p)=>{for(var g=Array(o),m=0;m<o;++m){var v=m,T=(x(),X)[p+4*m>>>2>>>0],C=Ta[T];if(C===void 0)throw o=`parameter ${m}`,T=sf(T),p=wt(T),bt(T),new gr(`${o} has unknown type ${p}`);g[v]=C}return g},Y0=(o,p,g)=>{var m=[];return o=o(m,g),m.length&&((x(),X)[p>>>2>>>0]=pt(m)),o},X0={},xi=o=>{var p=X0[o];return p===void 0?wt(o):p};function J0(o,p,g){var[m,...v]=Z0(o,p>>>0);p=m.Xc.bind(m);var T=v.map(j=>j.Wc.bind(j));o--;var C={toValue:et};switch(o=T.map((j,Z)=>{var pe=`argFromPtr${Z}`;return C[pe]=j,`${pe}(args${Z?"+"+8*Z:""})`}),g){case 0:var R="toValue(handle)";break;case 2:R="new (toValue(handle))";break;case 3:R="";break;case 1:C.getStringOrSymbol=xi,R="toValue(handle)[getStringOrSymbol(methodName)]"}return R+=`(${o})`,m.Cd||(C.toReturnWire=p,C.emval_returnValue=Y0,R=`return emval_returnValue(toReturnWire, destructorsRef, ${R})`),R=`return function (handle, methodName, destructorsRef, args) {
  ${R}
  }`,g=new Function(Object.keys(C),R)(...Object.values(C)),R=`methodCaller<(${v.map(j=>j.name)}) => ${m.name}>`,Q0(Object.defineProperty(g,"name",{value:R}))}function ey(o,p){return p>>>=0,(o=et(o>>>0))==et(p)}function ty(o){return(o>>>=0)?(o=xi(o),pt(globalThis[o])):pt(globalThis)}function ry(o){return o=xi(o>>>0),pt(t[o])}function iy(o,p){return p>>>=0,o=et(o>>>0),p=et(p),pt(o[p])}function ny(o){9<(o>>>=0)&&(or[o+1]+=1)}function Vh(o,p,g,m,v){return Ba[o>>>0](p>>>0,g>>>0,m>>>0,v>>>0)}function ay(o,p,g,m,v){return Vh(o>>>0,p>>>0,g>>>0,m>>>0,v>>>0)}function sy(){return pt([])}function oy(o){o=et(o>>>0);for(var p=Array(o.length),g=0;g<o.length;g++)p[g]=o[g];return pt(p)}function uy(o){return pt(xi(o>>>0))}function ly(){return pt({})}function dy(o){for(var p=et(o>>>=0);p.length;){var g=p.pop();p.pop()(g)}Ea(o)}function py(o,p,g){p>>>=0,g>>>=0,o=et(o>>>0),p=et(p),g=et(g),o[p]=g}function cy(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),(x(),N)[p>>>2>>>0]=o.getUTCSeconds(),(x(),N)[p+4>>>2>>>0]=o.getUTCMinutes(),(x(),N)[p+8>>>2>>>0]=o.getUTCHours(),(x(),N)[p+12>>>2>>>0]=o.getUTCDate(),(x(),N)[p+16>>>2>>>0]=o.getUTCMonth(),(x(),N)[p+20>>>2>>>0]=o.getUTCFullYear()-1900,(x(),N)[p+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(x(),N)[p+28>>>2>>>0]=o}var Gh=o=>o%4==0&&(o%100!=0||o%400==0),Hh=[0,31,60,91,121,152,182,213,244,274,305,335],Fh=[0,31,59,90,120,151,181,212,243,273,304,334];function hy(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),(x(),N)[p>>>2>>>0]=o.getSeconds(),(x(),N)[p+4>>>2>>>0]=o.getMinutes(),(x(),N)[p+8>>>2>>>0]=o.getHours(),(x(),N)[p+12>>>2>>>0]=o.getDate(),(x(),N)[p+16>>>2>>>0]=o.getMonth(),(x(),N)[p+20>>>2>>>0]=o.getFullYear()-1900,(x(),N)[p+24>>>2>>>0]=o.getDay();var g=(Gh(o.getFullYear())?Hh:Fh)[o.getMonth()]+o.getDate()-1|0;(x(),N)[p+28>>>2>>>0]=g,(x(),N)[p+36>>>2>>>0]=-60*o.getTimezoneOffset(),g=new Date(o.getFullYear(),6,1).getTimezoneOffset();var m=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(g!=m&&o.getTimezoneOffset()==Math.min(m,g)),(x(),N)[p+32>>>2>>>0]=o}function fy(o){o>>>=0;var p=new Date((x(),N)[o+20>>>2>>>0]+1900,(x(),N)[o+16>>>2>>>0],(x(),N)[o+12>>>2>>>0],(x(),N)[o+8>>>2>>>0],(x(),N)[o+4>>>2>>>0],(x(),N)[o>>>2>>>0],0),g=(x(),N)[o+32>>>2>>>0],m=p.getTimezoneOffset(),v=new Date(p.getFullYear(),6,1).getTimezoneOffset(),T=new Date(p.getFullYear(),0,1).getTimezoneOffset(),C=Math.min(T,v);return 0>g?(x(),N)[o+32>>>2>>>0]=+(v!=T&&C==m):0<g!=(C==m)&&(v=Math.max(T,v),p.setTime(p.getTime()+6e4*((0<g?C:v)-m))),(x(),N)[o+24>>>2>>>0]=p.getDay(),g=(Gh(p.getFullYear())?Hh:Fh)[p.getMonth()]+p.getDate()-1|0,(x(),N)[o+28>>>2>>>0]=g,(x(),N)[o>>>2>>>0]=p.getSeconds(),(x(),N)[o+4>>>2>>>0]=p.getMinutes(),(x(),N)[o+8>>>2>>>0]=p.getHours(),(x(),N)[o+12>>>2>>>0]=p.getDate(),(x(),N)[o+16>>>2>>>0]=p.getMonth(),(x(),N)[o+20>>>2>>>0]=p.getYear(),o=p.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function jh(o,p,g,m,v,T,C){return n?oe(16,1,o,p,g,m,v,T,C):-52}function Kh(o,p,g,m,v,T){if(n)return oe(17,1,o,p,g,m,v,T)}var Pr={},my=()=>performance.timeOrigin+performance.now();function Qh(o,p){if(n)return oe(18,1,o,p);if(Pr[o]&&(clearTimeout(Pr[o].id),delete Pr[o]),!p)return 0;var g=setTimeout(()=>{delete Pr[o],_i(()=>pf(o,performance.timeOrigin+performance.now()))},p);return Pr[o]={id:g,be:p},0}function gy(o,p,g,m){o>>>=0,p>>>=0,g>>>=0,m>>>=0;var v=new Date().getFullYear(),T=new Date(v,0,1).getTimezoneOffset();v=new Date(v,6,1).getTimezoneOffset();var C=Math.max(T,v);(x(),X)[o>>>2>>>0]=60*C,(x(),N)[p>>>2>>>0]=+(T!=v),o=(p=R=>{var j=Math.abs(R);return`UTC${0<=R?"-":"+"}${String(Math.floor(j/60)).padStart(2,"0")}${String(j%60).padStart(2,"0")}`})(T),p=p(v),v<T?(Ut(o,g,17),Ut(p,m,17)):(Ut(o,m,17),Ut(p,g,17))}var yy=()=>Date.now();function wy(o,p,g){return g>>>=0,0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),o=Math.round(1e6*o),(x(),le)[g>>>3>>>0]=BigInt(o),0):28}var Na=[],Zh=(o,p)=>{Na.length=0;for(var g;g=(x(),H)[o++>>>0];){var m=g!=105;p+=(m&=g!=112)&&p%8?4:0,Na.push(g==112?(x(),X)[p>>>2>>>0]:g==106?(x(),le)[p>>>3>>>0]:g==105?(x(),N)[p>>>2>>>0]:(x(),re)[p>>>3>>>0]),p+=m?8:4}return Na};function _y(o,p,g){return o>>>=0,p=Zh(p>>>0,g>>>0),Va[o](...p)}function by(o,p,g){return o>>>=0,p=Zh(p>>>0,g>>>0),Va[o](...p)}var $y=()=>{};function vy(o,p){return E(Re(o>>>0,p>>>0))}var xy=()=>{throw $e+=1,"unwind"};function ky(){return 4294901760}var Sy=()=>navigator.hardwareConcurrency,ur={},ki=o=>{var p;return(p=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(o))?+p[1]:(p=/:(\d+):\d+(?:\)|$)/.exec(o))?2147483648|+p[1]:0},Yh=o=>{for(var p of o)(o=ki(p))&&(ur[o]=p)};function Iy(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),Yh(o),ur.sd=ki(o[3]),ur.Md=o,ur.sd}function Si(o){if(!(o=ur[o>>>0]))return 0;var p;if(p=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(o))o=p[1];else if(p=/^\s+at (.*) \(.*\)$/.exec(o))o=p[1];else{if(!(p=/^(.+?)@/.exec(o)))return 0;o=p[1]}bt(Si.td??0),p=wi(o)+1;var g=Ur(p);return g&&Ut(o,g,p),Si.td=g,Si.td}function Ty(o){o>>>=0;var p=(x(),H).length;if(o<=p||4294901760<o)return!1;for(var g=1;4>=g;g*=2){var m=p*(1+.2/g);m=Math.min(m,o+100663296);e:{m=(Math.min(4294901760,65536*Math.ceil(Math.max(o,m)/65536))-F.buffer.byteLength+65535)/65536|0;try{F.grow(m),q();var v=1;break e}catch{}v=void 0}if(v)return!0}return!1}function Ey(o,p,g){if(o>>>=0,p>>>=0,ur.sd==o)var m=ur.Md;else(m=Error().stack.toString().split(`
`))[0]=="Error"&&m.shift(),Yh(m);for(var v=3;m[v]&&ki(m[v])!=o;)++v;for(o=0;o<g&&m[o+v];++o)(x(),N)[p+4*o>>>2>>>0]=ki(m[o+v]);return o}var Ra,Da={},Xh=()=>{var m;if(!Ra){var o,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(((m=globalThis.navigator)==null?void 0:m.language)??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in Da)Da[o]===void 0?delete p[o]:p[o]=Da[o];var g=[];for(o in p)g.push(`${o}=${p[o]}`);Ra=g}return Ra};function Jh(o,p){if(n)return oe(19,1,o,p);o>>>=0,p>>>=0;var g,m=0,v=0;for(g of Xh()){var T=p+m;(x(),X)[o+v>>>2>>>0]=T,m+=Ut(g,T,1/0)+1,v+=4}return 0}function ef(o,p){if(n)return oe(20,1,o,p);o>>>=0,p>>>=0;var g=Xh();for(var m of((x(),X)[o>>>2>>>0]=g.length,o=0,g))o+=wi(m)+1;return(x(),X)[p>>>2>>>0]=o,0}function tf(o){return n?oe(21,1,o):52}function rf(o,p,g,m){return n?oe(22,1,o,p,g,m):52}function nf(o,p,g,m){return n?oe(23,1,o,p,g,m):70}var zy=[null,[],[]];function af(o,p,g,m){if(n)return oe(24,1,o,p,g,m);p>>>=0,g>>>=0,m>>>=0;for(var v=0,T=0;T<g;T++){var C=(x(),X)[p>>>2>>>0],R=(x(),X)[p+4>>>2>>>0];p+=8;for(var j=0;j<R;j++){var Z=o,pe=(x(),H)[C+j>>>0],we=zy[Z];pe===0||pe===10?((Z===1?S:E)(vh(we)),we.length=0):we.push(pe)}v+=R}return(x(),X)[m>>>2>>>0]=v,0}function Cy(o){return o>>>0}n||function(){for(var o=t.numThreads-1;o--;)V();dt.push(async()=>{var p=async function(){if(!n)return Promise.all(Ve.map(M))}();qe++,await p,--qe==0&&Ne&&(p=Ne,Ne=null,p())})}(),n||(F=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),q()),t.wasmBinary&&(f=t.wasmBinary),t.stackSave=()=>fe(),t.stackRestore=o=>he(o),t.stackAlloc=o=>qa(o),t.setValue=function(o,p,g="i8"){switch(g.endsWith("*")&&(g="*"),g){case"i1":case"i8":(x(),U)[o>>>0]=p;break;case"i16":(x(),K)[o>>>1>>>0]=p;break;case"i32":(x(),N)[o>>>2>>>0]=p;break;case"i64":(x(),le)[o>>>3>>>0]=BigInt(p);break;case"float":(x(),Y)[o>>>2>>>0]=p;break;case"double":(x(),re)[o>>>3>>>0]=p;break;case"*":(x(),X)[o>>>2>>>0]=p;break;default:ne(`invalid type for setValue: ${g}`)}},t.getValue=function(o,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return(x(),U)[o>>>0];case"i16":return(x(),K)[o>>>1>>>0];case"i32":return(x(),N)[o>>>2>>>0];case"i64":return(x(),le)[o>>>3>>>0];case"float":return(x(),Y)[o>>>2>>>0];case"double":return(x(),re)[o>>>3>>>0];case"*":return(x(),X)[o>>>2>>>0];default:ne(`invalid type for getValue: ${p}`)}},t.UTF8ToString=Re,t.stringToUTF8=Ut,t.lengthBytesUTF8=wi;var sf,of,Ii,bt,Ur,Pa,uf,lf,df,Ua,pf,cf,me,qr,hf,he,qa,fe,ff,Wa,mf,gf,yf,La,wf,_f,bf,$f,vf,xf,kf,Sf,If,Tf,Ef,zf,Cf,Af,Of,Mf,Bf,Nf,Rf,Df,Pf,Uf,qf,Wf,Lf,Vf,Gf,Hf,Ff,jf,Kf,Qf,Zf,Yf,Xf,Jf,em,tm,rm,im,zt,Ay=[We,mt,wh,xh,kh,Sh,Ih,Th,Eh,zh,Ch,Ah,Oh,Mh,Bh,Nh,jh,Kh,Qh,Jh,ef,tf,rf,nf,af],Va={929356:(o,p,g,m,v)=>{if(t===void 0||!t.Zc)return 1;if((o=Re(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=t.Zc.get(o)))return 2;if(p=Number(p>>>0),g=Number(g>>>0),m=Number(m>>>0),p+g>o.byteLength)return 3;try{let T=o.subarray(p,p+g);switch(v){case 0:(x(),H).set(T,m>>>0);break;case 1:t.Xd?t.Xd(m,T):t.Ld(m,T);break;default:return 4}return 0}catch{return 4}},930180:(o,p,g)=>{t.xd(o,(x(),H).subarray(p>>>0,p+g>>>0))},930244:()=>t.Zd(),930286:o=>{t.vd(o)},930323:()=>{t.Ed()},930354:()=>{t.Fd()},930383:()=>{t.Jd()},930408:o=>t.Dd(o),930441:o=>t.Hd(o),930473:(o,p,g)=>{t.jd(Number(o),Number(p),Number(g),!0)},930536:(o,p,g)=>{t.jd(Number(o),Number(p),Number(g))},930593:()=>typeof wasmOffsetConverter<"u",930650:o=>{t.ac("Abs",o,void 0)},930701:o=>{t.ac("Neg",o,void 0)},930752:o=>{t.ac("Floor",o,void 0)},930805:o=>{t.ac("Ceil",o,void 0)},930857:o=>{t.ac("Reciprocal",o,void 0)},930915:o=>{t.ac("Sqrt",o,void 0)},930967:o=>{t.ac("Exp",o,void 0)},931018:o=>{t.ac("Erf",o,void 0)},931069:o=>{t.ac("Sigmoid",o,void 0)},931124:(o,p,g)=>{t.ac("HardSigmoid",o,{alpha:p,beta:g})},931203:o=>{t.ac("Log",o,void 0)},931254:o=>{t.ac("Sin",o,void 0)},931305:o=>{t.ac("Cos",o,void 0)},931356:o=>{t.ac("Tan",o,void 0)},931407:o=>{t.ac("Asin",o,void 0)},931459:o=>{t.ac("Acos",o,void 0)},931511:o=>{t.ac("Atan",o,void 0)},931563:o=>{t.ac("Sinh",o,void 0)},931615:o=>{t.ac("Cosh",o,void 0)},931667:o=>{t.ac("Asinh",o,void 0)},931720:o=>{t.ac("Acosh",o,void 0)},931773:o=>{t.ac("Atanh",o,void 0)},931826:o=>{t.ac("Tanh",o,void 0)},931878:o=>{t.ac("Not",o,void 0)},931929:(o,p,g)=>{t.ac("Clip",o,{min:p,max:g})},931998:o=>{t.ac("Clip",o,void 0)},932050:(o,p)=>{t.ac("Elu",o,{alpha:p})},932108:o=>{t.ac("Gelu",o,void 0)},932160:o=>{t.ac("Relu",o,void 0)},932212:(o,p)=>{t.ac("LeakyRelu",o,{alpha:p})},932276:(o,p)=>{t.ac("ThresholdedRelu",o,{alpha:p})},932346:(o,p)=>{t.ac("Cast",o,{to:p})},932404:o=>{t.ac("Add",o,void 0)},932455:o=>{t.ac("Sub",o,void 0)},932506:o=>{t.ac("Mul",o,void 0)},932557:o=>{t.ac("Div",o,void 0)},932608:o=>{t.ac("Pow",o,void 0)},932659:o=>{t.ac("Equal",o,void 0)},932712:o=>{t.ac("Greater",o,void 0)},932767:o=>{t.ac("GreaterOrEqual",o,void 0)},932829:o=>{t.ac("Less",o,void 0)},932881:o=>{t.ac("LessOrEqual",o,void 0)},932940:(o,p,g,m,v)=>{t.ac("ReduceMean",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933115:(o,p,g,m,v)=>{t.ac("ReduceMax",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933289:(o,p,g,m,v)=>{t.ac("ReduceMin",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933463:(o,p,g,m,v)=>{t.ac("ReduceProd",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933638:(o,p,g,m,v)=>{t.ac("ReduceSum",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933812:(o,p,g,m,v)=>{t.ac("ReduceL1",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933985:(o,p,g,m,v)=>{t.ac("ReduceL2",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},934158:(o,p,g,m,v)=>{t.ac("ReduceLogSum",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},934335:(o,p,g,m,v)=>{t.ac("ReduceSumSquare",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},934515:(o,p,g,m,v)=>{t.ac("ReduceLogSumExp",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},934695:o=>{t.ac("Where",o,void 0)},934748:(o,p,g)=>{t.ac("Transpose",o,{perm:p?Array.from((x(),N).subarray(Number(p)>>>0,Number(g)>>>0)):[]})},934872:(o,p,g,m)=>{t.ac("DepthToSpace",o,{blocksize:p,mode:Re(g),format:m?"NHWC":"NCHW"})},935005:(o,p,g,m)=>{t.ac("DepthToSpace",o,{blocksize:p,mode:Re(g),format:m?"NHWC":"NCHW"})},935138:(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze,Wt)=>{t.ac("ConvTranspose",o,{format:j?"NHWC":"NCHW",autoPad:p,dilations:[g],group:m,kernelShape:[v],pads:[T,C],strides:[R],wIsConst:()=>!!(x(),U)[Z>>>0],outputPadding:pe?Array.from((x(),N).subarray(Number(pe)>>>0,Number(we)>>>0)):[],outputShape:Ie?Array.from((x(),N).subarray(Number(Ie)>>>0,Number(ze)>>>0)):[],activation:Re(Wt)})},935571:(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze)=>{t.ac("ConvTranspose",o,{format:R?"NHWC":"NCHW",autoPad:p,dilations:Array.from((x(),N).subarray(Number(g)>>>0,2+(Number(g)>>>0)>>>0)),group:m,kernelShape:Array.from((x(),N).subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from((x(),N).subarray(Number(T)>>>0,4+(Number(T)>>>0)>>>0)),strides:Array.from((x(),N).subarray(Number(C)>>>0,2+(Number(C)>>>0)>>>0)),wIsConst:()=>!!(x(),U)[j>>>0],outputPadding:Z?Array.from((x(),N).subarray(Number(Z)>>>0,Number(pe)>>>0)):[],outputShape:we?Array.from((x(),N).subarray(Number(we)>>>0,Number(Ie)>>>0)):[],activation:Re(ze)})},936232:(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze,Wt)=>{t.ac("ConvTranspose",o,{format:j?"NHWC":"NCHW",autoPad:p,dilations:[g],group:m,kernelShape:[v],pads:[T,C],strides:[R],wIsConst:()=>!!(x(),U)[Z>>>0],outputPadding:pe?Array.from((x(),N).subarray(Number(pe)>>>0,Number(we)>>>0)):[],outputShape:Ie?Array.from((x(),N).subarray(Number(Ie)>>>0,Number(ze)>>>0)):[],activation:Re(Wt)})},936665:(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze)=>{t.ac("ConvTranspose",o,{format:R?"NHWC":"NCHW",autoPad:p,dilations:Array.from((x(),N).subarray(Number(g)>>>0,2+(Number(g)>>>0)>>>0)),group:m,kernelShape:Array.from((x(),N).subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from((x(),N).subarray(Number(T)>>>0,4+(Number(T)>>>0)>>>0)),strides:Array.from((x(),N).subarray(Number(C)>>>0,2+(Number(C)>>>0)>>>0)),wIsConst:()=>!!(x(),U)[j>>>0],outputPadding:Z?Array.from((x(),N).subarray(Number(Z)>>>0,Number(pe)>>>0)):[],outputShape:we?Array.from((x(),N).subarray(Number(we)>>>0,Number(Ie)>>>0)):[],activation:Re(ze)})},937326:(o,p)=>{t.ac("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},937417:(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze)=>{t.ac("AveragePool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:m,storage_order:v,dilations:T?Array.from((x(),N).subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:R?Array.from((x(),N).subarray(Number(R)>>>0,Number(j)>>>0)):[],pads:Z?Array.from((x(),N).subarray(Number(Z)>>>0,Number(pe)>>>0)):[],strides:we?Array.from((x(),N).subarray(Number(we)>>>0,Number(Ie)>>>0)):[]})},937896:(o,p)=>{t.ac("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},937987:(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze)=>{t.ac("AveragePool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:m,storage_order:v,dilations:T?Array.from((x(),N).subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:R?Array.from((x(),N).subarray(Number(R)>>>0,Number(j)>>>0)):[],pads:Z?Array.from((x(),N).subarray(Number(Z)>>>0,Number(pe)>>>0)):[],strides:we?Array.from((x(),N).subarray(Number(we)>>>0,Number(Ie)>>>0)):[]})},938466:(o,p)=>{t.ac("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},938553:(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze)=>{t.ac("MaxPool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:m,storage_order:v,dilations:T?Array.from((x(),N).subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:R?Array.from((x(),N).subarray(Number(R)>>>0,Number(j)>>>0)):[],pads:Z?Array.from((x(),N).subarray(Number(Z)>>>0,Number(pe)>>>0)):[],strides:we?Array.from((x(),N).subarray(Number(we)>>>0,Number(Ie)>>>0)):[]})},939028:(o,p)=>{t.ac("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},939115:(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze)=>{t.ac("MaxPool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:m,storage_order:v,dilations:T?Array.from((x(),N).subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:R?Array.from((x(),N).subarray(Number(R)>>>0,Number(j)>>>0)):[],pads:Z?Array.from((x(),N).subarray(Number(Z)>>>0,Number(pe)>>>0)):[],strides:we?Array.from((x(),N).subarray(Number(we)>>>0,Number(Ie)>>>0)):[]})},939590:(o,p,g,m,v)=>{t.ac("Gemm",o,{alpha:p,beta:g,transA:m,transB:v})},939694:o=>{t.ac("MatMul",o,void 0)},939748:(o,p,g,m)=>{t.ac("ArgMax",o,{keepDims:!!p,selectLastIndex:!!g,axis:m})},939856:(o,p,g,m)=>{t.ac("ArgMin",o,{keepDims:!!p,selectLastIndex:!!g,axis:m})},939964:(o,p)=>{t.ac("Softmax",o,{axis:p})},940027:(o,p)=>{t.ac("Concat",o,{axis:p})},940087:(o,p,g,m,v)=>{t.ac("Split",o,{axis:p,numOutputs:g,splitSizes:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},940243:o=>{t.ac("Expand",o,void 0)},940297:(o,p)=>{t.ac("Gather",o,{axis:Number(p)})},940368:(o,p)=>{t.ac("GatherElements",o,{axis:Number(p)})},940447:(o,p)=>{t.ac("GatherND",o,{batch_dims:Number(p)})},940526:(o,p,g,m,v,T,C,R,j,Z,pe)=>{t.ac("Resize",o,{antialias:p,axes:g?Array.from((x(),N).subarray(Number(g)>>>0,Number(m)>>>0)):[],coordinateTransformMode:Re(v),cubicCoeffA:T,excludeOutside:C,extrapolationValue:R,keepAspectRatioPolicy:Re(j),mode:Re(Z),nearestMode:Re(pe)})},940888:(o,p,g,m,v,T,C)=>{t.ac("Slice",o,{starts:p?Array.from((x(),N).subarray(Number(p)>>>0,Number(g)>>>0)):[],ends:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[],axes:T?Array.from((x(),N).subarray(Number(T)>>>0,Number(C)>>>0)):[]})},941152:o=>{t.ac("Tile",o,void 0)},941204:(o,p,g)=>{t.ac("InstanceNormalization",o,{epsilon:p,format:g?"NHWC":"NCHW"})},941318:(o,p,g)=>{t.ac("InstanceNormalization",o,{epsilon:p,format:g?"NHWC":"NCHW"})},941432:o=>{t.ac("Range",o,void 0)},941485:(o,p)=>{t.ac("Einsum",o,{equation:Re(p)})},941566:(o,p,g,m,v)=>{t.ac("Pad",o,{mode:p,value:g,pads:m?Array.from((x(),N).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},941709:(o,p,g,m,v,T)=>{t.ac("BatchNormalization",o,{epsilon:p,momentum:g,spatial:!!v,trainingMode:!!m,format:T?"NHWC":"NCHW"})},941878:(o,p,g,m,v,T)=>{t.ac("BatchNormalization",o,{epsilon:p,momentum:g,spatial:!!v,trainingMode:!!m,format:T?"NHWC":"NCHW"})},942047:(o,p,g)=>{t.ac("CumSum",o,{exclusive:Number(p),reverse:Number(g)})},942144:(o,p,g)=>{t.ac("DequantizeLinear",o,{axis:p,blockSize:g})},942234:(o,p,g,m,v)=>{t.ac("GridSample",o,{align_corners:p,mode:Re(g),padding_mode:Re(m),format:v?"NHWC":"NCHW"})},942404:(o,p,g,m,v)=>{t.ac("GridSample",o,{align_corners:p,mode:Re(g),padding_mode:Re(m),format:v?"NHWC":"NCHW"})},942574:(o,p)=>{t.ac("ScatterND",o,{reduction:Re(p)})},942659:(o,p,g,m,v,T,C,R,j)=>{t.ac("Attention",o,{numHeads:p,isUnidirectional:g,maskFilterValue:m,scale:v,doRotary:T,qkvHiddenSizes:C?Array.from((x(),N).subarray(Number(R)>>>0,Number(R)+C>>>0)):[],pastPresentShareBuffer:!!j})},942931:o=>{t.ac("BiasAdd",o,void 0)},942986:o=>{t.ac("BiasSplitGelu",o,void 0)},943047:o=>{t.ac("FastGelu",o,void 0)},943103:(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze,Wt,Ga)=>{t.ac("Conv",o,{format:we?"NHWC":"NCHW",auto_pad:p,dilations:g?Array.from((x(),N).subarray(Number(g)>>>0,Number(m)>>>0)):[],group:v,kernel_shape:T?Array.from((x(),N).subarray(Number(T)>>>0,Number(C)>>>0)):[],pads:R?Array.from((x(),N).subarray(Number(R)>>>0,Number(j)>>>0)):[],strides:Z?Array.from((x(),N).subarray(Number(Z)>>>0,Number(pe)>>>0)):[],w_is_const:()=>!!(x(),U)[Number(Ie)>>>0],activation:Re(ze),activation_params:Wt?Array.from((x(),Y).subarray(Number(Wt)>>>0,Number(Ga)>>>0)):[]})},943687:o=>{t.ac("Gelu",o,void 0)},943739:(o,p,g,m,v,T,C,R,j)=>{t.ac("GroupQueryAttention",o,{numHeads:p,kvNumHeads:g,scale:m,softcap:v,doRotary:T,rotaryInterleaved:C,smoothSoftmax:R,localWindowSize:j})},943956:(o,p,g,m)=>{t.ac("LayerNormalization",o,{axis:p,epsilon:g,simplified:!!m})},944067:(o,p,g,m)=>{t.ac("LayerNormalization",o,{axis:p,epsilon:g,simplified:!!m})},944178:(o,p,g,m,v,T)=>{t.ac("MatMulNBits",o,{k:p,n:g,accuracyLevel:m,bits:v,blockSize:T})},944305:(o,p,g,m,v,T)=>{t.ac("MultiHeadAttention",o,{numHeads:p,isUnidirectional:g,maskFilterValue:m,scale:v,doRotary:T})},944464:(o,p)=>{t.ac("QuickGelu",o,{alpha:p})},944528:(o,p,g,m,v)=>{t.ac("RotaryEmbedding",o,{interleaved:!!p,numHeads:g,rotaryEmbeddingDim:m,scale:v})},944667:(o,p,g)=>{t.ac("SkipLayerNormalization",o,{epsilon:p,simplified:!!g})},944769:(o,p,g)=>{t.ac("SkipLayerNormalization",o,{epsilon:p,simplified:!!g})},944871:(o,p,g,m)=>{t.ac("GatherBlockQuantized",o,{gatherAxis:p,quantizeAxis:g,blockSize:m})},944992:o=>{t.Id(o)},945026:(o,p)=>t.Kd(Number(o),Number(p),t.$c.Nd,t.$c.errors)};function Oy(o,p,g){return Lh(async()=>{await t.Gd(Number(o),Number(p),Number(g))})}function My(){return typeof wasmOffsetConverter<"u"}function By(o,p,g,m){var v=fe();try{return Sf(o,p,g,m)}catch(T){if(he(v),T!==T+0)throw T;me(1,0)}}function Ny(o,p,g){var m=fe();try{return $f(o,p,g)}catch(v){if(he(m),v!==v+0)throw v;me(1,0)}}function Ry(o,p,g){var m=fe();try{yf(o,p,g)}catch(v){if(he(m),v!==v+0)throw v;me(1,0)}}function Dy(o,p){var g=fe();try{return La(o,p)}catch(m){if(he(g),m!==m+0)throw m;me(1,0)}}function Py(o){var p=fe();try{wf(o)}catch(g){if(he(p),g!==g+0)throw g;me(1,0)}}function Uy(o,p,g,m,v,T,C){var R=fe();try{return xf(o,p,g,m,v,T,C)}catch(j){if(he(R),j!==j+0)throw j;me(1,0)}}function qy(o,p){var g=fe();try{If(o,p)}catch(m){if(he(g),m!==m+0)throw m;me(1,0)}}function Wy(o,p,g,m,v,T){var C=fe();try{_f(o,p,g,m,v,T)}catch(R){if(he(C),R!==R+0)throw R;me(1,0)}}function Ly(o,p,g,m){var v=fe();try{kf(o,p,g,m)}catch(T){if(he(v),T!==T+0)throw T;me(1,0)}}function Vy(o,p,g,m,v){var T=fe();try{bf(o,p,g,m,v)}catch(C){if(he(T),C!==C+0)throw C;me(1,0)}}function Gy(o,p,g,m,v,T,C){var R=fe();try{Ef(o,p,g,m,v,T,C)}catch(j){if(he(R),j!==j+0)throw j;me(1,0)}}function Hy(o,p,g,m,v,T,C){var R=fe();try{zf(o,p,g,m,v,T,C)}catch(j){if(he(R),j!==j+0)throw j;me(1,0)}}function Fy(o,p,g,m,v,T,C,R){var j=fe();try{Mf(o,p,g,m,v,T,C,R)}catch(Z){if(he(j),Z!==Z+0)throw Z;me(1,0)}}function jy(o,p,g,m,v){var T=fe();try{return Tf(o,p,g,m,v)}catch(C){if(he(T),C!==C+0)throw C;me(1,0)}}function Ky(o,p,g,m,v,T,C,R){var j=fe();try{Bf(o,p,g,m,v,T,C,R)}catch(Z){if(he(j),Z!==Z+0)throw Z;me(1,0)}}function Qy(o,p,g,m,v,T,C,R,j,Z,pe,we){var Ie=fe();try{Cf(o,p,g,m,v,T,C,R,j,Z,pe,we)}catch(ze){if(he(Ie),ze!==ze+0)throw ze;me(1,0)}}function Zy(o,p,g,m,v,T){var C=fe();try{return Af(o,p,g,m,v,T)}catch(R){if(he(C),R!==R+0)throw R;me(1,0)}}function Yy(o,p,g){var m=fe();try{return Nf(o,p,g)}catch(v){if(he(m),v!==v+0)throw v;return me(1,0),0n}}function Xy(o,p,g,m,v,T,C,R,j){var Z=fe();try{vf(o,p,g,m,v,T,C,R,j)}catch(pe){if(he(Z),pe!==pe+0)throw pe;me(1,0)}}function Jy(o){var p=fe();try{return Rf(o)}catch(g){if(he(p),g!==g+0)throw g;me(1,0)}}function ew(o,p,g){var m=fe();try{return Df(o,p,g)}catch(v){if(he(m),v!==v+0)throw v;me(1,0)}}function tw(o,p){var g=fe();try{return Jf(o,p)}catch(m){if(he(g),m!==m+0)throw m;return me(1,0),0n}}function rw(o,p,g,m,v){var T=fe();try{Pf(o,p,g,m,v)}catch(C){if(he(T),C!==C+0)throw C;me(1,0)}}function iw(o){var p=fe();try{return Uf(o)}catch(g){if(he(p),g!==g+0)throw g;return me(1,0),0n}}function nw(o,p,g,m,v,T){var C=fe();try{return Hf(o,p,g,m,v,T)}catch(R){if(he(C),R!==R+0)throw R;me(1,0)}}function aw(o,p,g,m,v,T){var C=fe();try{return Ff(o,p,g,m,v,T)}catch(R){if(he(C),R!==R+0)throw R;me(1,0)}}function sw(o,p,g,m,v,T,C,R){var j=fe();try{return Of(o,p,g,m,v,T,C,R)}catch(Z){if(he(j),Z!==Z+0)throw Z;me(1,0)}}function ow(o,p,g,m,v){var T=fe();try{return jf(o,p,g,m,v)}catch(C){if(he(T),C!==C+0)throw C;return me(1,0),0n}}function uw(o,p,g,m){var v=fe();try{return Kf(o,p,g,m)}catch(T){if(he(v),T!==T+0)throw T;me(1,0)}}function lw(o,p,g,m){var v=fe();try{return Qf(o,p,g,m)}catch(T){if(he(v),T!==T+0)throw T;me(1,0)}}function dw(o,p,g,m,v,T,C,R,j,Z,pe,we){var Ie=fe();try{return Zf(o,p,g,m,v,T,C,R,j,Z,pe,we)}catch(ze){if(he(Ie),ze!==ze+0)throw ze;me(1,0)}}function pw(o,p,g,m,v,T,C,R,j,Z,pe){var we=fe();try{Vf(o,p,g,m,v,T,C,R,j,Z,pe)}catch(Ie){if(he(we),Ie!==Ie+0)throw Ie;me(1,0)}}function cw(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze,Wt,Ga){var ww=fe();try{Gf(o,p,g,m,v,T,C,R,j,Z,pe,we,Ie,ze,Wt,Ga)}catch(Ha){if(he(ww),Ha!==Ha+0)throw Ha;me(1,0)}}function hw(o,p,g,m){var v=fe();try{return Yf(o,p,g,m)}catch(T){if(he(v),T!==T+0)throw T;me(1,0)}}function fw(o,p,g,m,v){var T=fe();try{return Xf(o,p,g,m,v)}catch(C){if(he(T),C!==C+0)throw C;me(1,0)}}function mw(o,p,g){var m=fe();try{return qf(o,p,g)}catch(v){if(he(m),v!==v+0)throw v;me(1,0)}}function gw(o,p,g){var m=fe();try{return Wf(o,p,g)}catch(v){if(he(m),v!==v+0)throw v;me(1,0)}}function yw(o,p,g,m){var v=fe();try{Lf(o,p,g,m)}catch(T){if(he(v),T!==T+0)throw T;me(1,0)}}function Ti(){if(0<qe)Ne=Ti;else if(n)_==null||_(t),ie();else{for(var o=dt;0<o.length;)o.shift()(t);0<qe?Ne=Ti:(t.calledRun=!0,A||(ie(),_==null||_(t)))}}return n||(zt=await lt(),Ti()),t.PTR_SIZE=4,W?t:new Promise((o,p)=>{_=o,k=p})}var ks,Ss,pg=L(()=>{var e,t;ks=xs,Ss=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),Ss&&xs()}),Hi,Fi,Is,Ke,Ts,Kr,Es,zs,ji,Cs,Ki,As,Qi,Os,Zi=L(()=>{Li(),Hi=typeof location>"u"?void 0:location.origin,Fi=self.location.href>"file:"&&self.location.href<"file;",Is=()=>{{if(Fi){let e=URL;return new URL(new e("ort.bundle.min.mjs",self.location.href).href,Hi).href}return self.location.href}},Ke=Is(),Ts=()=>{if(Ke&&!Ke.startsWith("blob:"))return Ke.substring(0,Ke.lastIndexOf("/")+1)},Kr=(e,t)=>{try{let r=t??Ke;return(r?new URL(e,r):new URL(e)).origin===Hi}catch{return!1}},Es=(e,t)=>{let r=t??Ke;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},zs=(e,t)=>`${t??"./"}${e}`,ji=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Cs=async e=>(await import(e)).default,Ki=(dg(),_r(bs)).default,As=async()=>{if(!Ke)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Kr(Ke))return[void 0,Ki()];let e=await ji(Ke);return[e,Ki(e)]},Qi=(pg(),_r(vs)).default,Os=async(e,t,r,i)=>{let n=Qi&&!(e||t);if(n)if(Ke)n=Kr(Ke)||i&&!r;else if(i&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,Qi];{let s="ort-wasm-simd-threaded.jsep.mjs",a=e??Es(s,t),u=r&&a&&!Kr(a,t),l=u?await ji(a):a??zs(s,t);return[u?l:void 0,await Cs(l)]}}}),Yi,Qr,xr,Xi,Ms,Bs,Ns,Ji,Te,Kt=L(()=>{Zi(),Qr=!1,xr=!1,Xi=!1,Ms=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Bs=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Ns=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Ji=async e=>{if(Qr)return Promise.resolve();if(xr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Xi)throw new Error("previous call to 'initializeWebAssembly()' failed.");xr=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Ns())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Bs())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=Ms();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,s=typeof n=="string"?n:void 0,a=n==null?void 0:n.mjs,u=(a==null?void 0:a.href)??a,l=n==null?void 0:n.wasm,d=(l==null?void 0:l.href)??l,h=e.wasmBinary,[c,f]=await Os(u,s,r>1,!!h||!!d),y=!1,w=[];if(t>0&&w.push(new Promise(_=>{setTimeout(()=>{y=!0,_()},t)})),w.push(new Promise((_,k)=>{let $={numThreads:r};if(h)$.wasmBinary=h,$.locateFile=b=>b;else if(d||s)$.locateFile=b=>d??s+b;else if(u&&u.indexOf("blob:")!==0)$.locateFile=b=>new URL(b,u).href;else if(c){let b=Ts();b&&($.locateFile=I=>b+I)}f($).then(b=>{xr=!1,Qr=!0,Yi=b,_(),c&&URL.revokeObjectURL(c)},b=>{xr=!1,Xi=!0,k(b)})})),await Promise.race(w),y)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Te=()=>{if(Qr&&Yi)return Yi;throw new Error("WebAssembly is not initialized yet.")}}),it,Zr,ve,en=L(()=>{Kt(),it=(e,t)=>{let r=Te(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},Zr=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,s])=>{let a=t?t+n:n;if(typeof s=="object")Zr(s,a+".",r,i);else if(typeof s=="string"||typeof s=="number")i(a,s.toString());else if(typeof s=="boolean")i(a,s?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof s}`)})},ve=e=>{let t=Te(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let s=Number(t.getValue(n,i===4?"i32":"i64")),a=t.getValue(n+i,"*"),u=a?t.UTF8ToString(a):"";throw new Error(`${e} ERROR_CODE: ${s}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),Rs,cg=L(()=>{Kt(),en(),Rs=e=>{let t=Te(),r=0,i=[],n=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(n.terminate=!1);let s=0;return(e==null?void 0:e.tag)!==void 0&&(s=it(e.tag,i)),r=t._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,s),r===0&&ve("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&Zr(e.extra,"",new WeakSet,(a,u)=>{let l=it(a,i),d=it(u,i);t._OrtAddRunConfigEntry(r,l,d)!==0&&ve(`Can't set a run config entry: ${a} - ${u}.`)}),[r,i]}catch(s){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(a=>t._free(a)),s}}}),Ds,Ps,Us,kr,qs,Ws,hg=L(()=>{Kt(),en(),Ds=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Ps=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Us=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},kr=(e,t,r,i)=>{let n=it(t,i),s=it(r,i);Te()._OrtAddSessionConfigEntry(e,n,s)!==0&&ve(`Can't set a session config entry: ${t} - ${r}.`)},qs=async(e,t,r)=>{let i=t.executionProviders;for(let n of i){let s=typeof n=="string"?n:n.name,a=[];switch(s){case"webnn":if(s="WEBNN",typeof n!="string"){let c=n==null?void 0:n.deviceType;c&&kr(e,"deviceType",c,r)}break;case"webgpu":if(s="JS",typeof n!="string"){let c=n;if(c!=null&&c.preferredLayout){if(c.preferredLayout!=="NCHW"&&c.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);kr(e,"preferredLayout",c.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${s}`)}let u=it(s,r),l=a.length,d=0,h=0;if(l>0){d=Te()._malloc(l*Te().PTR_SIZE),r.push(d),h=Te()._malloc(l*Te().PTR_SIZE),r.push(h);for(let c=0;c<l;c++)Te().setValue(d+c*Te().PTR_SIZE,a[c][0],"*"),Te().setValue(h+c*Te().PTR_SIZE,a[c][1],"*")}await Te()._OrtAppendExecutionProvider(e,u,d,h,l)!==0&&ve(`Can't append execution provider: ${s}.`)}},Ws=async e=>{let t=Te(),r=0,i=[],n=e||{};Us(n);try{let s=Ds(n.graphOptimizationLevel??"all"),a=Ps(n.executionMode??"sequential"),u=typeof n.logId=="string"?it(n.logId,i):0,l=n.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log severity level is not valid: ${l}`);let d=n.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let h=typeof n.optimizedModelFilePath=="string"?it(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(s,!!n.enableCpuMemArena,!!n.enableMemPattern,a,!!n.enableProfiling,0,u,l,d,h),r===0&&ve("Can't create session options."),n.executionProviders&&await qs(r,n,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);kr(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[c,f]of Object.entries(n.freeDimensionOverrides)){if(typeof c!="string")throw new Error(`free dimension override name must be a string: ${c}`);if(typeof f!="number"||!Number.isInteger(f)||f<0)throw new Error(`free dimension override value must be a non-negative integer: ${f}`);let y=it(c,i);t._OrtAddFreeDimensionOverride(r,y,f)!==0&&ve(`Can't set a free dimension override: ${c} - ${f}.`)}return n.extra!==void 0&&Zr(n.extra,"",new WeakSet,(c,f)=>{kr(r,c,f,i)}),[r,i]}catch(s){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&ve("Can't release session options."),i.forEach(a=>t._free(a)),s}}}),Qt,vt,Zt,Yr,Xr,tn,rn,nn,se=L(()=>{Qt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},vt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Zt=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,s)=>n*s,1);return r>0?Math.ceil(i*r):void 0},Yr=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Xr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},tn=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",rn=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",nn=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),an,Ls=L(()=>{Li(),an=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),s;try{s=new ArrayBuffer(i)}catch(u){if(u instanceof RangeError){let l=Math.ceil(i/65536);s=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let a=0;for(;;){let{done:u,value:l}=await n.read();if(u)break;let d=l.byteLength;new Uint8Array(s,a,d).set(l),a+=d}return new Uint8Array(s,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),Vs,Gs,Hs,Fs,sn,js,ge,xt=L(()=>{se(),Vs=["V","I","W","E","F"],Gs=(e,t)=>{console.log(`[${Vs[e]},${new Date().toISOString()}]${t}`)},sn=(e,t)=>{Hs=e,Fs=t},js=(e,t)=>{let r=Xr(e),i=Xr(Hs);r>=i&&Gs(r,typeof t=="function"?t():t)},ge=(...e)=>{Fs&&js(...e)}}),Ks,pr,B,Jr,Qs,Zs,Ys,ue=L(()=>{Ks=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},pr=class{static calcShape(e,t,r=!1){let i=e.length,n=t.length;if(i===0)return t;if(n===0)return e;let s=Math.max(e.length,t.length),a=new Array(s);if(r){if(i<2||n<2)return;let u=Ks.calcMatMulShape([e[i-2],e[i-1]],[t[n-2],t[n-1]]);if(u===void 0)return;[a[s-2],a[s-1]]=u}for(let u=r?3:1;u<=s;u++){let l=i-u<0?1:e[i-u],d=n-u<0?1:t[n-u];if(l!==d&&l>1&&d>1)return;let h=Math.max(l,d);if(l&&d)a[s-u]=Math.max(l,d);else{if(h>1)return;a[s-u]=0}}return a}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[i-n])return!1;return!0}},B=class Ei{static size(t){return Ei.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let n=new Array(i),s=i-1;for(;s>=0;){if(t[s]%r===0){n[s]=t[s]/r;break}if(r%t[s]!==0)throw new Error("cannot convert shape");n[s]=1,r/=t[s],s--}for(s--;s>=0;s--)n[s]=t[s];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Ei.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Ei.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let n=1;for(let s=r;s<i;s++){if(t[s]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[s])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let n=r-3;n>=0;--n)i[n]=i[n+1]*t[n+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((n,s)=>n+r[s]+r[s+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,n)=>i===r[n])}},Jr=class Wr{static adjustPoolAttributes(t,r,i,n,s,a){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=i.length?i.push(r[u+2]):i[u]=r[u+2];for(let u=0;u<i.length;u++)if(u<n.length){if(n[u]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let u=0;u<i.length;u++)if(u<s.length){if(s[u]<0)throw new Error("dilations should be greater than or equal to 1")}else s.push(1);for(let u=0;u<i.length*2;u++)if(u<a.length){if(a[u]<0)throw new Error("pad should be greater than or equal to 1")}else a.push(0);for(let u=0;u<i.length;u++){if(i[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(a[u]>=i[u]||a[u+i.length]>=i[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,n,s,a,u){if(u){if(s.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)Wr.adjustPadAndReturnShape(t[l+(a?1:2)],r[l],i[l],n[l],s,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,i,n,s,a,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return Wr.computeShapeHelper(t,r,l,i,n,s,a,u),l}static computeConvOutputShape(t,r,i,n,s,a,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return Wr.computeShapeHelper(!1,t,l,i,n,s,a,u),l}static computeShapeHelper(t,r,i,n,s,a,u,l){if(t)for(let d=0;d<r.length-2;d++)i.push(1);else for(let d=0;d<r.length-2;d++)i.push(Wr.adjustPadAndReturnShape(r[d+2],n[d],s[d],a[d],u,d,d+r.length-2,l))}static adjustPadAndReturnShape(t,r,i,n,s,a,u,l){let d=i*(n-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return s[a]=0,s[u]=0,Math.floor((t-d)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let h=((t+r-1)/r-1)*r+n-t;return s[a]=Math.floor(l==="SAME_LOWER"?(h+1)/2:h/2),s[u]=h-s[a],Math.floor((t+h-n)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+s[a]+s[u]-d)/r+1)}},Qs=class{static getShapeOfGemmResult(e,t,r,i,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let s,a,u;t?(s=e[1],a=e[0]):(s=e[0],a=e[1]);let l=-1;if(i?(u=r[0],l=1):(u=r[1],l=0),r[l]!==a)throw new Error("dimension mismatch");if(s<=0||u<=0||a<=0)throw new Error("invalid shape specified");if(n&&!pr.isValidBroadcast(n,[s,u]))throw new Error("gemm: invalid bias shape for broadcast");return[s,u,a]}},Zs=-34028234663852886e22,Ys=34028234663852886e22}),on,Xs=L(()=>{se(),on=(e,t)=>new(Yr(t))(e)}),un,ln,dn,Js,pn,eo,cn,hn,fn,to,ro,fg=L(()=>{se(),xt(),un=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),ln=(e,t)=>{if(t==="int32")return e;let r=un.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,s=new(Yr(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let a=new Int32Array(n);for(let u=0;u<n;u++){let l=s[u];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");a[u]=Number(l)}return new Uint8Array(a.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&s.some(u=>u>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let a=Int32Array.from(s,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},dn=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(s=>s<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(s=>s<-128||s>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(s=>s<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},Js=1,pn=()=>Js++,eo=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),cn=(e,t)=>{let r=un.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},hn=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:s,fallbackDataType:a}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=s,this.fallbackDataType=a}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return cn(this.dataType,this.tensorShape)}destroy(){ge("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=dn(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return r.buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},fn=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),s=this.tensorManager.getMLOpSupportLimits(e),a;if(!(s!=null&&s.input.dataTypes.includes(t))){if(a=eo.get(t),!a||(s==null?void 0:s.input.dataTypes.includes(a)))throw new Error(`WebNN backend does not support data type: ${t}`);ge("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${a}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==cn(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let u=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,u,!0,!0,a),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=ln(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else ge("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r;if(this.activeUpload){let i=(t=this.wrapper)!=null&&t.isDataConverted?dn(this.activeUpload,(r=this.wrapper)==null?void 0:r.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(i):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(i);return}else return i.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},to=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=pn();return this.tensorTrackersById.set(e,new fn(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){ge("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let s=this.tensorTrackersById.get(t);if(!s)throw new Error("Tensor not found.");return s.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){ge("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),s=pn(),a=new hn({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(s,new fn(this,a)),this.externalTensors.add(a),s}async getCachedTensor(e,t,r,i,n,s,a){let u=this.getMLContext(e);for(let[d,h]of this.freeTensors.entries())if(h.canReuseTensor(u,t,r)){ge("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${a?`fallbackDataType: ${a},`:""} shape: ${r}`);let c=this.freeTensors.splice(d,1)[0];return c.sessionId=e,c}ge("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${a?`fallbackDataType: ${a},`:""} shape: ${r}}`);let l=await u.createTensor({dataType:a??t,shape:r,dimensions:r,usage:i,writable:n,readable:s});return new hn({sessionId:e,context:u,tensor:l,dataType:t,shape:r,fallbackDataType:a})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},ro=(...e)=>new to(...e)}),Sr,io,no,mg=L(()=>{se(),Kt(),Xs(),fg(),xt(),Sr=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),io=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,s)=>n===i[s]&&e[n]===t[n])},no=class{constructor(e){this.tensorManager=ro(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,sn(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){ge("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){ge("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)ge("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>io(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){ge("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let s=Sr.get(r);if(!s)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,s,i,n)}async createTemporaryTensor(e,t,r){ge("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=Sr.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let s=this.temporarySessionTensorIds.get(e);return s?s.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!Te().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ge("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return on(r,t)}}registerMLTensor(e,t,r,i){let n=Sr.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let s=this.tensorManager.registerTensor(e,t,n,i);return ge("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${s}}`),s}registerMLConstant(e,t,r,i,n,s,a=!1){if(!s)throw new Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let l=s.get(u);if(!l)throw new Error(`File with name ${u} not found in preloaded files.`);if(t+r>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(t,t+r).buffer,h;switch(n.dataType){case"float32":h=new Float32Array(d);break;case"float16":h=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":h=new Int32Array(d);break;case"uint32":h=new Uint32Array(d);break;case"int64":if(a){let c=ln(new Uint8Array(d),"int64");h=new Int32Array(c.buffer),n.dataType="int32"}else h=new BigInt64Array(d);break;case"uint64":h=new BigUint64Array(d);break;case"int8":h=new Int8Array(d);break;case"int4":case"uint4":case"uint8":h=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${n.dataType} in creating WebNN Constant from external data.`)}return ge("verbose",()=>`[WebNN] registerMLConstant {dataType: ${n.dataType}, shape: ${n.shape}}} ${a?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),i.constant(n,h)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=Sr.get(Qt(t)),n=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!(n!=null&&n.input.dataTypes.includes(i)):!!(n!=null&&n.output.dataTypes.includes(i))}flush(){}}}),mn=L(()=>{}),gn,ei,ti,ao,so,yn,wn,oo,uo,gg=L(()=>{xt(),mn(),gn=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),ei=[],ti=e=>Math.ceil(Number(e)/16)*16,ao=e=>{for(let t=0;t<ei.length;t++){let r=ei[t];if(e<=r)return r}return Math.ceil(e/16)*16},so=1,yn=()=>so++,wn=async(e,t,r,i)=>{let n=ti(r),s=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let a=e.getCommandEncoder();e.endComputePass(),a.copyBufferToBuffer(t,0,s,0,n),e.flush(),await s.mapAsync(GPUMapMode.READ);let u=s.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{s.destroy()}},oo=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of gn)ei.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,n=t.byteLength,s=ti(n),a=this.storageCache.get(e);if(!a)throw new Error("gpu data for uploading does not exist");if(Number(a.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${a.originalSize}, data size=${n}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:s,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=u.getMappedRange();new Uint8Array(l).set(new Uint8Array(r,i,n)),u.unmap();let d=this.backend.device.createCommandEncoder();d.copyBufferToBuffer(u,0,a.gpuData.buffer,0,s),this.backend.device.queue.submit([d.finish()]),u.destroy(),ge("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=ti(r.originalSize),s=this.backend.getCommandEncoder();this.backend.endComputePass(),s.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return ge("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=yn();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),ge("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),ge("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=ao(e),i,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,s=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||s){let u=(n?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?i=u.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let a={id:yn(),type:0,buffer:i};return this.storageCache.set(a.id,{gpuData:a,originalSize:Number(e)}),ge("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${a.id}`),a}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return ge("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await wn(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=gn.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(ge("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},uo=(...e)=>new oo(...e)}),lo,be,Me=L(()=>{lo=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},be=e=>new lo(e)}),cr,ri,De,Le,te,Oe,_n,hr,Bt,ee,Ir,P,J,po,bn,co,ho,de=L(()=>{se(),ue(),cr=64,ri=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},De=(e,t=1)=>{let r=ri(e,t);return typeof r=="string"?r:r[0]},Le=(e,t=1)=>{let r=ri(e,t);return typeof r=="string"?r:r[1]},te=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:B.computeStrides(r)})}),t},Oe=e=>e%4===0?4:e%2===0?2:1,_n=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,hr=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Bt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,ee=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,Ir=(e,t,r,i,n)=>{let s=typeof r=="number",a=s?r:r.length,u=[...new Array(a).keys()],l=a<2?"u32":a<=4?`vec${a}<u32>`:`array<u32, ${a}>`,d=ri(t,n),h=typeof d=="string"?d:d[1],c=typeof d=="string"?d:d[0],f={indices:l,value:h,storage:c,tensor:t},y=W=>typeof W=="string"?W:`${W}u`,w={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},_=s?"uniforms.":"",k=`${_}${e}_shape`,$=`${_}${e}_strides`,b="";for(let W=0;W<a-1;W++)b+=`
    let dim${W} = current / ${ee($,W,a)};
    let rest${W} = current % ${ee($,W,a)};
    indices[${W}] = dim${W};
    current = rest${W};
    `;b+=`indices[${a-1}] = current;`;let I=a<2?"":`
  fn o2i_${e}(offset: u32) -> ${f.indices} {
    var indices: ${f.indices};
    var current = offset;
    ${b}
    return indices;
  }`,S=W=>(w.offsetToIndices=!0,a<2?W:`o2i_${e}(${W})`),E=[];if(a>=2)for(let W=a-1;W>=0;W--)E.push(`${ee($,W,a)} * (indices[${W}])`);let A=a<2?"":`
  fn i2o_${e}(indices: ${f.indices}) -> u32 {
    return ${E.join("+")};
  }`,O=W=>(w.indicesToOffset=!0,a<2?W:`i2o_${e}(${W})`),x=(...W)=>a===0?"0u":`${f.indices}(${W.map(y).join(",")})`,D=(W,q)=>a<2?`${W}`:`${ee(W,q,a)}`,U=(W,q,ie)=>a<2?`${W}=${ie};`:`${ee(W,q,a)}=${ie};`,H={},K=(W,q)=>{w.broadcastedIndicesToOffset=!0;let ie=`${q.name}broadcastedIndicesTo${e}Offset`;if(ie in H)return`${ie}(${W})`;let ne=[];for(let ke=a-1;ke>=0;ke--){let lt=q.indicesGet("outputIndices",ke+q.rank-a);ne.push(`${D($,ke)} * (${lt} % ${D(k,ke)})`)}return H[ie]=`fn ${ie}(outputIndices: ${q.type.indices}) -> u32 {
             return ${ne.length>0?ne.join("+"):"0u"};
           }`,`${ie}(${W})`},Q=(W,q)=>(()=>{if(f.storage===f.value)return`${e}[${W}]=${q};`;if(f.storage==="vec2<u32>"&&f.value==="i32")return`${e}[${W}]=vec2<u32>(u32(${q}), select(0u, 0xFFFFFFFFu, ${q} < 0));`;if(f.storage==="vec2<u32>"&&f.value==="u32")return`${e}[${W}]=vec2<u32>(u32(${q}), 0u);`;if(f.storage==="u32"&&f.value==="vec4<bool>")return`${e}[${W}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${q}));`;throw new Error(`not supported combination of storage type ${f.storage} and value type ${f.value} yet`)})(),N=W=>(()=>{if(f.storage===f.value)return`${e}[${W}]`;if(f.storage==="vec2<u32>"&&f.value==="i32")return`i32(${e}[${W}].x)`;if(f.storage==="vec2<u32>"&&f.value==="u32")return`u32(${e}[${W}].x)`;if(f.storage==="u32"&&f.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${W}] & 0xFFu), bool(${e}[${W}] & 0xFF00u), bool(${e}[${W}] & 0xFF0000u), bool(${e}[${W}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${f.storage} and value type ${f.value} yet`)})(),X=a<2?"":`
  fn get_${e}ByIndices(indices: ${f.indices}) -> ${h} {
    return ${N(`i2o_${e}(indices)`)};
  }`,Y=a<2?"":(()=>{let W=u.map(ie=>`d${ie}: u32`).join(", "),q=u.map(ie=>`d${ie}`).join(", ");return`
  fn get_${e}(${W}) -> ${h} {
    return get_${e}ByIndices(${x(q)});
  }`})(),re=(...W)=>{if(W.length!==a)throw new Error(`indices length must be ${a}`);let q=W.map(y).join(",");return a===0?N("0u"):a===1?N(q[0]):(w.get=!0,w.getByIndices=!0,w.indicesToOffset=!0,`get_${e}(${q})`)},le=W=>a<2?N(W):(w.getByIndices=!0,w.indicesToOffset=!0,`get_${e}ByIndices(${W})`),G=a<2?"":`
  fn set_${e}ByIndices(indices: ${f.indices}, value: ${h}) {
    ${Q(`i2o_${e}(indices)`,"value")}
  }`,xe=a<2?"":(()=>{let W=u.map(ie=>`d${ie}: u32`).join(", "),q=u.map(ie=>`d${ie}`).join(", ");return`
  fn set_${e}(${W}, value: ${h}) {
    set_${e}ByIndices(${x(q)}, value);
  }`})();return{impl:()=>{let W=[],q=!1;return w.offsetToIndices&&(W.push(I),q=!0),w.indicesToOffset&&(W.push(A),q=!0),w.broadcastedIndicesToOffset&&(Object.values(H).forEach(ie=>W.push(ie)),q=!0),w.set&&(W.push(xe),q=!0),w.setByIndices&&(W.push(G),q=!0),w.get&&(W.push(Y),q=!0),w.getByIndices&&(W.push(X),q=!0),!s&&q&&W.unshift(`const ${k} = ${f.indices}(${r.join(",")});`,`const ${$} = ${f.indices}(${B.computeStrides(r).join(",")});`),W.join(`
`)},type:f,offsetToIndices:S,indicesToOffset:O,broadcastedIndicesToOffset:K,indices:x,indicesGet:D,indicesSet:U,set:(...W)=>{if(W.length!==a+1)throw new Error(`indices length must be ${a}`);let q=W[a];if(typeof q!="string")throw new Error("value must be string");let ie=W.slice(0,a).map(y).join(",");return a===0?Q("0u",q):a===1?Q(ie[0],q):(w.set=!0,w.setByIndices=!0,w.indicesToOffset=!0,`set_${e}(${ie}, ${q})`)},setByOffset:Q,setByIndices:(W,q)=>a<2?Q(W,q):(w.setByIndices=!0,w.indicesToOffset=!0,`set_${e}ByIndices(${W}, ${q});`),get:re,getByOffset:N,getByIndices:le,usage:i,name:e,strides:$,shape:k,rank:a}},P=(e,t,r,i=1)=>Ir(e,t,r,"input",i),J=(e,t,r,i=1)=>Ir(e,t,r,"output",i),po=(e,t,r)=>Ir(e,t,r,"atomicOutput",1),bn=(e,t,r,i=1)=>Ir(e,t,r,"internal",i),co=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=cr){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,s=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,a=n?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${s}) {
    ${a}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let n=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${n}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},ho=(e,t)=>new co(e,t)}),fo,$n,mo,go,yo,wo,Qe,_o,bo,Nt=L(()=>{se(),ue(),Me(),de(),fo=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},$n=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),mo=(e,t)=>B.sortBasedOnPerm(e,$n(e.length,t)),go=(e,t,r,i)=>{let n=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let s=0;s<t;++s)n+=`a[${e[s]}]=i[${s}];`;return n+="return a;}"},yo=(e,t)=>{let r=[],i=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&i.push(t[n]);return{newShape:r,newPerm:i}},wo=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Qe=(e,t)=>{let r=e.dataType,i=e.dims.length,n=$n(i,t),s=mo(e.dims,n),a=e.dims,u=s,l=i<2||wo(n,e.dims),d;if(l)return d=w=>{let _=P("input",r,a,4),k=J("output",r,u,4);return`
  ${w.registerUniform("output_size","u32").declareVariables(_,k)}
  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let w=B.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(w/64/4)},programUniforms:[{type:12,data:Math.ceil(w/4)}]}},getShaderSource:d};let{newShape:h,newPerm:c}=yo(e.dims,n),f=B.areEqual(c,[2,3,1]),y=B.areEqual(c,[3,1,2]);if(h.length===2||f||y){a=f?[h[0],h[1]*h[2]]:y?[h[0]*h[1],h[2]]:h,u=[a[1],a[0]];let w=16;return d=_=>{let k=P("a",r,a.length),$=J("output",r,u.length);return`
  ${_.registerUniform("output_size","u32").declareVariables(k,$)}
  var<workgroup> tile : array<array<${$.type.value}, ${w+1}>, ${w}>;
  ${_.mainStart([w,w,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${w} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${w}u + local_id.x;
    let input_row = workgroup_id_x * ${w}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${k.getByIndices(`${k.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${w}u + local_id.x;
    let output_row = workgroup_id_y * ${w}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${$.setByIndices(`${$.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=B.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/w),y:Math.ceil(u[0]/w)},programUniforms:[{type:12,data:_},...te(a,u)]}},getShaderSource:d}}return d=w=>{let _=P("a",r,a.length),k=J("output",r,u.length);return`
  ${w.registerUniform("output_size","u32").declareVariables(_,k)}

  ${go(n,i,_,k)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${k.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${k.setByOffset("global_idx",_.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let w=B.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:[{type:12,data:w},...te(a,u)]}},getShaderSource:d}},_o=(e,t)=>{fo(e.inputs,t.perm),e.compute(Qe(e.inputs[0],t.perm))},bo=e=>be({perm:e.perm})}),$o,vo,xo,ko,So,Io,To,Eo,zo,Co,nt,Ao,Oo,Mo,Bo,No,Ro,Do,Po,Uo,qo,yg=L(()=>{se(),ue(),de(),xn(),Nt(),$o={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},vo={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},xo={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},ko={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},So=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},Io=(e,t)=>{let r=[],i=e.length;for(let s=0;s<i;s++)t.indexOf(s)===-1&&r.push(e[s]);let n=t.map(s=>e[s]);return[r,n]},To=(e,t)=>{let r=e.length+t.length,i=[],n=0;for(let s=0;s<r;s++)t.indexOf(s)===-1?i.push(e[n++]):i.push(1);return i},Eo=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},zo=(e,t)=>{let r=[];if(!Eo(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},Co=(e,t,r,i,n,s,a)=>{let u=r[0].dims,l=B.size(s),d=B.size(a),h=P("_A",r[0].dataType,u),c=J("output",n,s),f=64;l===1&&(f=256);let y=`
          var<workgroup> aBestValues : array<f32, ${f}>;
       `,w=_=>`
        ${_.registerUniform("reduceSize","u32").declareVariables(h,c)}
        ${y}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${_.mainStart(f)}

          let outputIndex = global_idx / ${f};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${xo[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${f}) {
           let candidate = f32(${h.getByOffset("offset + k")});
           bestValue = ${$o[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${f}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${vo[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${c.setByOffset("outputIndex",`${i==="mean"?`${c.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${c.type.storage}(${ko[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${f}`,inputDependencies:["type"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},nt=(e,t,r,i)=>{let n=e.inputs.length===1?r:vn(e.inputs,r),s=n.axes;s.length===0&&!n.noopWithEmptyAxes&&(s=e.inputs[0].dims.map((y,w)=>w));let a=B.normalizeAxes(s,e.inputs[0].dims.length),u=a,l=e.inputs[0],d=zo(u,e.inputs[0].dims.length);d.length>0&&(l=e.compute(Qe(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],u=So(u.length,l.dims.length));let[h,c]=Io(l.dims,u),f=h;n.keepDims&&(f=To(h,a)),e.compute(Co(t,n.cacheKey,[l],i,e.inputs[0].dataType,f,c),{inputs:[l]})},Ao=(e,t)=>{nt(e,"ReduceMeanShared",t,"mean")},Oo=(e,t)=>{nt(e,"ReduceL1Shared",t,"l1")},Mo=(e,t)=>{nt(e,"ReduceL2Shared",t,"l2")},Bo=(e,t)=>{nt(e,"ReduceLogSumExpShared",t,"logSumExp")},No=(e,t)=>{nt(e,"ReduceMaxShared",t,"max")},Ro=(e,t)=>{nt(e,"ReduceMinShared",t,"min")},Do=(e,t)=>{nt(e,"ReduceProdShared",t,"prod")},Po=(e,t)=>{nt(e,"ReduceSumShared",t,"sum")},Uo=(e,t)=>{nt(e,"ReduceSumSquareShared",t,"sumSquare")},qo=(e,t)=>{nt(e,"ReduceLogSumShared",t,"logSum")}}),at,Wo,ii,vn,st,Lo,Vo,Go,Ho,Fo,jo,Ko,Qo,Zo,Yo,ot,Xo,Jo,eu,tu,ru,iu,nu,au,su,ou,xn=L(()=>{se(),ue(),Me(),de(),yg(),at=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Wo=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],ii=(e,t,r,i,n,s,a=!1,u=!1)=>{let l=[],d=r[0].dims,h=d.length,c=B.normalizeAxes(n,h),f=!u&&c.length===0;d.forEach((_,k)=>{f||c.indexOf(k)>=0?a&&l.push(1):l.push(_)});let y=l.length,w=B.size(l);return{name:e,shaderCache:t,getShaderSource:_=>{let k=[],$=P("_A",r[0].dataType,h),b=J("output",s,y),I=i($,b,c),S=I[2];for(let E=0,A=0;E<h;E++)f||c.indexOf(E)>=0?(a&&A++,S=`for(var j${E}: u32 = 0; j${E} < ${d[E]}; j${E}++) {
                  ${I[2].includes("last_index")?`let last_index = j${E};`:""}
                  ${$.indicesSet("input_indices",E,`j${E}`)}
                  ${S}
                }`):(k.push(`${$.indicesSet("input_indices",E,b.indicesGet("output_indices",A))};`),A++);return`

        ${_.registerUniform("output_size","u32").declareVariables($,b)}

        ${_.mainStart()}
          ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${b.offsetToIndices("global_idx")};

          ${k.join(`
`)}
          ${I[0]}       // init ops for reduce max/min
          ${I[1]}
          ${S}
          ${I[3]}
          ${I.length===4?b.setByOffset("global_idx","value"):I.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:s}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:[{type:12,data:w},...te(d,l)]})}},vn=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),be({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},st=(e,t,r,i)=>{let n=e.inputs,s=n.length===1?r:vn(n,r);e.compute(ii(t,{hint:s.cacheKey,inputDependencies:["rank"]},[n[0]],s.noopWithEmptyAxes&&s.axes.length===0?Wo:i,s.axes,n[0].dataType,s.keepDims,s.noopWithEmptyAxes),{inputs:[0]})},Lo=(e,t)=>{at(e.inputs),st(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Vo=(e,t)=>{at(e.inputs),st(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Go=(e,t)=>{at(e.inputs),st(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Ho=(e,t)=>{at(e.inputs),st(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Fo=(e,t)=>{at(e.inputs),st(e,"ReduceMax",t,(r,i,n)=>{let s=[];for(let a=0;a<r.rank;a++)(n.indexOf(a)>=0||n.length===0)&&s.push(r.indicesSet("input_indices",a,0));return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},jo=(e,t)=>{at(e.inputs),st(e,"ReduceMean",t,(r,i,n)=>{let s=1;for(let a=0;a<r.rank;a++)(n.indexOf(a)>=0||n.length===0)&&(s*=e.inputs[0].dims[a]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${s});`]})},Ko=(e,t)=>{at(e.inputs),st(e,"ReduceMin",t,(r,i,n)=>{let s=[];for(let a=0;a<r.rank;a++)(n.indexOf(a)>=0||n.length===0)&&s.push(`input_indices[${a}] = 0;`);return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Qo=(e,t)=>{at(e.inputs),st(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},Zo=(e,t)=>{at(e.inputs),st(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Yo=(e,t)=>{at(e.inputs),st(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},ot=(e,t,r)=>{if(t.length===0)return r;let i=1,n=1;for(let s=0;s<t.length;s++)t.indexOf(s)===-1?i*=e[s]:n*=e[s];return n<32&&i>1024},Xo=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?jo(e,t):Ao(e,t)},Jo=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Vo(e,t):Oo(e,t)},eu=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Go(e,t):Mo(e,t)},tu=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ho(e,t):Bo(e,t)},ru=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Fo(e,t):No(e,t)},iu=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ko(e,t):Ro(e,t)},nu=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Qo(e,t):Do(e,t)},au=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Zo(e,t):Po(e,t)},su=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Yo(e,t):Uo(e,t)},ou=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Lo(e,t):qo(e,t)}}),kn,uu,lu,Sn,wg=L(()=>{se(),Me(),xn(),kn=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},uu=(e,t)=>{kn(e.inputs);let r=(i,n,s)=>{let a=[];for(let u=0;u<i.rank;u++)(s.indexOf(u)>=0||s.length===0)&&a.push(`input_indices[${u}] = 0;`);return[`${a.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ii("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},lu=(e,t)=>{kn(e.inputs);let r=(i,n,s)=>{let a=[];for(let u=0;u<i.rank;u++)(s.indexOf(u)>=0||s.length===0)&&a.push(`input_indices[${u}] = 0;`);return[`${a.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ii("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Sn=e=>be(e)}),du,ni,pu,cu,hu,Tr,fu,mu,In=L(()=>{se(),ue(),mn(),de(),du=(e,t)=>{let r=e[0],i=e[1],n=e[2],s=e[3],a=e[4],u=e[5];if(a&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],h=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==h)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let c=n.dims[0]/3,f=c,y=f;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let I of t.qkvHiddenSizes)if(I%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");c=t.qkvHiddenSizes[0],f=t.qkvHiddenSizes[1],y=t.qkvHiddenSizes[2]}let w=d;if(c!==f)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==c+f+y)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let _=0;if(a){if(f!==y)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(a.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(a.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(a.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(a.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(a.dims[4]!==f/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(_=a.dims[3])}let k=w+_,$=-1,b=0;if(s)throw new Error("Mask not supported");if(a)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==d||u.dims[3]!==k)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:_,kvSequenceLength:w,totalSequenceLength:k,maxSequenceLength:$,inputHiddenSize:h,hiddenSize:c,vHiddenSize:y,headSize:Math.floor(c/t.numHeads),vHeadSize:Math.floor(y/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},ni=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,pu=(e,t,r,i,n,s,a,u)=>{let l=Oe(a?1:s),d=64,h=s/l;h<d&&(d=32);let c=Math.ceil(s/l/d),f=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:h},{type:12,data:c}],y=De(e.dataType,l),w=Le(1,l),_=["type"];a&&_.push("type"),u&&_.push("type");let k=$=>{let b=J("x",e.dataType,e.dims,l),I=[b],S=a?P("seq_lens",a.dataType,a.dims):void 0;S&&I.push(S);let E=u?P("total_sequence_length_input",u.dataType,u.dims):void 0;E&&I.push(E);let A=Le(e.dataType),O=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${$.registerUniforms(O).declareVariables(...I)}
  ${$.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${ni(S,E,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${a?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${w}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${w}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${w}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${w}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${b.type.value}(${A}(1.0) / ${A}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${w}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${a?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${b.type.value}(${A}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${y};${l}`,inputDependencies:_},getShaderSource:k,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:f})}},cu=(e,t,r,i,n,s,a,u,l)=>{let d=a+s.kvSequenceLength,h=[s.batchSize,s.numHeads,s.sequenceLength,d],c=e>1&&i,f=s.kvNumHeads?s.kvNumHeads:s.numHeads,y=c?[s.batchSize,f,d,s.headSize]:void 0,w=s.nReps?s.nReps:1,_=s.scale===0?1/Math.sqrt(s.headSize):s.scale,k=Oe(s.headSize),$=s.headSize/k,b=12,I={x:Math.ceil(d/b),y:Math.ceil(s.sequenceLength/b),z:s.batchSize*s.numHeads},S=[{type:12,data:s.sequenceLength},{type:12,data:$},{type:12,data:d},{type:12,data:s.numHeads},{type:12,data:s.headSize},{type:1,data:_},{type:12,data:a},{type:12,data:s.kvSequenceLength},{type:12,data:w}],E=c&&i&&B.size(i.dims)>0,A=["type","type"];E&&A.push("type"),n&&A.push("type"),u&&A.push("type"),l&&A.push("type");let O=[{dims:h,dataType:t.dataType,gpuDataType:0}];c&&O.push({dims:y,dataType:t.dataType,gpuDataType:0});let x=D=>{let U=P("q",t.dataType,t.dims,k),H=P("key",r.dataType,r.dims,k),K=[U,H];if(E){let G=P("past_key",i.dataType,i.dims,k);K.push(G)}n&&K.push(P("attention_bias",n.dataType,n.dims));let Q=u?P("seq_lens",u.dataType,u.dims):void 0;Q&&K.push(Q);let N=l?P("total_sequence_length_input",l.dataType,l.dims):void 0;N&&K.push(N);let X=J("output",t.dataType,h),Y=[X];c&&Y.push(J("present_key",t.dataType,y,k));let re=Le(1,k),le=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${U.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${U.type.storage}, ${b*b}>;
  ${D.registerUniforms(le).declareVariables(...K,...Y)}
  ${D.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${w===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${w===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${ni(Q,N,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${E&&c?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${c?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${re}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${E&&c?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${c?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${re}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(k){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${k}`)}})()};
        output[outputIdx] = ${X.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${k};${n!==void 0};${i!==void 0};${e}`,inputDependencies:A},getRunData:()=>({outputs:O,dispatchGroup:I,programUniforms:S}),getShaderSource:x}},hu=(e,t,r,i,n,s,a=void 0,u=void 0)=>{let l=s+n.kvSequenceLength,d=n.nReps?n.nReps:1,h=n.vHiddenSize*d,c=e>1&&i,f=n.kvNumHeads?n.kvNumHeads:n.numHeads,y=c?[n.batchSize,f,l,n.headSize]:void 0,w=[n.batchSize,n.sequenceLength,h],_=12,k={x:Math.ceil(n.vHeadSize/_),y:Math.ceil(n.sequenceLength/_),z:n.batchSize*n.numHeads},$=[{type:12,data:n.sequenceLength},{type:12,data:l},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:h},{type:12,data:s},{type:12,data:n.kvSequenceLength},{type:12,data:d}],b=c&&i&&B.size(i.dims)>0,I=["type","type"];b&&I.push("type"),a&&I.push("type"),u&&I.push("type");let S=[{dims:w,dataType:t.dataType,gpuDataType:0}];c&&S.push({dims:y,dataType:t.dataType,gpuDataType:0});let E=A=>{let O=P("probs",t.dataType,t.dims),x=P("v",r.dataType,r.dims),D=[O,x];b&&D.push(P("past_value",i.dataType,i.dims));let U=a?P("seq_lens",a.dataType,a.dims):void 0;a&&D.push(U);let H=u?P("total_sequence_length_input",u.dataType,u.dims):void 0;u&&D.push(H);let K=[J("output",t.dataType,w)];c&&K.push(J("present_value",t.dataType,y));let Q=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${_}u;
  var<workgroup> tileQ: array<${O.type.value}, ${_*_}>;
  var<workgroup> tileV: array<${O.type.value}, ${_*_}>;
  ${A.registerUniforms(Q).declareVariables(...D,...K)}
  ${A.mainStart([_,_,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${ni(U,H,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${b&&c?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${c?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${O.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${b&&c?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${c?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:I},getRunData:()=>({outputs:S,dispatchGroup:k,programUniforms:$}),getShaderSource:E}},Tr=(e,t,r,i,n,s,a,u,l,d,h=void 0,c=void 0)=>{let f=Math.min(e.outputCount,1+(a?1:0)+(u?1:0)),y=f>1?d.pastSequenceLength:0,w=y+d.kvSequenceLength,_=l&&B.size(l.dims)>0?l:void 0,k=[t,r];f>1&&a&&B.size(a.dims)>0&&k.push(a),_&&k.push(_),h&&k.push(h),c&&k.push(c);let $=e.compute(cu(f,t,r,a,_,d,y,h,c),{inputs:k,outputs:f>1?[-1,1]:[-1]})[0];e.compute(pu($,d.batchSize,d.numHeads,y,d.sequenceLength,w,h,c),{inputs:h&&c?[$,h,c]:[$],outputs:[]});let b=[$,i];f>1&&u&&B.size(u.dims)>0&&b.push(u),h&&b.push(h),c&&b.push(c),e.compute(hu(f,$,i,u,d,y,h,c),{inputs:b,outputs:f>1?[0,2]:[0]})},fu=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,n=t.inputHiddenSize,s=t.headSize,a=12,u={x:Math.ceil(t.headSize/a),y:Math.ceil(t.sequenceLength/a),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:i},{type:12,data:n},{type:12,data:s},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],h=c=>{let f=J("output_q",l[0].dataType,r),y=J("output_k",l[0].dataType,r),w=J("output_v",l[0].dataType,r),_=P("input",l[0].dataType,l[0].dims),k=P("weight",l[1].dataType,l[1].dims),$=P("bias",l[2].dataType,l[2].dims),b=_.type.storage,I=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${a}u;
  var<workgroup> tileInput: array<${b}, ${a*a}>;
  var<workgroup> tileWeightQ: array<${b}, ${a*a}>;
  var<workgroup> tileWeightK: array<${b}, ${a*a}>;
  var<workgroup> tileWeightV: array<${b}, ${a*a}>;
  ${c.registerUniforms(I).declareVariables(_,k,$,f,y,w)}
  ${c.mainStart([a,a,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${b}(0);
    var valueK = ${b}(0);
    var valueV = ${b}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:d}),getShaderSource:h},{inputs:l,outputs:[-1,-1,-1]})},mu=(e,t)=>{let r=du(e.inputs,t),[i,n,s]=fu(e,r);return Tr(e,i,n,s,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),gu,yu,wu,_u,_g=L(()=>{Xe(),se(),ue(),Me(),de(),gu=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,n,s)=>{let a=n.length;if(a!==i.length)throw new Error(`${s}: num dimensions != ${a}`);n.forEach((u,l)=>{if(u!==i[l])throw new Error(`${s}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},yu=(e,t)=>{let{epsilon:r,spatial:i,format:n}=t,s=e[0].dims,a=i?Oe(s[s.length-1]):1,u=n==="NHWC"&&s.length>1?a:1,l=B.size(s)/a,d=i,h=d?s.length:s,c=P("x",e[0].dataType,e[0].dims,a),f=P("scale",e[1].dataType,e[1].dims,u),y=P("bias",e[2].dataType,e[2].dims,u),w=P("inputMean",e[3].dataType,e[3].dims,u),_=P("inputVar",e[4].dataType,e[4].dims,u),k=J("y",e[0].dataType,h,a),$=()=>{let I="";if(i)I=`let cOffset = ${s.length===1?"0u":n==="NHWC"?`outputIndices[${s.length-1}] / ${a}`:"outputIndices[1]"};`;else if(n==="NCHW")I=`
            ${k.indicesSet("outputIndices","0","0")}
            let cOffset = ${k.indicesToOffset("outputIndices")};`;else{I=`var cIndices = ${f.type.indices}(0);
                       cIndices[0] = outputIndices[${s.length-1}];`;for(let S=1;S<f.rank;S++)I+=`cIndices[${S}] = outputIndices[${S}];`;I+=`let cOffset = ${f.indicesToOffset("cIndices")};`}return I},b=I=>`
  const epsilon = ${r};
  ${I.registerUniform("outputSize","u32").declareVariables(c,f,y,w,_,k)}
  ${I.mainStart()}
  ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${k.offsetToIndices(`global_idx * ${a}`)};
    ${$()}
    let scale = ${f.getByOffset("cOffset")};
    let bias = ${y.getByOffset("cOffset")};
    let inputMean = ${w.getByOffset("cOffset")};
    let inputVar = ${_.getByOffset("cOffset")};
    let x = ${c.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${k.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${a}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...te(s)]:[{type:12,data:l}]})}},wu=e=>be(e),_u=(e,t)=>{let{inputs:r,outputCount:i}=e,n=wu({...t,outputCount:i});if(Ee.webgpu.validateInputContent&&gu(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(yu(r,n))}}),bu,$u,vu,bg=L(()=>{ue(),de(),bu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},$u=e=>{let t=e[0].dims,r=e[0].dims[2],i=B.size(t)/4,n=e[0].dataType,s=P("input",n,t,4),a=P("bias",n,[r],4),u=P("residual",n,t,4),l=J("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(s,a,u,l)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${s.getByOffset("global_idx")}
      + ${a.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},vu=e=>{bu(e.inputs),e.compute($u(e.inputs))}}),xu,_e,ku,Su,Iu,Tu,Eu,zu,Cu,Au,Ou,Mu,Bu,Nu,Ru,Du,Er,Pu,ai,Uu,qu,Wu,Lu,Vu,Gu,Hu,Fu,ju,Ku,Qu,Zu,Yu,Xu,Ju,el,Tn,tl,En,zn,rl,il,nl,al,sl,ol,Cn=L(()=>{se(),ue(),Me(),de(),xu=(e,t,r,i,n,s,a)=>{let u=Math.ceil(t/4),l="";typeof n=="string"?l=`${n}(a)`:l=n("a");let d=P("inputData",r,[u],4),h=J("outputData",i,[u],4),c=[{name:"vec_size",type:"u32"}];return a&&c.push(...a),`
      ${e.registerUniforms(c).declareVariables(d,h)}

  ${s??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${h.setByOffset("global_idx",l)}
  }`},_e=(e,t,r,i,n,s=e.dataType,a,u)=>{let l=[{type:12,data:Math.ceil(B.size(e.dims)/4)}];return a&&l.push(...a),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:d=>xu(d,B.size(e.dims),e.dataType,s,r,i,u),getRunData:d=>({outputs:[{dims:e.dims,dataType:s}],dispatchGroup:{x:Math.ceil(B.size(d[0].dims)/64/4)},programUniforms:l})}},ku=e=>{e.compute(_e(e.inputs[0],"Abs","abs"))},Su=e=>{e.compute(_e(e.inputs[0],"Acos","acos"))},Iu=e=>{e.compute(_e(e.inputs[0],"Acosh","acosh"))},Tu=e=>{e.compute(_e(e.inputs[0],"Asin","asin"))},Eu=e=>{e.compute(_e(e.inputs[0],"Asinh","asinh"))},zu=e=>{e.compute(_e(e.inputs[0],"Atan","atan"))},Cu=e=>{e.compute(_e(e.inputs[0],"Atanh","atanh"))},Au=e=>be(e),Ou=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(_e(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Mu=e=>{let t,r,i=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return be({min:t,max:r})},Bu=(e,t)=>{let r=t||Mu(e.inputs),i=Le(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},Nu=e=>{e.compute(_e(e.inputs[0],"Ceil","ceil"))},Ru=e=>{e.compute(_e(e.inputs[0],"Cos","cos"))},Du=e=>{e.compute(_e(e.inputs[0],"Cosh","cosh"))},Er=e=>be(e),Pu=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},ai=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Uu=e=>{let t=Le(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,ai(t)))},qu=e=>{e.compute(_e(e.inputs[0],"Exp","exp"))},Wu=e=>{e.compute(_e(e.inputs[0],"Floor","floor"))},Lu=e=>{let t=Le(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,ai(t)))},Vu=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Gu=e=>{e.compute(_e(e.inputs[0],"Not",t=>`!${t}`))},Hu=e=>{e.compute(_e(e.inputs[0],"Neg",t=>`-${t}`))},Fu=e=>{e.compute(_e(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},ju=e=>{let t=Le(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},Ku=e=>{e.compute(_e(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Qu=e=>be(e),Zu=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},Yu=e=>{e.compute(_e(e.inputs[0],"Sin","sin"))},Xu=e=>{e.compute(_e(e.inputs[0],"Sinh","sinh"))},Ju=e=>{e.compute(_e(e.inputs[0],"Sqrt","sqrt"))},el=e=>{e.compute(_e(e.inputs[0],"Tan","tan"))},Tn=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,tl=e=>{e.compute(_e(e.inputs[0],"Tanh",Tn))},En=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Tn("v")};
}
`,zn=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,rl=e=>{let t=Le(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"FastGelu",zn,En(t),void 0,e.inputs[0].dataType))},il=(e,t)=>{let r=Le(e.inputs[0].dataType);return e.compute(_e(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},nl=e=>{e.compute(_e(e.inputs[0],"Log","log"))},al=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,sl=e=>`quick_gelu_impl(${e})`,ol=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"QuickGelu",sl,al(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),ul,ll,dl,$g=L(()=>{ue(),de(),Cn(),ul=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},ll=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=P("input",e[0].dataType,e[0].dims,4),i=P("bias",e[0].dataType,[e[0].dims[2]],4),n=J("output",e[0].dataType,t,4),s=B.size(t)/4,a=De(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,i,n)}

  ${ai(a)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(s)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},dl=e=>{ul(e.inputs),e.compute(ll(e.inputs))}}),pl,cl,ut,hl,fl,ml,gl,yl,wl,_l,bl,$l,vl,vg=L(()=>{se(),ue(),de(),pl=(e,t,r,i,n,s,a,u,l,d,h,c)=>{let f,y;typeof u=="string"?f=y=(b,I)=>`${u}((${b}),(${I}))`:typeof u=="function"?f=y=u:(f=u.scalar,y=u.vector);let w=J("outputData",h,i.length,4),_=P("aData",l,t.length,4),k=P("bData",d,r.length,4),$;if(n)if(s){let b=B.size(t)===1,I=B.size(r)===1,S=t.length>0&&t[t.length-1]%4===0,E=r.length>0&&r[r.length-1]%4===0;b||I?$=w.setByOffset("global_idx",y(b?`${_.type.value}(${_.getByOffset("0")}.x)`:_.getByOffset("global_idx"),I?`${k.type.value}(${k.getByOffset("0")}.x)`:k.getByOffset("global_idx"))):$=`
            let outputIndices = ${w.offsetToIndices("global_idx * 4u")};
            let offsetA = ${_.broadcastedIndicesToOffset("outputIndices",w)};
            let offsetB = ${k.broadcastedIndicesToOffset("outputIndices",w)};
            ${w.setByOffset("global_idx",y(a||S?_.getByOffset("offsetA / 4u"):`${_.type.value}(${_.getByOffset("offsetA / 4u")}[offsetA % 4u])`,a||E?k.getByOffset("offsetB / 4u"):`${k.type.value}(${k.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else $=w.setByOffset("global_idx",y(_.getByOffset("global_idx"),k.getByOffset("global_idx")));else{if(!s)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let b=(I,S,E="")=>{let A=`aData[indexA${S}][componentA${S}]`,O=`bData[indexB${S}][componentB${S}]`;return`
            let outputIndices${S} = ${w.offsetToIndices(`global_idx * 4u + ${S}u`)};
            let offsetA${S} = ${_.broadcastedIndicesToOffset(`outputIndices${S}`,w)};
            let offsetB${S} = ${k.broadcastedIndicesToOffset(`outputIndices${S}`,w)};
            let indexA${S} = offsetA${S} / 4u;
            let indexB${S} = offsetB${S} / 4u;
            let componentA${S} = offsetA${S} % 4u;
            let componentB${S} = offsetB${S} % 4u;
            ${I}[${S}] = ${E}(${f(A,O)});
          `};h===9?$=`
            var data = vec4<u32>(0);
            ${b("data",0,"u32")}
            ${b("data",1,"u32")}
            ${b("data",2,"u32")}
            ${b("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:$=`
            ${b("outputData[global_idx]",0)}
            ${b("outputData[global_idx]",1)}
            ${b("outputData[global_idx]",2)}
            ${b("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(_,k,w)}

        ${c??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${$}
      }`},cl=(e,t,r,i,n,s,a=r.dataType)=>{let u=r.dims.map(Number),l=i.dims.map(Number),d=!B.areEqual(u,l),h=u,c=B.size(u),f=!1,y=!1,w=[d];if(d){let _=pr.calcShape(u,l,!1);if(!_)throw new Error("Can't perform binary op on the given tensors");h=_.slice(),c=B.size(h);let k=B.size(u)===1,$=B.size(l)===1,b=u.length>0&&u[u.length-1]%4===0,I=l.length>0&&l[l.length-1]%4===0;w.push(k),w.push($),w.push(b),w.push(I);let S=1;for(let E=1;E<h.length;E++){let A=u[u.length-E],O=l[l.length-E];if(A===O)S*=A;else break}S%4===0?(y=!0,f=!0):(k||$||b||I)&&(f=!0)}else f=!0;return w.push(f),{name:e,shaderCache:{hint:t+w.map(_=>_.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:_=>pl(_,u,l,h,f,d,y,n,r.dataType,i.dataType,a,s),getRunData:()=>({outputs:[{dims:h,dataType:a}],dispatchGroup:{x:Math.ceil(c/64/4)},programUniforms:[{type:12,data:Math.ceil(B.size(h)/4)},...te(u,l,h)]})}},ut=(e,t,r,i,n,s)=>{e.compute(cl(t,n??"",e.inputs[0],e.inputs[1],r,i,s))},hl=e=>{ut(e,"Add",(t,r)=>`${t}+${r}`)},fl=e=>{ut(e,"Div",(t,r)=>`${t}/${r}`)},ml=e=>{ut(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},gl=e=>{ut(e,"Mul",(t,r)=>`${t}*${r}`)},yl=e=>{let t=P("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;ut(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},wl=e=>{ut(e,"Sub",(t,r)=>`${t}-${r}`)},_l=e=>{ut(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},bl=e=>{ut(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},$l=e=>{ut(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},vl=e=>{ut(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),xl,kl,Sl,Il,Tl,El,xg=L(()=>{se(),ue(),Me(),de(),xl=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],n=i.dataType,s=i.dims.length;e.forEach((a,u)=>{if(u!==r){if(a.dataType!==n)throw new Error("input tensors should be one type");if(a.dims.length!==s)throw new Error("input tensors should have the same shape");a.dims.forEach((l,d)=>{if(d!==t&&l!==i.dims[d])throw new Error("non concat dimensions must match")})}})},kl=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,Sl=(e,t)=>{let r=e.length,i=[];for(let n=0;n<r;++n){let s=t.setByOffset("global_idx",e[n].getByIndices("indices"));r===1?i.push(s):n===0?i.push(`if (inputIndex == ${n}u) { ${s} }`):n===r-1?i.push(`else { ${s} }`):i.push(`else if (inputIndex == ${n}) { ${s} }`)}return i.join(`
`)},Il=(e,t,r,i)=>{let n=B.size(r),s=new Array(e.length),a=new Array(e.length),u=0,l=[],d=[],h=[{type:12,data:n}];for(let _=0;_<e.length;++_)u+=e[_].dims[t],s[_]=u,d.push(e[_].dims.length),a[_]=P(`input${_}`,i,d[_]),l.push("rank"),h.push({type:12,data:s[_]});for(let _=0;_<e.length;++_)h.push(...te(e[_].dims));h.push(...te(r));let c=J("output",i,r.length),f=c.indicesGet("indices",t),y=Array.from(Array(s.length).keys()).map(_=>`uniforms.sizeInConcatAxis${_}`).join(","),w=_=>`

  ${(()=>{_.registerUniform("outputSize","u32");for(let k=0;k<e.length;k++)_.registerUniform(`sizeInConcatAxis${k}`,"u32");return _.declareVariables(...a,c)})()}

  ${kl(s.length,y)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${c.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${f});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${s.length}u>(${y});
      ${f} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Sl(a,c)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:h}),getShaderSource:w}},Tl=(e,t)=>{let r=e.inputs,i=r[0].dims,n=B.normalizeAxis(t.axis,i.length);xl(r,n);let s=i.slice();s[n]=r.reduce((u,l)=>u+(l.dims.length>n?l.dims[n]:0),0);let a=r.filter(u=>B.size(u.dims)>0);e.compute(Il(a,n,s,r[0].dataType),{inputs:a})},El=e=>be({axis:e.axis})}),Yt,Xt,Jt,An,er=L(()=>{se(),ue(),Yt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Xt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Jt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},An=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,i]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=(e==null?void 0:e.activation_params)||[Zs,Ys];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Ue,zl,On=L(()=>{Ue=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},zl=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Cl,kg=L(()=>{Cl=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),zr,Mn,Bn=L(()=>{se(),ue(),de(),er(),zr=(e,t,r,i,n)=>{let s=i-r;return`
      ${Array.from({length:r}).map((a,u)=>`
      if (${ee(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,ee(n,u+s,i))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},Mn=(e,t,r,i,n=!1,s)=>{let a=e[0].dims,u=e[1].dims,l=a[a.length-2],d=u[u.length-1],h=a[a.length-1],c=Oe(d),f=Oe(h),y=Oe(l),w=B.size(r)/c/y,_=e.length>2,k=i?i.slice(0,-2):r.slice(0,-2),$=[B.size(k),l,d],b=[{type:12,data:w},{type:12,data:l},{type:12,data:d},{type:12,data:h}];Xt(t,b),b.push(...te(k,a,u)),_&&b.push(...te(e[2].dims)),b.push(...te($));let I=S=>{let E=bn("batch_dims",e[0].dataType,k.length),A=P("a",e[0].dataType,a.length,f),O=P("b",e[1].dataType,u.length,c),x=J("output",e[0].dataType,$.length,c),D=De(x.type.tensor),U=Yt(t,x.type.value,D),H=[A,O],K="";if(_){let X=n?c:1;H.push(P("bias",e[2].dataType,e[2].dims.length,X)),K=`${n?`value += bias[col / ${X}];`:`value += ${x.type.value}(bias[row + i]);`}`}let Q=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Jt(t,Q);let N=()=>{let X=`var a_data: ${A.type.value};`;for(let Y=0;Y<f;Y++)X+=`
              let b_data${Y} = b[(b_offset + (k + ${Y}) * uniforms.N + col) / ${c}];`;for(let Y=0;Y<y;Y++){X+=`a_data = a[(a_offset + (row + ${Y}) * uniforms.K + k) / ${f}];`;for(let re=0;re<f;re++)X+=`
            values[${Y}] = fma(${O.type.value}(a_data${f===1?"":`[${re}]`}), b_data${re}, values[${Y}]);
`}return X};return`
  ${S.registerUniforms(Q).registerInternalVariables(E).declareVariables(...H,x)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${c})) * ${c};
    var index1 = global_idx / (uniforms.N / ${c});
    let stride1 = uniforms.M / ${y};
    let row = (index1 % stride1) * ${y};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${E.offsetToIndices("batch")};`}

    var a_indices: ${A.type.indices};
    ${zr("a_indices",A,A.rank-2,E.rank,"batch_indices")}
    ${A.indicesSet("a_indices",A.rank-2,0)}
    ${A.indicesSet("a_indices",A.rank-1,0)}
    let a_offset = ${A.indicesToOffset("a_indices")};

    var b_indices: ${O.type.indices};
    ${zr("b_indices",O,O.rank-2,E.rank,"batch_indices")}
    ${O.indicesSet("b_indices",O.rank-2,0)}
    ${O.indicesSet("b_indices",O.rank-1,0)}
    let b_offset = ${O.indicesToOffset("b_indices")};
    var values: array<${x.type.value}, ${y}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${f}) {
      ${N()}
    }
    for (var i = 0u; i < ${y}u; i++) {
      var value = values[i];
      ${K}
      ${U}
      let cur_indices = ${x.type.indices}(batch, row + i, col);
      let offset = ${x.indicesToOffset("cur_indices")};
      ${x.setByOffset(`offset / ${c}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${c};${f};${y};${n}`,inputDependencies:_?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:b}),getShaderSource:I}}}),Al,Ol,Nn,Rn,Ml,Dn,Bl,si,Pn=L(()=>{se(),ue(),de(),er(),Bn(),On(),Al=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Ol=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Nn=(e,t,r="f32",i,n=!1,s=32,a=!1,u=32)=>{let l=t[1]*e[1],d=t[0]*e[0],h=n?l:s,c=n?s:l,f=h/t[0],y=s/t[1];if(!((n&&f===4&&e[1]===4||!n&&(f===3||f===4))&&h%t[0]===0&&s%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${f} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${f} must be 3 or 4.
  tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}. tileInner ${s} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${f}<${r}>, ${h/f}>, ${c}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${s}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${f};
const tileInner = ${s};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${a?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${a?`${Math.ceil(u/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${a?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${y};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Al(n,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${f===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Ol(n,f)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Rn=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Ml=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Dn=(e,t,r="f32",i,n=!1,s=32,a=!1,u=32,l=!1)=>{let d=e[1]*t[1],h=e[0]*t[0],c=n?d:s,f=n?s:d;if(!(f%t[1]===0&&c%t[0]===0&&s%t[1]===0))throw new Error(`tileAHight ${f} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}, tileInner ${s} must be divisible by workgroupSize[1]${t[1]}`);let y=f/t[1],w=c/t[0],_=s/t[1],k=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${h};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${f}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          ${Rn(n,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${s}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${n?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${y};
let tileColA = i32(localId.x) * ${w};
let tileRowB = i32(localId.y) * ${_};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${w}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Rn(n,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Ml(n)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${c}>, ${f}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${h}>, ${s}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${s};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${a?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${a?`${Math.ceil(u/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${a?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${k}
  }
`},Bl=(e,t,r,i,n=!1)=>{let[s,a,u,l]=i,d=De(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${Ue(e,d)} {
      var value = ${Ue(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${a.type.indices};
        ${zr("aIndices",a,a.rank-2,s.rank,"batchIndices")}
        ${a.indicesSet("aIndices",a.rank-2,"u32(row)")}
        ${a.indicesSet("aIndices",a.rank-1,"u32(colIn)")}
        value = ${a.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${Ue(e,d)} {
      var value = ${Ue(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${zr("bIndices",u,u.rank-2,s.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ue(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${Ue(e,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},si=(e,t,r,i,n=!1,s)=>{let a=e[0].dims,u=e[1].dims,l=a.slice(0,-2),d=u.slice(0,-2),h=i?i.slice(0,-2):r.slice(0,-2),c=B.size(h),f=a[a.length-2],y=a[a.length-1],w=u[u.length-1],_=y%4===0&&w%4===0,k=f<=8?[4,1,1]:[4,4,1],$=[8,8,1],b=[Math.ceil(w/$[0]/k[0]),Math.ceil(f/$[1]/k[1]),Math.ceil(c/$[2]/k[2])],I=_?4:1,S=[...l,f,y/I],E=S.length,A=[...d,y,w/I],O=A.length,x=[c,f,w/I],D=[{type:6,data:f},{type:6,data:w},{type:6,data:y}];Xt(t,D),D.push(...te(h,S,A));let U=["rank","rank"],H=e.length>2;H&&(D.push(...te(e[2].dims)),U.push("rank")),D.push(...te(x));let K=Q=>{let N=h.length,X=bn("batchDims",e[0].dataType,N,1),Y=De(e[0].dataType),re=P("a",e[0].dataType,E,I),le=P("b",e[1].dataType,O,I),G=J("result",e[0].dataType,x.length,I),xe=[re,le];if(H){let ke=n?I:1;xe.push(P("bias",e[2].dataType,e[2].dims.length,ke))}let W=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Jt(t,W);let q=De(G.type.tensor),ie=Yt(t,G.type.value,q),ne=Bl(I,H,ie,[X,re,le,G],n);return`
  ${Q.registerUniforms(W).registerInternalVariables(X).declareVariables(...xe,G)}
  ${ne}
  ${_?Nn(k,$,Y,X):Dn(k,$,Y,X)}
                   `};return{name:"MatMul",shaderCache:{hint:`${k};${t.activation};${_};${n}`,inputDependencies:U},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:D}),getShaderSource:K}}}),Nl,Rl,Sg=L(()=>{se(),xt(),de(),er(),On(),kg(),Pn(),Nl=(e,t,r,i,n=!1,s,a=4,u=4,l=4,d="f32")=>{let h=D=>{switch(D){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${D} is not supported.`)}},c=D=>{switch(D){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${D} is not supported.`)}},f=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,y=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,w=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",_=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",k=e?"row":"col",$=e?"col":"row",b=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${k} / outWidth;
    let outCol = ${k} % outWidth;

    let WRow = ${$} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${$} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${$} % inChannels;
    var resData = ${Ue(a,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${w} && xCol >= 0 && xCol < ${_}) {
      ${f}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${h(a)}
    }
    return resData;`,I=e?t&&i?`
    let col = colIn * ${a};
    ${b}`:`
    let col = colIn * ${a};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${b}
    }
    return ${Ue(a,d)}(0.0);`:i&&r?`
    let col = colIn * ${a};
    ${b}`:`
    let col = colIn * ${a};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${b}
    }
    return ${Ue(a,d)}(0.0);`,S=e?i&&r?c(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${c(u)}
    }
    return ${Ue(u,d)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${c(u)}
    }
    return ${Ue(u,d)}(0.0);`,E=Ue(l,d),A=Ue(e?a:u,d),O=Ue(e?u:a,d),x=Yt(s,E,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?I:S}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${O} {
      ${e?S:I}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${E}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${y}
      ${zl(n)}
      ${x}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Rl=(e,t,r,i,n,s,a,u,l)=>{let d=t.format==="NHWC",h=d?e[0].dims[3]:e[0].dims[1],c=r[0],f=d?r[2]:r[3],y=d?r[1]:r[2],w=d?r[3]:r[1],_=d&&(h%4===0||h%3===0)&&w%4===0,k=d?w:f*y,$=d?f*y:w,b=[8,8,1],I=i<=8?[4,1,1]:[4,4,1],S=[Math.ceil(k/b[0]/I[0]),Math.ceil($/b[1]/I[1]),Math.ceil(c/b[2]/I[2])];ge("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${S}`);let E=_?d&&h%4!==0?3:4:1,A=b[1]*I[1],O=b[0]*I[0],x=Math.max(b[0]*E,b[1]),D=i%A===0,U=n%O===0,H=s%x===0,K=_?[E,4,4]:[1,1,1],Q=[{type:6,data:i},{type:6,data:n},{type:6,data:s},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Xt(t,Q),Q.push(...te(e[0].dims,e[1].dims));let N=["rank","rank"];a&&(Q.push(...te(e[2].dims)),N.push("rank")),Q.push(...te(r));let X=Y=>{let re=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Jt(t,re);let le=_?4:1,G=De(e[0].dataType),xe=`
      fn setOutputAtIndex(flatIndex : i32, value : ${_?`vec4<${G}>`:G}) {
        result[flatIndex] = ${_?`vec4<${G}>`:G}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${_?`vec4<${G}>`:G}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${_?"/ 4":""}, value);
      }`,W=P("x",e[0].dataType,e[0].dims.length,E===3?1:E),q=P("w",e[1].dataType,e[1].dims.length,le),ie=[W,q],ne=J("result",e[0].dataType,r.length,le);if(a){let ke=P("bias",e[2].dataType,e[2].dims.length,le);ie.push(ke),xe+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${_?`vec4<${G}>`:G} {
          return bias[coords.${d?"w":"y"}${_?"/ 4":""}];
        }`}return`
        ${Cl("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${Y.registerUniforms(re).declareVariables(...ie,ne)}
        ${xe}
        ${Nl(d,D,U,H,a,t,K[0],K[1],K[2],G)}
        ${_?Nn(I,b,G,void 0,!d,x):Dn(I,b,G,void 0,!d,x,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${E};${_};${D};${U};${H};${A};${O};${x}`,inputDependencies:N},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:Q}),getShaderSource:X}}}),Dl,Un,Cr,Pl,qn,Ul,ql,Wl,Ig=L(()=>{se(),xt(),ue(),de(),er(),On(),Dl=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Un=e=>typeof e=="number"?[e,e,e]:e,Cr=(e,t)=>t<=1?e:e+(e-1)*(t-1),Pl=(e,t,r,i=1)=>{let n=Cr(t,i);return Math.floor((e[0]*(r-1)-r+n)/2)},qn=(e,t,r,i,n)=>{n==null&&(n=Pl(e,t[0],i[0]));let s=[0,0,0,r];for(let a=0;a<3;a++)e[a]+2*n>=t[a]&&(s[a]=Math.trunc((e[a]-t[a]+2*n)/i[a]+1));return s},Ul=(e,t,r,i,n,s,a,u,l,d)=>{let h,c,f,y;if(e==="VALID"&&(e=0),typeof e=="number"){h={top:e,bottom:e,left:e,right:e,front:e,back:e};let w=qn([t,r,i,1],[u,l,d],1,[n,s,a],e);c=w[0],f=w[1],y=w[2]}else if(Array.isArray(e)){if(!e.every((_,k,$)=>_===$[0]))throw Error(`Unsupported padding parameter: ${e}`);h={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let w=qn([t,r,i,1],[u,l,d],1,[n,s,a],e[0]);c=w[0],f=w[1],y=w[2]}else if(e==="SAME_UPPER"){c=Math.ceil(t/n),f=Math.ceil(r/s),y=Math.ceil(i/a);let w=(c-1)*n+u-t,_=(f-1)*s+l-r,k=(y-1)*a+d-i,$=Math.floor(w/2),b=w-$,I=Math.floor(_/2),S=_-I,E=Math.floor(k/2),A=k-E;h={top:I,bottom:S,left:E,right:A,front:$,back:b}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:h,outDepth:c,outHeight:f,outWidth:y}},ql=(e,t,r,i,n,s=!1,a="channelsLast")=>{let u,l,d,h,c;if(a==="channelsLast")[u,l,d,h,c]=e;else if(a==="channelsFirst")[u,c,l,d,h]=e;else throw new Error(`Unknown dataFormat ${a}`);let[f,,y,w,_]=t,[k,$,b]=Un(r),[I,S,E]=Un(i),A=Cr(y,I),O=Cr(w,S),x=Cr(_,E),{padInfo:D,outDepth:U,outHeight:H,outWidth:K}=Ul(n,l,d,h,k,$,b,A,O,x),Q=s?f*c:f,N=[0,0,0,0,0];return a==="channelsFirst"?N=[u,Q,U,H,K]:a==="channelsLast"&&(N=[u,U,H,K,Q]),{batchSize:u,dataFormat:a,inDepth:l,inHeight:d,inWidth:h,inChannels:c,outDepth:U,outHeight:H,outWidth:K,outChannels:Q,padInfo:D,strideDepth:k,strideHeight:$,strideWidth:b,filterDepth:y,filterHeight:w,filterWidth:_,effectiveFilterDepth:A,effectiveFilterHeight:O,effectiveFilterWidth:x,dilationDepth:I,dilationHeight:S,dilationWidth:E,inShape:e,outShape:N,filterShape:t}},Wl=(e,t,r,i,n,s)=>{let a=s==="channelsLast";a?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],l={x:r.map((k,$)=>$)},d=[Math.ceil(Dl(l.x.map(k=>r[k]))/u[0]),1,1];ge("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${d}`);let h=1,c=B.size(r),f=[{type:12,data:c},{type:12,data:i},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];Xt(t,f),f.push(...te(e[0].dims,e[1].dims));let y=["rank","rank"],w=e.length===3;w&&(f.push(...te(e[2].dims)),y.push("rank")),f.push(...te(r));let _=k=>{let $=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Jt(t,$);let b=1,I=De(e[0].dataType),S=P("x",e[0].dataType,e[0].dims.length,h),E=P("W",e[1].dataType,e[1].dims.length,b),A=[S,E],O=J("result",e[0].dataType,r.length,b),x="";if(w){let H=P("bias",e[2].dataType,e[2].dims.length,b);A.push(H),x+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${I} {
          return bias[${a?ee("coords",4,5):ee("coords",1,5)}];
        }`}let D=Ue(h,I),U=Yt(t,D,I);return`
            ${x}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${S.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
          ${k.registerUniforms($).declareVariables(...A,O)}
          ${k.mainStart()}
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${O.offsetToIndices("global_idx")};
              let batch = ${ee("coords",0,S.rank)};
              let d2 = ${a?ee("coords",S.rank-1,S.rank):ee("coords",1,S.rank)};
              let xFRCCorner = vec3<u32>(${a?ee("coords",1,S.rank):ee("coords",2,S.rank)},
              ${a?ee("coords",2,S.rank):ee("coords",3,S.rank)},
              ${a?ee("coords",3,S.rank):ee("coords",4,S.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${a?ee("uniforms.x_shape",1,S.rank):ee("uniforms.x_shape",2,S.rank)};
              let xShapeZ = ${a?ee("uniforms.x_shape",2,S.rank):ee("uniforms.x_shape",3,S.rank)};
              let xShapeW = ${a?ee("uniforms.x_shape",3,S.rank):ee("uniforms.x_shape",4,S.rank)};
              let xShapeU = ${a?ee("uniforms.x_shape",4,S.rank):ee("uniforms.x_shape",1,S.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${a?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${a?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${a?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${a?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${w?"value = value + getBiasByOutputCoords(coords)":""};
              ${U}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${a};${h};${w}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:d[0],y:d[1],z:d[2]},programUniforms:f}),getShaderSource:_}}}),Ll,Vl,Tg=L(()=>{se(),ue(),de(),er(),Ll=(e,t,r,i)=>{let n=e.length>2,s=n?"value += b[output_channel];":"",a=e[0].dims,u=e[1].dims,l=t.format==="NHWC",d=l?r[3]:r[1],h=d/t.group,c=l&&h>=4?Oe(d):1,f=B.size(r)/c,y=[{type:12,data:f},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:h}];Xt(t,y),y.push(...te(a,[u[0],u[1],u[2],u[3]/c]));let w=n?["rank","rank","rank"]:["rank","rank"];y.push(...te([r[0],r[1],r[2],r[3]/c]));let _=k=>{let $=J("output",e[0].dataType,r.length,c),b=De($.type.tensor),I=Yt(t,$.type.value,b),S=P("x",e[0].dataType,a.length),E=P("w",e[1].dataType,u.length,c),A=[S,E];n&&A.push(P("b",e[2].dataType,e[2].dims,c));let O=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Jt(t,O);let x=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${S.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${E.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${S.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${E.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${k.registerUniforms(O).declareVariables(...A,$)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${$.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${c} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${$.type.value} = ${$.type.value}(0);
    ${x}
    ${s}
    ${I}
    ${$.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${c}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:y}),getShaderSource:_}},Vl=(e,t,r,i)=>{let n=e.length>2,s=Oe(r[3]),a=Oe(r[2]),u=B.size(r)/s/a,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/s],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/s],h=[r[0],r[1],r[2],r[3]/s],c=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Xt(t,c),c.push(...te(l,d,h));let f=(a-1)*t.strides[1]+d[1],y=w=>{let _=J("output",e[0].dataType,h.length,s),k=De(_.type.tensor),$=Yt(t,_.type.value,k),b=P("x",e[0].dataType,l.length,s),I=P("w",e[1].dataType,d.length,s),S=[b,I];n&&S.push(P("b",e[2].dataType,e[2].dims,s));let E=n?"value += b[output_channel];":"",A=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Jt(t,A),`
  ${w.registerUniforms(A).declareVariables(...S,_)}
  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${a}u;
    let col = (index1 % width1) * ${a}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${b.type.value}, ${f}>;
    var values: array<${_.type.value}, ${a}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${f}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${b.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${b.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${I.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${a}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${a}u; i++) {
      var value = values[i];
      ${E}
      ${$}
      ${_.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${s};${a};${f};${d[0]};${d[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:c}),getShaderSource:y}}}),Gl,oi,Hl,ui,Wn,Ln,Fl,jl,Vn,Eg=L(()=>{ue(),Sg(),Ig(),Pn(),Tg(),er(),Bn(),Nt(),Gl=(e,t,r,i,n,s)=>{let a=e[0],u=e.slice(s?1:2,s?3:4),l=u.length,d=t[0],h=t.slice(2).map((f,y)=>f+(f-1)*(r[y]-1)),c=u.map((f,y)=>f+i[y]+i[y+l]).map((f,y)=>Math.floor((f-h[y]+n[y])/n[y]));return c.splice(0,0,a),c.splice(s?3:1,0,d),c},oi=[2,3,1,0],Hl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},ui=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let s=2;s<t[1].dims.length;++s)r[s-2]===0&&(r[s-2]=t[1].dims[s]);let i=e.pads.slice();Jr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:i}),n},Wn=e=>{let t=An(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,s=e.group,a=e.kernel_shape,u=e.pads,l=e.strides,d=e.w_is_const();return{autoPad:i,format:r,dilations:n,group:s,kernelShape:a,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},Ln=(e,t,r,i)=>{let n=r.format==="NHWC",s=Gl(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let A=[t[0]];if(n){let O=e.kernelCustomData.wT??e.compute(Qe(t[1],oi),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=O),A.push(O)}else A.push(t[1]);t.length===3&&A.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Vl(A,r,s,i),{inputs:A}):e.compute(Ll(A,r,s,i),{inputs:A});return}let a=t.length===3,u=t[0].dims[n?1:2],l=t[0].dims[n?2:3],d=t[0].dims[n?3:1],h=t[1].dims[2],c=t[1].dims[3],f=s[n?1:2],y=s[n?2:3],w=s[n?3:1],_=n&&h===u&&c===l&&r.pads[0]===0&&r.pads[1]===0;if(_||h===1&&c===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let A=s[0],O,x,D,U=[];if(n){let Q=e.kernelCustomData.wT??e.compute(Qe(t[1],oi),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=Q),_){let N=u*l*d;O=t[0].reshape([1,A,N]),x=Q.reshape([1,N,w]),D=[1,A,w]}else O=t[0].reshape([A,u*l,d]),x=Q.reshape([1,d,w]),D=[A,f*y,w];U.push(O),U.push(x)}else O=t[0].reshape([A,d,u*l]),x=t[1].reshape([1,w,d]),D=[A,w,f*y],U.push(x),U.push(O);a&&U.push(t[2]);let H=D[2],K=U[0].dims[U[0].dims.length-1];H<8&&K<8?e.compute(Mn(U,r,s,D,n,i),{inputs:U}):e.compute(si(U,r,s,D,n,i),{inputs:U});return}let k=!0,$=e.kernelCustomData.wT??e.compute(Qe(t[1],oi),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=$);let b=[t[0],$];a&&b.push(t[2]);let I=n?f*y:w,S=n?w:f*y,E=h*c*d;e.compute(Rl(b,r,s,I,S,E,a,k,i),{inputs:b})},Fl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],s=[1].concat(t.strides),a=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=ui({...t,pads:n,strides:s,dilations:a,kernelShape:u},i);Ln(e,i,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},jl=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",n=ui(r,t),s=r.autoPad==="NOTSET"?r.pads:r.autoPad,a=ql(t[0].dims,t[1].dims,r.strides,r.dilations,s,!1,i);e.compute(Wl(t,n,a.outShape,[a.filterDepth,a.filterHeight,a.filterWidth],[a.padInfo.front,a.padInfo.top,a.padInfo.left],i))},Vn=(e,t)=>{if(Hl(e.inputs,t),e.inputs[0].dims.length===3)Fl(e,t);else if(e.inputs[0].dims.length===5)jl(e,e.inputs,t);else{let r=ui(t,e.inputs);Ln(e,e.inputs,r)}}}),Kl,zg=L(()=>{se(),xt(),ue(),de(),Kl=(e,t,r)=>{let i=e.length>2,n=t.outputShape,s=t.format==="NHWC",a=t.group,u=e[1].dims,l=u[2]/a,d=u[3],h=s?Oe(l):1,c=s&&d===1&&l>=4,f=c?Math.floor(l/4)*4:Math.floor(l/h)*h,y=l-f,w=s?Oe(d):1,_=s?d===1?h:w:1,k=B.size(n)/w,$=[Math.ceil(k/64),1,1];ge("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${$}`);let b=["rank","rank"],I=[t.strides[0],t.strides[1]],S=[t.kernelShape[s?1:2],t.kernelShape[s?2:3]],E=[t.dilations[0],t.dilations[1]],A=[S[0]+(t.dilations[0]<=1?0:(t.kernelShape[s?1:2]-1)*(t.dilations[0]-1)),S[1]+(t.dilations[1]<=1?0:(t.kernelShape[s?2:3]-1)*(t.dilations[1]-1))],O=[A[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),A[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],x=[{type:12,data:k},{type:12,data:I},{type:12,data:S},{type:12,data:E},{type:12,data:A},{type:6,data:O},{type:12,data:f},{type:12,data:l},{type:12,data:d},...te(e[0].dims,e[1].dims)];i&&(x.push(...te(e[2].dims)),b.push("rank")),x.push(...te(n));let D=U=>{let H=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:I.length},{name:"filter_dims",type:"u32",length:S.length},{name:"dilations",type:"u32",length:S.length},{name:"effective_filter_dims",type:"u32",length:A.length},{name:"pads",type:"i32",length:O.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],K=De(e[0].dataType),Q=s?1:2,N=s?2:3,X=s?3:1,Y=P("W",e[1].dataType,e[1].dims.length,_),re=P("Dy",e[0].dataType,e[0].dims.length,h),le=[re,Y];i&&le.push(P("bias",e[2].dataType,[n[X]].length,w));let G=J("result",e[0].dataType,n.length,w),xe=()=>{let ie="";if(c)h===4?ie+=`
        let xValue = ${re.getByOffset("x_offset")};
        let wValue = ${Y.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:h===2?ie+=`
          dotProd = dotProd + dot(vec4<${K}>(${re.getByOffset("x_offset")}, ${re.getByOffset("x_offset + 1u")}), vec4<${K}>(${Y.getByOffset("w_offset")}, ${Y.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:h===1&&(ie+=`
          dotProd = dotProd + dot(vec4<${K}>(${re.getByOffset("x_offset")}, ${re.getByOffset("x_offset + 1u")}, ${re.getByOffset("x_offset + 2u")}, ${re.getByOffset("x_offset + 3u")}), vec4<${K}>(${Y.getByOffset("w_offset")}, ${Y.getByOffset("w_offset + 1u")}, ${Y.getByOffset("w_offset + 2u")}, ${Y.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(ie+=`
                  let xValue = ${s?re.getByOffset(`${re.indicesToOffset(`${re.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${h}`):re.get("batch","inputChannel","idyR","idyC")};
        `,h===1)ie+=`
          let w_offset = ${Y.indicesToOffset(`${Y.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${Y.getByOffset(`w_offset / ${_}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let ne=0;ne<h;ne++)ie+=`
            let wValue${ne} = ${Y.getByOffset(`${Y.indicesToOffset(`${Y.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${ne}, wOutChannel)`)} / ${_}`)};
            dotProd = dotProd + xValue[${ne}] * wValue${ne};`;return ie},W=()=>{if(y===0)return"";if(!c)throw new Error(`packInputAs4 ${c} is not true.`);let ie="";if(h===1){ie+="dotProd = dotProd";for(let ne=0;ne<y;ne++)ie+=`
            + ${re.getByOffset(`x_offset + ${ne}`)} * ${Y.getByOffset(`w_offset + ${ne}`)}`;ie+=";"}else if(h===2){if(y!==2)throw new Error(`Invalid inputChannelsRemainder ${y}.`);ie+=`
          let xValue = ${re.getByOffset("x_offset")};
          let wValue = ${Y.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return ie},q=`
            let outputIndices = ${G.offsetToIndices(`global_idx * ${w}`)};
            let batch = ${G.indicesGet("outputIndices",0)};
            let d1 = ${G.indicesGet("outputIndices",X)};
            let r = ${G.indicesGet("outputIndices",Q)};
            let c = ${G.indicesGet("outputIndices",N)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${G.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${K}(dyRCorner) + ${K}(wR)) / ${K}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${K}(uniforms.Dy_shape[${Q}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${K}(dyCCorner) + ${K}(wC)) / ${K}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${K}(uniforms.Dy_shape[${N}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${c?`
                var x_offset = ${re.indicesToOffset(`${re.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${h};
                var w_offset = ${Y.indicesToOffset(`${Y.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${_};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${c?4:h}) {
                  ${xe()}
                  inputChannel = inputChannel + ${c?4:h};
                }
                ${W()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${w}]`:""};
            ${G.setByOffset("global_idx","value")};
          `;return`
    ${U.registerUniforms(H).declareVariables(...le,G)}
      ${U.mainStart()}
      ${U.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${q}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${h}${_}${w}${c}${y}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:$[0],y:$[1],z:$[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:x}),getShaderSource:D}}}),Ql,Zl,Yl,Gn,Xl,Jl,Hn,ed,td,Cg=L(()=>{zg(),er(),Nt(),Ql=(e,t,r,i,n,s)=>(e-1)*t+r+(i-1)*n+1-s,Zl=(e,t,r,i,n)=>{let s=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=s,r[n]=e-s):t==="SAME_LOWER"&&(r[i]=e-s,r[n]=s)},Yl=(e,t,r,i,n,s,a,u,l,d)=>{let h=e.length-2,c=d.length===0;l.length<h&&l.push(...Array(h-l.length).fill(0));let f=e[0],y=t[u?3:1]*n;for(let w=0,_=e.length-h-(u?1:0);w<h;++w,++_){let k=e[_],$=c?k*a[w]:d[w],b=Ql(k,a[w],s[w],t[_],r[w],$);Zl(b,i,s,w,w+h),c&&d.push(a[w]*(k-1)+l[w]+(t[_]-1)*r[w]+1-s[w]-s[w+h])}d.splice(0,0,f),d.splice(u?3:1,0,y)},Gn=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((c,f)=>c*f,1)===0){r.length=0;for(let c=2;c<t[1].dims.length;++c)r.push(t[1].dims[c])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let n=e.pads.slice(),s=e.outputShape.slice(),a=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((c,f)=>c+f,0)===0){let c=t[0].dims.length-2;l=new Array(c).fill(1)}let d=e.strides.slice();if(d.reduce((c,f)=>c+f,0)===0){let c=t[0].dims.length-2;d=new Array(c).fill(1)}Yl(u,r,l,e.autoPad,e.group,n,d,i,a,s);let h=Object.assign({},e);return Object.assign(h,{kernelShape:r,pads:n,outputPadding:a,outputShape:s,dilations:l,strides:d}),h},Xl=e=>{let t=An(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,s=e.group??1,a=e.kernelShape,u=e.pads,l=e.strides,d=e.wIsConst(),h=e.outputPadding,c=e.outputShape;return{autoPad:i,format:r,dilations:n,group:s,kernelShape:a,outputPadding:h,outputShape:c,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},Jl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let s=e[0].dims.length-2;if(t.dilations.reduce((a,u)=>a+u,0)>0&&t.dilations.length!==s)throw new Error(`dilations should be ${s}D`);if(t.strides.reduce((a,u)=>a+u,0)>0&&t.strides.length!==s)throw new Error(`strides should be ${s}D`);if(t.pads.reduce((a,u)=>a+u,0)>0&&t.pads.length!==s*2)throw new Error(`pads should be ${s*2}D`);if(t.outputPadding.length!==s&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${s}D`);if(t.kernelShape.reduce((a,u)=>a+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Hn=(e,t,r,i)=>{let n=e.kernelCustomData.wT??e.compute(Qe(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let s=[t[0],n];t.length===3&&s.push(t[2]),e.compute(Kl(s,r,i),{inputs:s})},ed=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let s=t.dilations;(s.length===0||s[0]===0)&&(s=[1]);let a=t.strides;(a.length===0||a[0]===0)&&(a=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],a=[1].concat(a),s=[1].concat(s),n=[1].concat(n);let l=t.outputPadding;l=[0].concat(l);let d=Gn({...t,pads:u,strides:a,dilations:s,kernelShape:n,outputPadding:l},i);Hn(e,i,d,h=>r?[h[0],h[2],h[3]]:[h[0],h[1],h[3]])},td=(e,t)=>{if(Jl(e.inputs,t),e.inputs[0].dims.length===3)ed(e,t);else{let r=Gn(t,e.inputs);Hn(e,e.inputs,r)}}}),rd,id,nd,Ag=L(()=>{se(),ue(),Me(),de(),rd=(e,t,r,i)=>{let n=B.size(t),s=t.length,a=P("input",e,s),u=J("output",e,s),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=B.normalizeAxis(l,s),h=c=>{let f=` i32(${a.indicesGet("inputIndices","uniforms.axis")}) `,y=ee("uniforms.input_shape","uniforms.axis",s),w=i.reverse?f+(i.exclusive?" + 1":""):"0",_=i.reverse?y:f+(i.exclusive?"":" + 1");return`
                ${c.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(a,u)}
                ${c.mainStart()}
                  ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${w};
                  let last : i32 = ${_};
                  for (var i : i32 = first; i < last; i++) {
                    ${a.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${a.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:d},...te(t,t)]}),getShaderSource:h}},id=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,n=e.inputs[1];e.compute(rd(i,r,n,t),{inputs:[0]})},nd=e=>{let t=e.exclusive===1,r=e.reverse===1;return be({exclusive:t,reverse:r})}}),ad,sd,od,ud,ld,Og=L(()=>{se(),ue(),Me(),de(),ad=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},sd=(e,t,r,i)=>{let n=[];n.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let s=0;s<t;++s)n.push(r.indicesSet("a",e[s],`i[${s}]`));return n.push("return a;}"),n.join(`
`)},od=(e,t)=>{let r,i,n,s,a,u,l=t.format==="NHWC",d=t.blocksize,h=t.mode==="DCR";l?([r,i,n,s]=e.dims,a=h?[r,i,n,d,d,s/d**2]:[r,i,n,s/d**2,d,d],u=h?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,n,s]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],a=h?[r,d,d,s/d**2,i,n]:[r,s/d**2,d,d,i,n],u=h?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let c=e.reshape(a),f=c.dims.length,y=e.dataType,w=P("a",y,f),_=J("output",y,f),k=$=>`
  ${$.registerUniform("output_size","u32").declareVariables(w,_)}

  ${sd(u,f,w,_)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${_.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${_.setByOffset("global_idx",w.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:$=>{let b=l?[r,i*d,n*d,s/d**2]:[r,s/d**2,i*d,n*d],I=B.size(b),S=c.dims,E=B.sortBasedOnPerm(S,u);return{outputs:[{dims:b,dataType:$[0].dataType}],dispatchGroup:{x:Math.ceil(I/64)},programUniforms:[{type:12,data:I},...te(S,E)]}},getShaderSource:k}},ud=(e,t)=>{ad(e.inputs),e.compute(od(e.inputs[0],t))},ld=e=>be({blocksize:e.blocksize,mode:e.mode,format:e.format})}),li,Ar,Fn,dd,pd,cd,hd,jn,fd,md,gd,Mg=L(()=>{se(),ue(),Me(),de(),li="[a-zA-Z]|\\.\\.\\.",Ar="("+li+")+",Fn="^"+Ar+"$",dd="("+Ar+",)*"+Ar,pd="^"+dd+"$",cd=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},hd=class{constructor(e,t){var n;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(pd)))throw new Error("Invalid LHS term");if(r.split(",").forEach((s,a)=>{let u=e[a].dims.slice();if(!s.match(RegExp(Fn)))throw new Error("Invalid LHS term");let l=this.processTerm(s,!0,u,a);this.lhs.push(l)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([s,a])=>a.count===1||s==="...").map(([s])=>s).join("");else if(!i.match(RegExp(Ar)))throw new Error("Invalid RHS");(n=i.match(RegExp(li,"g")))==null||n.forEach(s=>{if(s==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let a=this.symbolToInfo.get(s);if(a===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(a.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let n=r.length,s=!1,a=[],u=0;if(!e.match(RegExp(Fn))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(li,"g")),d=new cd(i);return l==null||l.forEach((h,c)=>{if(h==="..."){if(s)throw new Error("Only one ellipsis is allowed per input term");s=!0;let f=n-l.length+1;if(f<0)throw new Error("Ellipsis out of bounds");if(a=r.slice(u,u+f),this.hasEllipsis){if(this.ellipsisDims.length!==a.length||this.ellipsisDims.toString()!==a.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=a;else throw new Error("Ellipsis must be specified in the LHS");for(let y=0;y<a.length;y++){let w=String.fromCharCode(48+y);d.addSymbol(w,c+y),this.addSymbol(w,r[u++],i)}}else d.addSymbol(h,c+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(h,r[u++],i)}),d}},jn=e=>e+"_max",fd=(e,t,r,i)=>{let n=e.map(d=>d.length).map((d,h)=>P(`input${h}`,t,d)),s=B.size(i),a=J("output",t,i.length),u=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),l=d=>{let h=[],c="var prod = 1.0;",f="var sum = 0.0;",y="sum += prod;",w=[],_=[],k=[],$=[],b=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((S,E)=>{var A;if(r.rhs.symbolToIndices.has(E)){let O=(A=r.rhs.symbolToIndices.get(E))==null?void 0:A[0];O!==void 0&&r.lhs.forEach((x,D)=>{if(S.inputIndices.includes(D)){let U=x.symbolToIndices.get(E);if(U===void 0)throw new Error("Invalid symbol error");U.forEach(H=>{h.push(`${n[D].indicesSet(`input${D}Indices`,H,a.indicesGet("outputIndices",O))}`)})}})}else r.lhs.forEach((O,x)=>{if(S.inputIndices.includes(x)){let D=O.symbolToIndices.get(E);if(D===void 0)throw new Error("Invalid symbol error");D.forEach(U=>{w.push(`${n[x].indicesSet(`input${x}Indices`,U,`${E}`)}`)}),$.push(`prod *= ${n[x].getByIndices(`input${x}Indices`)};`)}}),_.push(`for(var ${E}: u32 = 0; ${E} < uniforms.${jn(E)}; ${E}++) {`),k.push("}")});let I=b?[...h,`let sum = ${n.map((S,E)=>S.getByIndices(`input${E}Indices`)).join(" * ")};`]:[...h,f,..._,...w,c,...$,y,...k];return`
            ${d.registerUniforms(u.map(S=>({name:`${jn(S)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,a)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${a.offsetToIndices("global_idx")};
            ${n.map((S,E)=>`var input${E}Indices: ${n[E].type.indices};`).join(`
`)}
            ${I.join(`
`)};
            ${a.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=u.filter(c=>r.symbolToInfo.has(c)).map(c=>{var f;return{type:12,data:((f=r.symbolToInfo.get(c))==null?void 0:f.dimValue)||0}});d.push({type:12,data:s});let h=e.map((c,f)=>[...te(c)]).reduce((c,f)=>c.concat(f),d);return h.push(...te(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:h}},getShaderSource:l}},md=(e,t)=>{let r=new hd(e.inputs,t.equation),i=r.outputDims,n=e.inputs.map((s,a)=>s.dims);e.compute(fd(n,e.inputs[0].dataType,r,i))},gd=e=>{let t=e.equation.replace(/\s+/g,"");return be({equation:t})}}),yd,Kn,wd,_d,bd,Bg=L(()=>{se(),ue(),de(),yd=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;i<r.length&&n<t.length;++i,++n)if(r[i]!==t[n]&&r[i]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Kn=(e,t)=>{let r=e.length-t.length,i=[];for(let n=0;n<r;++n)i.push(e[n]);for(let n=0;n<t.length;++n)i.push(t[n]===1?e[n+r]:t[n]);return i},wd=(e,t)=>e.length>t.length?Kn(e,t):Kn(t,e),_d=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=wd(t,r),n=e[0].dataType,s=n===9||B.size(t)===1,a=n===9||t.length>0&&t[t.length-1]%4===0?4:1,u=s||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(B.size(i)/u),d=c=>{let f=P("input",n,t.length,a),y=J("output",n,i.length,u),w;if(n===9){let _=(k,$,b="")=>`
          let outputIndices${$} = ${y.offsetToIndices(`outputOffset + ${$}u`)};
          let offset${$} = ${f.broadcastedIndicesToOffset(`outputIndices${$}`,y)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${k}[${$}] = ${b}(${f.getByOffset(`index${$}`)}[component${$}]);
        `;w=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${_("data",0,"u32")}
        ${_("data",1,"u32")}
        ${_("data",2,"u32")}
        ${_("data",3,"u32")}
        ${y.setByOffset("global_idx","data")}
      }`}else w=`
        let outputIndices = ${y.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${f.broadcastedIndicesToOffset("outputIndices",y)};
        let data = ${y.type.value}(${f.getByOffset(`inputOffset / ${a}`)});
        ${y.setByOffset("global_idx","data")}
      }`;return`
    ${c.registerUniform("vec_size","u32").declareVariables(f,y)}
    ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${w}`},h=[{type:12,data:l},...te(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${a}${u}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h})}},bd=e=>{yd(e.inputs),e.compute(_d(e.inputs),{inputs:[0]})}}),$d,vd,Ng=L(()=>{se(),ue(),de(),Cn(),$d=e=>{let t=e[0].dataType,r=B.size(e[0].dims),i=B.size(e[1].dims),n=i%4===0,s=a=>{let u=P("x",t,[1],4),l=P("bias",t,[1],4),d=J("y",t,[1],4),h=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],c=y=>`
      let bias${y}_offset: u32 = (global_idx * 4 + ${y}) % uniforms.bias_size;
      let bias${y} = ${l.getByOffset(`bias${y}_offset / 4`)}[bias${y}_offset % 4];`,f=n?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${c(0)}${c(1)}${c(2)}${c(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${a.registerUniforms(h).declareVariables(u,l,d)}

    ${En(Le(t))}

    ${a.mainStart(cr)}
      ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${f}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",zn("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:s,getRunData:a=>({outputs:[{dims:a[0].dims,dataType:a[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/cr/4)}})}},vd=e=>{e.inputs.length<2||B.size(e.inputs[1].dims)===0?rl(e):e.compute($d(e.inputs))}}),xd,kd,Sd,Id,Rg=L(()=>{se(),ue(),Me(),de(),xd=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},kd=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,s=B.normalizeAxis(t.axis,n),a=r.slice(0);a.splice(s,1,...i);let u=r[s],l=e[0].dataType===9?4:1,d=Math.ceil(B.size(a)/l),h=[{type:12,data:d},{type:6,data:u},{type:12,data:s},...te(e[0].dims,e[1].dims,a)],c=f=>{let y=P("data",e[0].dataType,e[0].dims.length,l),w=P("inputIndices",e[1].dataType,e[1].dims.length),_=J("output",e[0].dataType,a.length,l),k=b=>{let I=i.length,S=`var indicesIndices${b}  = ${w.type.indices}(0);`;for(let E=0;E<I;E++)S+=`${I>1?`indicesIndices${b}[${E}]`:`indicesIndices${b}`} = ${a.length>1?`outputIndices${b}[uniforms.axis + ${E}]`:`outputIndices${b}`};`;S+=`
          var idx${b} = ${w.getByIndices(`indicesIndices${b}`)};
          if (idx${b} < 0) {
            idx${b} = idx${b} + uniforms.axisDimLimit;
          }
          var dataIndices${b} : ${y.type.indices};
        `;for(let E=0,A=0;E<n;E++)E===s?(S+=`${n>1?`dataIndices${b}[${E}]`:`dataIndices${b}`} = u32(idx${b});`,A+=I):(S+=`${n>1?`dataIndices${b}[${E}]`:`dataIndices${b}`} = ${a.length>1?`outputIndices${b}[${A}]`:`outputIndices${b}`};`,A++);return S},$;if(e[0].dataType===9){let b=(I,S,E="")=>`
          let outputIndices${S} = ${_.offsetToIndices(`outputOffset + ${S}u`)};
          ${k(S)};
          let offset${S} = ${y.indicesToOffset(`dataIndices${S}`)};
          let index${S} = offset${S} / 4u;
          let component${S} = offset${S} % 4u;
          ${I}[${S}] = ${E}(${y.getByOffset(`index${S}`)}[component${S}]);
        `;$=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${b("value",0,"u32")}
        ${b("value",1,"u32")}
        ${b("value",2,"u32")}
        ${b("value",3,"u32")}
        ${_.setByOffset("global_idx","value")}
      `}else $=`
      let outputIndices = ${_.offsetToIndices("global_idx")};
      ${k("")};
      let value = ${y.getByIndices("dataIndices")};
      ${_.setByOffset("global_idx","value")};
      `;return`
      ${f.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(y,w,_)}
      ${f.mainStart()}
        ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${$}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:h}),getShaderSource:c}},Sd=e=>be({axis:e.axis}),Id=(e,t)=>{let r=e.inputs;xd(r),e.compute(kd(e.inputs,t))}}),Td,Ed,zd,Dg=L(()=>{se(),ue(),de(),Td=(e,t,r,i,n,s,a,u,l)=>{let d=[{type:12,data:s},{type:12,data:i},{type:12,data:n},{type:12,data:r},{type:12,data:a},{type:12,data:u},{type:12,data:l}],h=[s];d.push(...te(t.dims,h));let c=f=>{let y=P("indices_data",t.dataType,t.dims.length),w=J("input_slice_offsets_data",12,1,1),_=[y,w],k=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${f.registerUniforms(k).declareVariables(..._)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${n.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:h,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:c},{inputs:[t],outputs:[-1]})[0]},Ed=(e,t)=>{let r=e.inputs,i=r[0].dims,n=r[0].dataType,s=r[1].dims,a=s[s.length-1],u=B.sizeToDimension(s,s.length-1),l=B.sizeFromDimension(i,t.batchDims+a),d=B.sizeToDimension(i,t.batchDims),h=B.sizeFromDimension(i,t.batchDims),c=u/d,f=new Array(a),y=l;for(let S=0;S<a;++S)f[a-1-S]=y,y*=i[t.batchDims+a-1-S];let w=Td(e,r[1],f,t.batchDims,i,u,c,h,a),_=t.batchDims+a;if(_>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let k=s.slice(0,-1).concat(i.slice(_)),$=B.size(k),b=[{type:12,data:$},{type:12,data:l},...te(r[0].dims,w.dims,k)],I=S=>{let E=P("data",r[0].dataType,r[0].dims.length),A=P("slice_offsets",12,w.dims.length),O=J("output",r[0].dataType,k.length);return`
          ${S.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(E,A,O)}
            ${S.mainStart()}
            ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:k,dataType:n}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:b}),getShaderSource:I},{inputs:[r[0],w]})},zd=e=>({batchDims:e.batch_dims,cacheKey:""})}),Cd,Ad,Od,Md,Pg=L(()=>{se(),ue(),Me(),de(),Cd=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=B.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,n=e[0],s=e[2],a=e.length===4?e[3]:void 0;if(s.dims.length!==n.dims.length||!n.dims.map((u,l)=>l===r?Math.ceil(u/i)===s.dims[l]:u===s.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(a){if(a.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(a.dims.length!==s.dims.length||!a.dims.map((u,l)=>u===s.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Ad=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,s=B.normalizeAxis(t.gatherAxis,n),a=B.normalizeAxis(t.quantizeAxis,n),u=r.slice(0);u.splice(s,1,...i);let l=B.size(u),d=e[2].dataType,h=e[0].dataType===22,c=[{type:12,data:l},{type:12,data:a},{type:12,data:s},{type:12,data:t.blockSize},...te(...e.map((y,w)=>y.dims),u)],f=y=>{let w=P("data",e[0].dataType,e[0].dims.length),_=P("inputIndices",e[1].dataType,e[1].dims.length),k=P("scales",e[2].dataType,e[2].dims.length),$=e.length>3?P("zeroPoint",e[3].dataType,e[3].dims.length):void 0,b=J("output",d,u.length),I=[w,_,k];$&&I.push($);let S=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${y.registerUniforms(S).declareVariables(...I,b)}
        ${y.mainStart()}
        let output_indices = ${b.offsetToIndices("global_idx")};
        var indices_indices = ${_.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${b.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${_.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${b.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${w.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${b.indicesGet("output_indices","i")};
          ${w.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${_.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[s]};
        }
        ${w.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${b.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${w.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${w.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${w.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${h?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${k.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${k.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${k.getByIndices("scale_indices")};
        ${$?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${h?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Le(d)}(quantized_data - zero_point) * scale;
        ${b.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((y,w)=>w!==1).map(y=>y.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(y,w)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:f}},Od=(e,t)=>{let r=e.inputs;Cd(r,t),e.compute(Ad(e.inputs,t))},Md=e=>be({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Bd,Nd,Rd,Dd,Ug=L(()=>{se(),ue(),Me(),de(),Bd=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Nd=(e,t)=>{let r=e[0].dims,i=e[0].dataType,n=r.length,s=e[1].dims,a=e[1].dataType,u=B.normalizeAxis(t.axis,n),l=r[u],d=s.slice(0),h=B.size(d),c=P("input",i,n),f=P("indicesInput",a,s.length),y=J("output",i,d.length),w=[{type:12,data:h},{type:6,data:l},{type:12,data:u}];return w.push(...te(r,s,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:w}),getShaderSource:_=>`
      ${_.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(c,f,y)}
      ${_.mainStart()}
      ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${y.offsetToIndices("global_idx")};

      var idx = ${f.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${c.type.indices}(outputIndices);
      ${c.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${c.getByIndices("inputIndices")};

      ${y.setByOffset("global_idx","value")};
  }`}},Rd=e=>be({axis:e.axis}),Dd=(e,t)=>{let r=e.inputs;Bd(r),e.compute(Nd(e.inputs,t))}}),Pd,Ud,qd,Wd,qg=L(()=>{se(),ue(),de(),Pd=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Ud=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[n,s,a]=Qs.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),u=[n,s];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(s/l),h=Math.ceil(n/l),c=!0,f=B.size(u),y=[{type:12,data:c?d:f},{type:12,data:n},{type:12,data:s},{type:12,data:a},{type:1,data:t.alpha},{type:1,data:t.beta}],w=["type","type"];e.length===3&&(y.push(...te(e[2].dims)),w.push("rank")),y.push(...te(u));let _=$=>{let b="";t.transA&&t.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let I=t.alpha===1?"":"value *= uniforms.alpha;",S=P("a",e[0].dataType,e[0].dims),E=P("b",e[1].dataType,e[1].dims),A=S.type.value,O=null,x=[S,E];e.length===3&&(O=P("c",e[2].dataType,e[2].dims.length),x.push(O));let D=J("output",e[0].dataType,u.length);x.push(D);let U=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${$.registerUniforms(U).declareVariables(...x)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${A}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${I}
    ${O!=null?`let cOffset = ${O.broadcastedIndicesToOffset("vec2(m, n)",D)}; value += ${A}(uniforms.beta) * ${O.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},k=$=>{let b=P("a",e[0].dataType,e[0].dims),I=P("b",e[1].dataType,e[1].dims),S=null,E=[b,I];e.length===3&&(S=P("c",e[2].dataType,e[2].dims.length),E.push(S));let A=J("output",e[0].dataType,u.length);E.push(A);let O=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],x="",D="";t.transA&&t.transB?(D=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,x="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(D=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,x="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(D=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,x="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(D=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,x="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let U=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${$.registerUniforms(O).declareVariables(...E)}
  var<workgroup> tile_a: array<array<${b.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${I.type.storage}, ${l}>, ${l}>;
  ${$.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${A.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${D}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${x}
      }
      workgroupBarrier();
    }

    ${U}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${S!=null?`let cOffset = ${S.broadcastedIndicesToOffset("vec2(m, n)",A)}; value += ${A.type.value}(uniforms.beta) * ${S.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return c?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:d*h},programUniforms:y}),getShaderSource:k}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:y}),getShaderSource:_}},qd=e=>{let t=e.transA,r=e.transB,i=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:i,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Wd=(e,t)=>{Pd(e.inputs),e.compute(Ud(e.inputs,t))}}),ht,kt,tr,rr,Ld,Vd,Gd,Hd,Fd,jd,Kd,Qd,Zd,Yd,Wg=L(()=>{se(),ue(),Me(),de(),[ht,kt,tr,rr]=[0,1,2,3],Ld=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Vd=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Gd=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Hd=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Fd=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,jd=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${ht}] = batch;
     indices[${kt}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${tr}] = u32(r);
            indices[${rr}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${tr}] = u32(clamp(r, 0, H - 1));
          indices[${rr}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${tr}] = gs_reflect(r, border[1], border[3]);
          indices[${rr}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Kd=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${ht}], indices[${kt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${ht}], indices[${kt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${ht}], indices[${kt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${ht}], indices[${kt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${ht}], indices[${kt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${ht}], indices[${kt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Qd=(e,t)=>{let r=P("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=P("grid",e[1].dataType,i.length,2),s=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(s=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[ht,kt,tr,rr]=[0,3,1,2]);let a=J("output",e[0].dataType,s.length),u=r.type.value,l=B.size(s),d=[{type:12,data:l},...te(e[0].dims,i,s)],h=c=>`
  ${c.registerUniform("output_size","u32").declareVariables(r,n,a)}
  ${Vd}
  ${Gd(u)}
  ${Hd(t)}
  ${Fd(t)}
  ${jd(r,u,t)}

  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${tr}]);
      let W_in = i32(uniforms.x_shape[${rr}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${a.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${ht}], indices[${tr}], indices[${rr}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Kd(a,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:c=>{let f=B.size(s);return{outputs:[{dims:s,dataType:c[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:d}},getShaderSource:h}},Zd=(e,t)=>{Ld(e.inputs),e.compute(Qd(e.inputs,t))},Yd=e=>be({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Ge,Xd,Jd,Qn,ep,Or,tp,rp=L(()=>{se(),ue(),Me(),mn(),In(),de(),Nt(),Ge=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Xd=(e,t)=>{let r=e[0],i=Ge(e,1),n=Ge(e,2),s=Ge(e,3),a=Ge(e,4),u=Ge(e,5),l=Ge(e,6),d=Ge(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let h=r.dims[0],c=r.dims[1],f=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],y=c,w=0,_=0,k=Math.floor(f/t.numHeads);if(l&&d&&B.size(l.dims)&&B.size(d.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==h||l.dims[1]!==t.numHeads||l.dims[3]!==k)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==h||d.dims[1]!==t.numHeads||d.dims[3]!==k)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');w=l.dims[2],_=l.dims[2]}else if(l&&B.size(l.dims)||d&&B.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(i&&B.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,y=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==k)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,y=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==k)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,y=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(s&&B.size(s.dims)>0){if(s.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let b=w+y,I=0;if(a&&B.size(a.dims)>0){I=8;let O=a.dims;throw O.length===1?O[0]===h?I=1:O[0]===3*h+2&&(I=3):O.length===2&&O[0]===h&&O[1]===b&&(I=5),I===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let S=!1,E=f;if(n&&B.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(y!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');E=n.dims[2]}else{if(y!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');E=n.dims[1]*n.dims[3],S=!0}}let A=!1;if(a&&B.size(a.dims)>0)throw new Error("Key padding mask is not supported");if(u&&B.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==h||u.dims[1]!==t.numHeads||u.dims[2]!==c||u.dims[3]!==b)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:h,sequenceLength:c,pastSequenceLength:w,kvSequenceLength:y,totalSequenceLength:b,maxSequenceLength:_,inputHiddenSize:0,hiddenSize:f,vHiddenSize:E,headSize:k,vHeadSize:Math.floor(E/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:I,scale:t.scale,broadcastResPosBias:A,passPastInKv:S,qkvFormat:$}},Jd=e=>be({...e}),Qn=be({perm:[0,2,1,3]}),ep=(e,t,r,i,n,s,a)=>{let u=[i,n,s],l=B.size(u),d=[{type:12,data:l},{type:12,data:a},{type:12,data:s}],h=c=>{let f=J("qkv_with_bias",t.dataType,u),y=P("qkv",t.dataType,u),w=P("bias",r.dataType,u),_=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${c.registerUniforms(_).declareVariables(y,w,f)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:h},{inputs:[t,r],outputs:[-1]})[0]},Or=(e,t,r,i,n,s,a,u)=>{let l=s;if(a&&B.size(a.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=ep(e,s,a,t,i,r*n,u),l=l.reshape([t,i,r,n]),r===1||i===1?l:e.compute(Qe(l,Qn.perm),{inputs:[l],outputs:[-1]})[0]}else return s.dims.length===3&&(l=s.reshape([t,i,r,n])),r===1||i===1?l:e.compute(Qe(l,Qn.perm),{inputs:[l],outputs:[-1]})[0]},tp=(e,t)=>{let r=Xd(e.inputs,t),i=e.inputs[0],n=Ge(e.inputs,1),s=Ge(e.inputs,2),a=Ge(e.inputs,3),u=Ge(e.inputs,4),l=Ge(e.inputs,5),d=Ge(e.inputs,6),h=Ge(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if((n==null?void 0:n.dims.length)===5)throw new Error("Packed KV is not implemented");let c=n&&s&&n.dims.length===4&&s.dims.length===4,f=Or(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,a,0);if(c)return Tr(e,f,n,s,u,void 0,d,h,l,r);if(!n||!s)throw new Error("key and value must be provided");let y=Or(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,a,r.hiddenSize),w=Or(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,s,a,2*r.hiddenSize);Tr(e,f,y,w,u,void 0,d,h,l,r)}}),ip,np,ap,sp,Zn,op,up,lp=L(()=>{se(),ue(),Me(),de(),ip=e=>{if(!e||e.length<1)throw new Error("too few inputs")},np=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),i=r.length),be({numOutputs:i,axis:t.axis,splitSizes:r})},ap=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${ee("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,sp=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let n=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(n):i===0?r.push(`if (output_number == ${i}u) { ${n} }`):i===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${i}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Zn=(e,t)=>{let r=e[0].dims,i=B.size(r),n=e[0].dataType,s=B.normalizeAxis(t.axis,r.length),a=new Array(t.numOutputs),u=P("input",n,r.length),l=new Array(t.numOutputs),d=[],h=[],c=0,f=[{type:12,data:i}];for(let w=0;w<t.numOutputs;w++){c+=t.splitSizes[w],l[w]=c;let _=r.slice();_[s]=t.splitSizes[w],h.push(_),a[w]=J(`output${w}`,n,_.length),d.push({dims:h[w],dataType:e[0].dataType})}f.push({type:12,data:l},...te(r,...h));let y=w=>`
  ${w.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...a)}
  ${ap(l.length)}
  ${sp(a)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",s)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${ee("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",s,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:y,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:f})}},op=(e,t)=>{ip(e.inputs);let r=e.inputs.length===1?t:np(e.inputs,t);e.compute(Zn(e.inputs,r),{inputs:[0]})},up=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return be({axis:t,numOutputs:i,splitSizes:r})}}),dp,di,pp,cp=L(()=>{se(),ue(),Me(),de(),dp=(e,t)=>{let[r,i,n,s]=e,{numHeads:a,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!B.areEqual(i.dims,[])&&!B.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(s.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${s.dims.length}`);if(!B.areEqual(n.dims,s.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&a===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],h=n.dims[0],c=B.sizeFromDimension(r.dims,1)/d,f=u===0?n.dims[1]*2:c/a;if(u>f)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(d!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(f/2!==n.dims[1]&&u/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`);if(d>h)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},di=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:n,scale:s}=t,a=e[0].dims[0],u=B.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=u/l,h=e[2].dims[1],c=n===0?h*2:d/i,f=new Array(a,l,d/c,c-h),y=B.computeStrides(f),w=[{type:1,data:s},{type:12,data:f},{type:12,data:y},...e[0].dims.length===3?new Array({type:12,data:[u,d,c,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,c,l*c,1]}):[],...te(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],_=k=>{let $=P("input",e[0].dataType,e[0].dims.length),b=P("position_ids",e[1].dataType,e[1].dims.length),I=P("cos_cache",e[2].dataType,e[2].dims.length),S=P("sin_cache",e[3].dataType,e[3].dims.length),E=J("output",e[0].dataType,e[0].dims.length);return k.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:f.length},{name:"global_strides",type:"u32",length:y.length},{name:"input_output_strides",type:"u32",length:y.length}]),`
        ${k.declareVariables($,b,I,S,E)}

        ${k.mainStart(cr)}
          let half_rotary_emb_dim = uniforms.${I.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${b.broadcastedIndicesToOffset("bsnh.xy",J("",b.type.tensor,2))};
            let position_id =
                u32(${b.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${$.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} -
                ${$.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${E.setByOffset("i","re")}
            let im = ${$.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} +
                ${$.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${E.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${E.setByOffset("k",$.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:be({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(B.size(f)/cr)},programUniforms:w})}},pp=(e,t)=>{dp(e.inputs,t),e.compute(di(e.inputs,t))}}),hp,fp,Yn,mp,gp,Lg=L(()=>{Me(),se(),In(),rp(),lp(),Nt(),cp(),de(),hp=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],n=e[2],s=e[3],a=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],d=r.dims[1],h=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],c=d,f=0,y=!i||i.dims.length===0,w=Math.floor(y?h/(t.numHeads+2*t.kvNumHeads):h/t.numHeads);y&&(h=w*t.numHeads);let _=s&&s.dims.length!==0,k=a&&a.dims.length!==0;if(_&&s.dims.length===4&&s.dims[0]===l&&s.dims[1]!==t.kvNumHeads&&s.dims[2]===t.kvNumHeads&&s.dims[3]===w)throw new Error("BSNH pastKey/pastValue is not supported");if(_&&k){if(s.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(a.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');f=s.dims[2]}else if(_||k)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');c=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==w)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');c=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==w)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');c=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let b=0,I=!1,S=t.kvNumHeads?w*t.kvNumHeads:h;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(c!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=n.dims[2]}else{if(c!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');S=n.dims[1]*n.dims[3],I=!0}}let E=e.length>4?e[5]:void 0;if(E&&E.dims.length!==1&&E.dims[0]!==l)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:d,pastSequenceLength:f,kvSequenceLength:c,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:h,vHiddenSize:S,headSize:w,vHeadSize:Math.floor(S/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:I,qkvFormat:$}},fp=be({perm:[0,2,1,3]}),Yn=(e,t,r)=>{let i=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),i=e.compute(Qe(i,fp.perm),{inputs:[i],outputs:[-1]})[0]),i},mp=(e,t,r,i)=>{let n=7,s=["type","type"],a=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],d=h=>{let c=P("seq_lens",r.dataType,r.dims),f=P("total_seq_lens",i.dataType,i.dims),y=J("pos_ids",n,a),w=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${h.registerUniforms(w).declareVariables(c,f,y)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${f.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${c.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${y.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:s},getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:d}},gp=(e,t)=>{var S;let r=hp(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((S=e.inputs[1])==null?void 0:S.dims.length)===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,s=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,a=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,h=r.kvNumHeads?r.kvNumHeads:r.numHeads,c=be({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,h*r.headSize,h*r.headSize]}),[f,y,w]=!n&&!s?e.compute(Zn([i],c),{inputs:[i],outputs:[-1,-1,-1]}):[i,n,s],_,k;if(t.doRotary){let E=e.compute(mp(r.batchSize,r.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],A=e.inputs[7],O=e.inputs[8],x=be({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),D=[f,E,A,O],U=[-1];_=e.compute(di(D,x),{inputs:D,outputs:U})[0],D.splice(0,1,y);let H=be({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});k=e.compute(di(D,H),{inputs:D,outputs:U})[0]}let $=Or(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?_:f,void 0,0),b=Yn(e,t.doRotary?k:y,r),I=Yn(e,w,r);Tr(e,$,b,I,void 0,void 0,a,u,void 0,r,l,d)}}),Xn,yp,wp,_p,Vg=L(()=>{se(),ue(),Nt(),de(),Xn=(e,t,r,i,n,s,a,u)=>{let l=Oe(s),d=l===1?"f32":`vec${l}f`,h=l===1?"vec2f":`mat2x${l}f`,c=n*a,f=64;c===1&&(f=256);let y=[n,a,s/l],w=[n,a,2],_=["rank","type","type"],k=[];k.push(...te(y,w));let $=b=>{let I=P("x",t.dataType,3,l),S=P("scale",r.dataType,r.dims),E=P("bias",i.dataType,i.dims),A=J("output",1,3,2),O=[I,S,E,A];return`
  var<workgroup> workgroup_shared : array<${h}, ${f}>;
  const workgroup_size = ${f}u;
  ${b.declareVariables(...O)}
  ${b.mainStart(f)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${I.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${h}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Bt("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${Bt("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${f}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:w,dataType:1}],dispatchGroup:{x:c},programUniforms:k}),getShaderSource:$},{inputs:[t,r,i],outputs:[-1]})[0]},yp=(e,t,r)=>{let i=t[0].dims,n=i,s=2,a=i[0],u=i[1],l=B.sizeFromDimension(i,s),d=Oe(l),h=B.size(n)/d,c=Xn(e,t[0],t[1],t[2],a,l,u,r.epsilon),f=[a,u,l/d],y=[a,u],w=["type","none"],_=k=>{let $=P("x",t[0].dataType,f.length,d),b=P("scale_shift",1,y.length,2),I=J("output",t[0].dataType,f.length,d),S=[$,b,I];return`
  ${k.registerUniform("output_size","u32").declareVariables(...S)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${I.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${b.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${$.getByOffset("global_idx")} * ${I.type.value}(scale_shift.x) + ${I.type.value}(scale_shift.y);
      ${I.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},...te(f,y,f)]}),getShaderSource:_},{inputs:[t[0],c]})},wp=(e,t,r)=>{let i=t[0].dims,n=i,s=i[0],a=i[i.length-1],u=B.sizeFromDimension(i,1)/a,l=Oe(a),d=B.size(n)/l,h=[{type:12,data:u},{type:12,data:Math.floor(a/l)}],c=["type","type"],f=!1,y=[0,i.length-1];for(let $=0;$<i.length-2;$++)f=f||i[$+1]!==1,y.push($+1);f=f&&i[i.length-1]!==1;let w=f?e.compute(Qe(e.inputs[0],y),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},($,b)=>i[y[b]])),_=Xn(e,w,t[1],t[2],s,u,a,r.epsilon),k=$=>{let b=De(t[0].dataType),I=l===1?"vec2f":`mat${l}x2f`,S=O=>{let x=O===0?"x":"y",D=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${b}(${D}(scale.${x}))`;case 2:return`vec2<${b}>(${D}(scale[0].${x}, scale[1].${x}))`;case 4:return`vec4<${b}>(${D}(scale[0].${x}, scale[1].${x}, scale[2].${x}, scale[3].${x}))`;default:throw new Error(`Not supported compoents ${l}`)}},E=P("input",t[0].dataType,t[0].dims,l),A=J("output",t[0].dataType,n,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${E.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${I}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${A.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${$.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${S(0)}, ${S(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:h}),getShaderSource:k},{inputs:[t[0],_]})},_p=(e,t)=>{t.format==="NHWC"?wp(e,e.inputs,t):yp(e,e.inputs,t)}}),bp,$p,vp,Gg=L(()=>{se(),ue(),de(),bp=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},$p=(e,t,r)=>{let i=t.simplified,n=e[0].dims,s=e[1],a=!i&&e[2],u=n,l=B.normalizeAxis(t.axis,n.length),d=B.sizeToDimension(n,l),h=B.sizeFromDimension(n,l),c=B.size(s.dims),f=a?B.size(a.dims):0;if(c!==h||a&&f!==h)throw new Error(`Size of X.shape()[axis:] == ${h}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${c} and bias size of ${f}`);let y=[];for(let E=0;E<n.length;++E)E<l?y.push(n[E]):y.push(1);let w=Oe(h),_=["type","type"],k=[{type:12,data:d},{type:1,data:h},{type:12,data:Math.floor(h/w)},{type:1,data:t.epsilon}];a&&_.push("type");let $=r>1,b=r>2,I=E=>{let A=De(e[0].dataType),O=[P("x",e[0].dataType,e[0].dims,w),P("scale",s.dataType,s.dims,w)];a&&O.push(P("bias",a.dataType,a.dims,w)),O.push(J("output",e[0].dataType,u,w)),$&&O.push(J("mean_data_output",1,y)),b&&O.push(J("inv_std_output",1,y));let x=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${E.registerUniforms(x).declareVariables(...O)}
  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${_n("f32",w)};
    var mean_square_vector = ${_n("f32",w)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${hr(A,w,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Bt("mean_vector",w)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Bt("mean_square_vector",w)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${hr(A,w,"x[j + offset]")};
      let f32scale = ${hr(A,w,"scale[j]")};
      output[j + offset] = ${O[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${a?`+ ${hr(A,w,"bias[j]")}`:""}
      );
    }

    ${$?"mean_data_output[global_idx] = mean":""};
    ${b?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},S=[{dims:u,dataType:e[0].dataType}];return $&&S.push({dims:y,dataType:1}),b&&S.push({dims:y,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${w};${r};${i}`,inputDependencies:_},getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:k}),getShaderSource:I}},vp=(e,t)=>{bp(e.inputs),e.compute($p(e.inputs,t,e.outputCount))}}),xp,kp,Hg=L(()=>{ue(),Bn(),Pn(),xp=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},kp=e=>{xp(e.inputs);let t=pr.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(Mn(e.inputs,{activation:""},t));else{let n=t[t.length-2],s=B.size(e.inputs[0].dims.slice(0,-2)),a=B.size(e.inputs[1].dims.slice(0,-2));if(s!==1&&n===1&&a===1){let u=e.inputs[0].reshape([1,s,i]),l=e.inputs[1].reshape([1,i,r]),d=[1,s,r],h=[u,l];e.compute(si(h,{activation:""},t,d),{inputs:h})}else e.compute(si(e.inputs,{activation:""},t))}}}),Sp,Ip,Tp,Ep,zp,Fg=L(()=>{se(),ue(),Me(),de(),Sp=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),s=t.blockSize/8*t.bits,a=e[1];if(!B.areEqual(a.dims,[t.n,n,s]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(B.size(u)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,d=t.n*(t.bits===8?n:Math.floor((n*t.bits+7)/8));if(B.size(l)!==d)throw new Error("zeroPoints input size error.")}},Ip=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],s=t.k,a=t.n,u=r.slice(0,i-2),l=B.size(u),d=e[1].dims[2]/4,h=e[0].dataType,c=Oe(t.k),f=Oe(d),y=Oe(a),w=u.concat([n,a]),_=n>1&&a/y%2===0?2:1,k=B.size(w)/y/_,$=64,b=[],I=[l,n,s/c],S=B.convertShape(e[1].dims).slice();S.splice(-1,1,d/f),b.push(...te(I)),b.push(...te(S)),b.push(...te(e[2].dims)),e.length===4&&b.push(...te(B.convertShape(e[3].dims)));let E=[l,n,a/y];b.push(...te(E));let A=O=>{let x=I.length,D=P("a",e[0].dataType,x,c),U=P("b",12,S.length,f),H=P("scales",e[2].dataType,e[2].dims.length),K=[D,U,H],Q=e.length===4?P("zero_points",12,e[3].dims.length):void 0;Q&&K.push(Q);let N=E.length,X=J("output",e[0].dataType,N,y),Y=De(e[0].dataType),re=(()=>{switch(c){case 1:return`array<${Y}, 8>`;case 2:return`mat4x2<${Y}>`;case 4:return`mat2x4<${Y}>`;default:throw new Error(`${c}-component is not supported.`)}})(),le=()=>{let W=`
          // reuse a data
            var input_offset = ${D.indicesToOffset(`${D.type.indices}(batch, row, word_offset)`)};
            var a_data: ${re};
            for (var j: u32 = 0; j < ${8/c}; j++) {
              a_data[j] = ${D.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let q=0;q<y*_;q++)W+=`
            b_value = ${f===1?`b${q}_data`:`b${q}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${re}(${Array.from({length:4},(ie,ne)=>`${Y}(b_value_lower[${ne}]), ${Y}(b_value_upper[${ne}])`).join(", ")});
            b_dequantized_values = ${c===1?`${re}(${Array.from({length:8},(ie,ne)=>`(b_quantized_values[${ne}] - ${Q?`zero_point${q}`:"zero_point"}) * scale${q}`).join(", ")});`:`(b_quantized_values - ${re}(${Array(8).fill(`${Q?`zero_point${q}`:"zero_point"}`).join(",")})) * scale${q};`};
            workgroup_shared[local_id.x * ${_} + ${Math.floor(q/y)}]${y>1?`[${q%y}]`:""} += ${Array.from({length:8/c},(ie,ne)=>`${c===1?`a_data[${ne}] * b_dequantized_values[${ne}]`:`dot(a_data[${ne}], b_dequantized_values[${ne}])`}`).join(" + ")};
          `;return W},G=()=>{let W=`
            var col_index = col * ${y};
            ${Q?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${Y}(8);`}
            `;for(let q=0;q<y*_;q++)W+=`
            let scale${q} = ${H.getByOffset("col_index * nBlocksPerCol + block")};
            ${Q?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${Q.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${q} = ${Y}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return W},xe=()=>{let W=`col_index = col * ${y};`;for(let q=0;q<y*_;q++)W+=`
            let b${q}_data = ${U.getByIndices(`${U.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return W+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${re};
            var b_dequantized_values: ${re};`,W};return`
        var<workgroup> workgroup_shared: array<${X.type.value}, ${_*$}>;
        ${O.declareVariables(...K,X)}
        ${O.mainStart([$,1,1])}
          let output_indices = ${X.offsetToIndices(`(global_idx / ${$}) * ${_}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/c};
            ${G()}
            for (var word: u32 = 0; word < ${d}; word += ${f}) {
              ${xe()}
              for (var i: u32 = 0; i < ${f}; i++) {
                ${le()}
                word_offset += ${8/c};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${_}) {
            var output_value: ${X.type.value} = ${X.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${_};
            }
            ${X.setByIndices(`${X.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${c};${f};${y};${_};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:w,dataType:h}],dispatchGroup:{x:k},programUniforms:b}),getShaderSource:A}},Tp=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],s=t.k,a=t.n,u=r.slice(0,i-2),l=B.size(u),d=e[1].dims[2]/4,h=e[0].dataType,c=Oe(t.k),f=Oe(d),y=u.concat([n,a]),w=128,_=a%8===0?8:a%4===0?4:1,k=w/_,$=k*f*8,b=$/c,I=$/t.blockSize,S=B.size(y)/_,E=[],A=[l,n,s/c],O=B.convertShape(e[1].dims).slice();O.splice(-1,1,d/f),E.push(...te(A)),E.push(...te(O)),E.push(...te(e[2].dims)),e.length===4&&E.push(...te(B.convertShape(e[3].dims)));let x=[l,n,a];E.push(...te(x));let D=U=>{let H=A.length,K=P("a",e[0].dataType,H,c),Q=P("b",12,O.length,f),N=P("scales",e[2].dataType,e[2].dims.length),X=[K,Q,N],Y=e.length===4?P("zero_points",12,e[3].dims.length):void 0;Y&&X.push(Y);let re=x.length,le=J("output",e[0].dataType,re),G=De(e[0].dataType),xe=()=>{switch(c){case 1:return`
          let a_data0 = vec4<${G}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${G}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${G}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${G}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${c}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${K.type.value}, ${b}>;
        var<workgroup> inter_results: array<array<${le.type.value}, ${k}>, ${_}>;
        ${U.declareVariables(...X,le)}
        ${U.mainStart([k,_,1])}
          let output_indices = ${le.offsetToIndices(`workgroup_index * ${_}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${I} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${b};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${b}; a_offset += ${w})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${K.getByIndices(`${K.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${K.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${I} + local_id.x;
            ${Y?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${Y.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${G}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${G}(8);`}
            let scale = ${N.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${Q.getByIndices(`${Q.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/c};
            for (var i: u32 = 0; i < ${f}; i++) {
              ${xe()}
              let b_value = ${f===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${G}>(${Array.from({length:4},(W,q)=>`${G}(b_value_lower[${q}]), ${G}(b_value_upper[${q}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${G}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(W,q)=>`${`dot(a_data${q}, b_dequantized_values[${q}])`}`).join(" + ")};
              word_offset += ${8/c};
            }
            workgroupBarrier();
          }

          if (local_idx < ${_}) {
            var output_value: ${le.type.value} = ${le.type.value}(0);
            for (var b = 0u; b < ${k}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${le.setByIndices(`${le.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${c};${f};${k};${_}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:y,dataType:h}],dispatchGroup:{x:S},programUniforms:E}),getShaderSource:D}},Ep=(e,t)=>{Sp(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Tp(e.inputs,t)):e.compute(Ip(e.inputs,t))},zp=e=>be(e)}),Cp,Ap,Op,Mp,Bp,Np,Rp,Dp,Pp,jg=L(()=>{se(),ue(),de(),Cp=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Ap=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
            k = i32(${e.indicesGet("indices",n)}) - ${ee("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${ee("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${ee("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},Op=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${ee("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${ee("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${ee("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${ee("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Mp=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${ee("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${ee("uniforms.x_shape",n,t)})) {
                  k = i32(${ee("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${ee("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Bp=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${ee("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${ee("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${ee("uniforms.x_shape",n,t)})) {
                  k -= i32(${ee("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${ee("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Np=(e,t,r)=>{switch(r.mode){case 0:return Ap(e,t,r.pads.length);case 1:return Op(e,t,r.pads.length);case 2:return Mp(e,t,r.pads.length);case 3:return Bp(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Rp=(e,t)=>{let r=B.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,n=B.size(r),s=[{type:12,data:n},{type:6,data:t.pads}],a=e.length>=3&&e[2].data;t.mode===0&&s.push({type:a?e[2].dataType:1,data:t.value}),s.push(...te(e[0].dims,r));let u=["rank"],l=d=>{let h=J("output",e[0].dataType,r.length),c=P("x",e[0].dataType,i.length),f=c.type.value,y=Np(h,i.length,t),w=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&w.push({name:"constant_value",type:a?f:"f32"}),`
            ${d.registerUniforms(w).declareVariables(c,h)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${h.offsetToIndices("global_idx")};

            var value = ${f}(0);
            ${y}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${a}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(B.size(r)/64)},programUniforms:s}),getShaderSource:l}},Dp=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,s=new Int32Array(2*n).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)s[Number(u[l])]=Number(r[l]),s[Number(u[l])+n]=Number(r[l+u.length])}else r.forEach((u,l)=>s[Number(l)]=Number(u));let a=[];return s.forEach(u=>a.push(u)),{mode:t.mode,value:i,pads:a}}else return t},Pp=(e,t)=>{Cp(e.inputs);let r=Dp(e.inputs,t);e.compute(Rp(e.inputs,r),{inputs:[0]})}}),Mr,Jn,ea,ta,ra,Up,qp,ia,na,Wp,Lp,aa,Vp,Gp,sa,Hp,Fp,jp,Kp,Kg=L(()=>{Xe(),se(),ue(),de(),Mr=e=>{if(Ee.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Jn=(e,t,r)=>{let i=t.format==="NHWC",n=e.dims.slice();i&&n.splice(1,0,n.pop());let s=Object.hasOwnProperty.call(t,"dilations"),a=t.kernelShape.slice(),u=t.strides.slice(),l=s?t.dilations.slice():[],d=t.pads.slice();Jr.adjustPoolAttributes(r,n,a,u,l,d);let h=Jr.computePoolOutputShape(r,n,u,l,a,d,t.autoPad),c=Object.assign({},t);s?Object.assign(c,{kernelShape:a,strides:u,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(c,{kernelShape:a,strides:u,pads:d,cacheKey:t.cacheKey});let f=h.slice();return f.push(f.splice(1,1)[0]),[c,i?f:h]},ea=(e,t)=>{let r=t.format==="NHWC",i=B.size(e),n=B.size(t.kernelShape),s=[{type:12,data:i},{type:12,data:n}],a=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],h=t.pads[t.pads.length-1],c=!!(d+h);s.push({type:12,data:u},{type:12,data:l},{type:12,data:d},{type:12,data:h}),a.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let f=!1;if(t.kernelShape.length===2){let y=t.kernelShape[t.kernelShape.length-2],w=t.strides[t.strides.length-2],_=t.pads[t.pads.length/2-2],k=t.pads[t.pads.length-2];f=!!(_+k),s.push({type:12,data:y},{type:12,data:w},{type:12,data:_},{type:12,data:k}),a.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[s,a,!0,c,f]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=B.computeStrides(t.kernelShape);s.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),a.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((d,h)=>d+h);return[s,a,!!l,!1,!1]}},ta=(e,t,r,i,n,s,a,u,l,d,h,c)=>{let f=n.format==="NHWC",y=t.type.value,w=J("output",t.type.tensor,i);if(n.kernelShape.length<=2){let _="",k="",$="",b=r-(f?2:1);if(h?_=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${s}
                }`:_=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${s}
                }`,n.kernelShape.length===2){let I=r-(f?3:2);c?k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${I}] < 0 || xIndices[${I}] >= uniforms.x_shape[${I}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                `,$=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,w)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${w.offsetToIndices("global_idx")};
              var xIndices = ${w.offsetToIndices("global_idx")};

              var value = ${y}(${u});
              var pad = 0;
              ${k}
              ${_}
              ${$}
              ${a}

              output[global_idx] = value;
            }`}else{if(f)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let _=n.kernelShape.length,k=n.pads.length,$="";return d?$=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${s}
              }`:$=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${s}
            `,`
            ${e.registerUniforms(l).declareVariables(t,w)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${w.offsetToIndices("global_idx")};
              var xIndices = ${w.offsetToIndices("global_idx")};

              var offsets: array<u32, ${_}>;

              var value = ${y}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${_-1}u; j++) {
                  offsets[j] = offset / ${ee("uniforms.kernelStrides","j",_)};
                  offset -= offsets[j] * ${ee("uniforms.kernelStrides","j",_)};
                }
                offsets[${_-1}] = offset;

                isPad = false;
                for (var j = ${r-_}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${ee("uniforms.strides",`j - ${r-_}u`,_)}
                    + offsets[j - ${r-_}u] - ${ee("uniforms.pads","j - 2u",k)};
                  ${$}
              }
              ${a}

              output[global_idx] = value;
            }`}},ra=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Up=e=>`${ra(e)};${e.countIncludePad}`,qp=e=>`${ra(e)};${e.storageOrder};${e.dilations}`,ia=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),na=(e,t,r,i)=>{let[n,s]=Jn(t,i,r),a=P("x",t.dataType,t.dims.length),u=a.type.value,l="value += x_val;",d="";n.countIncludePad?d+=`value /= ${u}(uniforms.kernelSize);`:d+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[h,c,f,y,w]=ea(s,n);h.push(...te(t.dims,s));let _=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${f};${y};${w}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(B.size(s)/64)},programUniforms:h}),getShaderSource:k=>ta(k,a,t.dims.length,s.length,n,l,d,0,c,f,y,w)}},Wp=e=>{let t=e.count_include_pad!==0,r=ia(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Up(i)}},Lp=(e,t)=>{Mr(e.inputs),e.compute(na("AveragePool",e.inputs[0],!1,t))},aa={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Vp=e=>{let t=e.format;return{format:t,...aa,cacheKey:t}},Gp=(e,t)=>{Mr(e.inputs),e.compute(na("GlobalAveragePool",e.inputs[0],!0,t))},sa=(e,t,r,i)=>{let[n,s]=Jn(t,i,r),a=`
      value = max(x_val, value);
    `,u="",l=P("x",t.dataType,t.dims.length),d=["rank"],[h,c,f,y,w]=ea(s,n);return h.push(...te(t.dims,s)),{name:e,shaderCache:{hint:`${i.cacheKey};${f};${y};${w}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(B.size(s)/64)},programUniforms:h}),getShaderSource:_=>ta(_,l,t.dims.length,s.length,n,a,u,t.dataType===10?-65504:-1e5,c,f,y,w)}},Hp=(e,t)=>{Mr(e.inputs),e.compute(sa("MaxPool",e.inputs[0],!1,t))},Fp=e=>{let t=e.storage_order,r=e.dilations,i=ia(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let n={storageOrder:t,dilations:r,...i,cacheKey:""};return{...n,cacheKey:qp(n)}},jp=e=>{let t=e.format;return{format:t,...aa,cacheKey:t}},Kp=(e,t)=>{Mr(e.inputs),e.compute(sa("GlobalMaxPool",e.inputs[0],!0,t))}}),Qp,Zp,Yp,Xp,Qg=L(()=>{se(),ue(),Me(),de(),Qp=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,s)=>s===t.axis||n===e[0].dims[s]).reduce((n,s)=>n&&s,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Zp=(e,t)=>{let r=B.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,n=i===3,s=e[0].dims,a=e[1].dataType,u=B.size(s),l=i===3||i===2,d=l?[Math.ceil(B.size(e[0].dims)/4)]:e[0].dims,h=e[1].dims,c=e.length>2?e[2]:void 0,f=c?l?[Math.ceil(B.size(c.dims)/4)]:c.dims:void 0,y=h.length===0||h.length===1&&h[0]===1,w=y===!1&&h.length===1,_=Oe(u),k=y&&(!l||_===4),$=k?_:1,b=k&&!l?_:1,I=P("input",l?12:i,d.length,b),S=P("scale",a,h.length),E=c?P("zero_point",l?12:i,f.length):void 0,A=J("output",a,s.length,$),O=[I,S];E&&O.push(E);let x=[d,h];c&&x.push(f);let D=[{type:12,data:u/$},{type:12,data:r},{type:12,data:t.blockSize},...te(...x,s)],U=H=>{let K=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${H.registerUniforms(K).declareVariables(...O,A)}
      ${H.mainStart()}
          ${H.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${A.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${I.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${$===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${I.getByOffset("global_idx")};`};

          // Set scale input
          ${y?`let scale_value= ${S.getByOffset("0")}`:w?`
            let scale_index = ${A.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${S.getByOffset("scale_index")};`:`
            var scale_indices: ${S.type.indices} = output_indices;
            let index = ${S.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${S.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${S.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${E?y?l?`
                let zero_point_input = ${E.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${E.getByOffset("0")}`:w?l?`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${E.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${E.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${S.indicesToOffset("scale_indices")};
                let zero_point_input = ${E.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${E.getByIndices("scale_indices")};`:`let zero_point_value = ${l?n?"i32":"u32":I.type.value}(0);`};
      // Compute and write output
      ${A.setByOffset("global_idx",`${A.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:E?["rank","rank","rank"]:["rank","rank"]},getShaderSource:U,getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/$/64),y:1,z:1},programUniforms:D})}},Yp=(e,t)=>{Qp(e.inputs,t),e.compute(Zp(e.inputs,t))},Xp=e=>be({axis:e.axis,blockSize:e.blockSize})}),Jp,ec,tc,Zg=L(()=>{Xe(),se(),de(),Jp=(e,t,r)=>{let i=e===t,n=e<t&&r<0,s=e>t&&r>0;if(i||n||s)throw new Error("Range these inputs' contents are invalid.")},ec=(e,t,r,i)=>{let n=Math.abs(Math.ceil((t-e)/r)),s=[n],a=n,u=[{type:12,data:a},{type:i,data:e},{type:i,data:r},...te(s)],l=d=>{let h=J("output",i,s.length),c=h.type.value,f=[{name:"outputSize",type:"u32"},{name:"start",type:c},{name:"delta",type:c}];return`
        ${d.registerUniforms(f).declareVariables(h)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${c}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:s,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:u})}},tc=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),Ee.webgpu.validateInputContent&&Jp(t,r,i),e.compute(ec(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),rc,ic,nc,ac,Yg=L(()=>{se(),ue(),Me(),de(),rc=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let n=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,s=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${n}bitcast<${i}>(oldValue) + (${r})${s}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${n}max(bitcast<f32>(oldValue), (${r}))${s}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${n}min(bitcast<${i}>(oldValue), (${r}))${s}`;case"mul":return`${n}(bitcast<${i}>(oldValue) * (${r}))${s}`;default:throw new Error(`Reduction ${e} is not supported.`)}},ic=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r,s=1,a=Math.ceil(B.sizeToDimension(i,i.length-1)/s),u=i[i.length-1],l=B.sizeFromDimension(r,u),d=[{type:12,data:a},{type:12,data:u},{type:12,data:l},...te(e[1].dims,e[2].dims,n)],h=c=>{let f=P("indices",e[1].dataType,e[1].dims.length),y=P("updates",e[2].dataType,e[2].dims.length,s),w=t.reduction!=="none"&&t.reduction!==""?po("output",e[0].dataType,n.length):J("output",e[0].dataType,n.length,s);return`
      ${c.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(f,y,w)}
      ${c.mainStart()}
        ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${rc(t.reduction,"output[data_offset + i]","value",w.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:d}),getShaderSource:h}},nc=e=>be({reduction:e.reduction}),ac=(e,t)=>{e.compute(ic(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),sc,oc,uc,oa,lc,dc,pc,cc,hc,fc,mc,gc,ua,yc,wc,_c,bc,$c,vc,xc,Xg=L(()=>{se(),ue(),Me(),de(),sc=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},oc=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((n,s)=>i[n]=e[s]),i},uc=(e,t,r,i,n,s)=>{let[a,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(a>0&&e.length>a&&e[a].dims.length>0)e[a].getFloat32Array().forEach(h=>s.push(h));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(h=>i.push(h)),i.length!==0&&i.length!==d&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");sc(i,t),t.axes.length>0&&oc(i,t.axes,d).forEach((h,c)=>i[c]=h)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(h=>n.push(Number(h))),n.length!==0&&n.length!==d&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof n<"u"&&i.length>0&&n.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},oa=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,lc=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${oa("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${oa("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",dc=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",pc=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?i:e.slice();return t.length>0?(t.forEach((s,a)=>{i[s]=n[a],i[a+r]=n[t.length+a]}),i):n},cc=(e,t,r,i)=>{let n=[];if(r.length>0)if(i.length>0){if(e.forEach(s=>n.push(s)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((s,a)=>n[s]=r[a])}else r.forEach(s=>n.push(s));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((s,a)=>Math.round(s*t[a]))}return n},hc=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(s=>t[s]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(s=>t[s]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(s=>t[s]=i),r.axes.forEach(s=>n[s]=Math.round(e[s]*t[s]))):(t.fill(i,0,t.length),n.forEach((s,a)=>n[a]=Math.round(s*t[a]))),n},fc=(e,t,r,i,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${ee("uniforms.scales","i",i)};
        var roi_low = ${ee("uniforms.roi","i",n)};
        var roi_hi = ${ee("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${ee("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${ee("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,mc=(e,t,r,i,n,s,a)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${ee("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${ee("uniforms.roi","i",s)};
          var roi_hi = ${ee("uniforms.roi",`i + ${r.length}`,s)};
          var input_shape_i = ${ee("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${ee("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${a} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,gc=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${ee("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,ua=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",yc=(e,t,r,i,n)=>{let[s,a,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",a,`max(0, min(row, ${r[a]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${ua(e,l,s,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${a}];
      var col:${d} = originalIndices[${u}];
      ${i?`if (row < 0 || row > (${r[a]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${n};
      }`:""};
      row = max(0, min(row, ${r[a]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${s}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},wc=(e,t,r,i,n,s,a,u,l,d)=>{let h=r.length===2,[c,f]=h?[0,1]:[2,3],y=e.type.value,w=_=>{let k=_===c?"row":"col";return`
      fn ${k}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${y} {
        var output_index = ${t.indicesGet("output_indices",_)};
        var originalIdx: ${y} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[_]},
        ${i[_]}, ${r[_]}, ${s[_]}, ${s[_]} + ${r.length});
        var fractOriginalIdx: ${y} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[_]} - 1))) {
          return ${l};
        }
        var data: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${k}: ${y} = originalIdx + ${y}(i);
          if (${k} < 0 || ${k} >= ${r[_]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${k} = max(0, min(${k}, ${r[_]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",_,`u32(${k})`)};
          data[i + 1] = ${_===c?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${w(c)};
    ${w(f)};
  fn getCubicInterpolationCoefs(s: ${y}) -> array<${y}, 4> {
    var absS = abs(s);
    var coeffs: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${y} = 1.0 - absS;
    var twoMinusAbsS: ${y} = 2.0 - absS;
    var onePlusAbsS: ${y} = 1.0 + absS;
    coeffs[0] = ((${a} * onePlusAbsS - 5 * ${a}) * onePlusAbsS + 8 * ${a}) * onePlusAbsS - 4 * ${a};
    coeffs[1] = ((${a} + 2) * absS - (${a} + 3)) * absS * absS + 1;
    coeffs[2] = ((${a} + 2) * oneMinusAbsS - (${a} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${a} * twoMinusAbsS - 5 * ${a}) * twoMinusAbsS + 8 * ${a}) * twoMinusAbsS - 4 * ${a};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${y}, 4>, coefs: array<${y}, 4>) -> ${y} {
    var coefsSum: ${y} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${y} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},_c=(e,t,r,i,n)=>{let[s,a,u,l,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],h=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${h} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",a,`max(0, min(depth, ${r[a]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${ua(e,d,s,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${h} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${h} = originalIndices[${a}];
      var height:${h} = originalIndices[${u}];
      var width:${h} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[a]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[a]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${s}])`:"0"};

      var x111: ${h} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${h} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${h} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${h} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${h} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${h} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${h} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${h} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${h} = abs(depth - ${h}(depth1));
      var dx2: ${h} = abs(${h}(depth2) - depth);
      var dy1: ${h} = abs(height - ${h}(height1));
      var dy2: ${h} = abs(${h}(height2) - height);
      var dz1: ${h} = abs(width - ${h}(width1));
      var dz2: ${h} = abs(${h}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},bc=(e,t,r,i,n,s)=>{let a=e.dims,u=pc(s,t.axes,a.length),l=cc(a,i,n,t.axes),d=i.slice();i.length===0&&(d=a.map((b,I)=>b===0?1:l[I]/b),t.keepAspectRatioPolicy!=="stretch"&&(l=hc(a,d,t)));let h=J("output",e.dataType,l.length),c=P("input",e.dataType,a.length),f=B.size(l),y=a.length===l.length&&a.every((b,I)=>b===l[I]),w=t.coordinateTransformMode==="tf_crop_and_resize",_=t.extrapolationValue,k=c.type.value,$=b=>`
      ${y?"":`
      ${lc(t.coordinateTransformMode,k)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${gc(c,a)};
              ${dc(t.nearestMode,r,k)};
              ${mc(c,h,a,l,d.length,u.length,w)};
              `;case"linear":return`
              ${fc(h,a,l,d.length,u.length)};
              ${(()=>{if(a.length===2||a.length===4)return`${yc(c,h,a,w,_)}`;if(a.length===3||a.length===5)return`${_c(c,h,a,w,_)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(a.length===2||a.length===4)return`${wc(c,h,a,l,d,u,t.cubicCoeffA,w,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${b.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",u.length).declareVariables(c,h)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${y?"output[global_idx] = input[global_idx];":`
        let output_indices = ${h.offsetToIndices("global_idx")};
        var input_indices: ${c.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${c.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${a.length===2||a.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${n.length>0?n:""}|${u.length>0?u:""}|${y}|${t.mode==="nearest"?a.length:a}`,inputDependencies:["rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},{type:1,data:d},{type:1,data:u},...te(a,l)]})}},$c=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},vc=(e,t)=>{let r=[],i=[],n=[],s=$c(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");uc(e.inputs,t,s,r,i,n),e.compute(bc(e.inputs[0],t,s,r,i,n),{inputs:[0]})},xc=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,n=e.cubicCoeffA,s=e.excludeOutside!==0,a=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return be({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:n,excludeOutside:s,extrapolationValue:a,keepAspectRatioPolicy:u,mode:l,nearestMode:d})}}),kc,Sc,Ic,Jg=L(()=>{se(),ue(),de(),kc=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],s=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==s)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let a=e[3];if(a.dims.length!==1)throw new Error("Beta must be 1D");if(a.dims[a.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let a=e[4];if(a.dims.length!==1)throw new Error("Bias must be 1D");if(a.dims[a.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},Sc=(e,t,r,i)=>{let n=t.simplified,s=e[0].dims,a=B.size(s),u=s,l=a,d=s.slice(-1)[0],h=i?s.slice(0,-1).concat(1):[],c=!n&&e.length>3,f=e.length>4,y=i&&r>1,w=i&&r>2,_=r>3,k=64,$=Oe(d),b=[{type:12,data:l},{type:12,data:$},{type:12,data:d},{type:1,data:t.epsilon}],I=E=>{let A=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],O=[P("x",e[0].dataType,e[0].dims,$),P("skip",e[1].dataType,e[1].dims,$),P("gamma",e[2].dataType,e[2].dims,$)];c&&O.push(P("beta",e[3].dataType,e[3].dims,$)),f&&O.push(P("bias",e[4].dataType,e[4].dims,$)),O.push(J("output",e[0].dataType,u,$)),y&&O.push(J("mean_output",1,h)),w&&O.push(J("inv_std_output",1,h)),_&&O.push(J("input_skip_bias_sum",e[0].dataType,u,$));let x=De(e[0].dataType),D=De(1,$);return`

      ${E.registerUniforms(A).declareVariables(...O)}
      var<workgroup> sum_shared : array<${D}, ${k}>;
      var<workgroup> sum_squared_shared : array<${D}, ${k}>;

      ${E.mainStart([k,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${k};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${k};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${k-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${f?"bias[offset1d + i]":x+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${_?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${hr(x,$,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${k};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Bt("sum",$)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Bt("square_sum",$)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${y?"mean_output[global_idx] = mean;":""}
        ${w?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${x}(mean)`}) *
            ${x}(inv_std_dev) * gamma[offset1d + i]
            ${c?"+ beta[offset1d + i]":""};
        }
      }`},S=[{dims:u,dataType:e[0].dataType}];return r>1&&S.push({dims:h,dataType:1}),r>2&&S.push({dims:h,dataType:1}),r>3&&S.push({dims:s,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${$};${y};${w};${_}`,inputDependencies:e.map((E,A)=>"type")},getShaderSource:I,getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:b})}},Ic=(e,t)=>{kc(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Sc(e.inputs,t,e.outputCount,!1),{outputs:r})}}),Tc,Br,Ec,la,zc,Cc,Ac,Oc,e0=L(()=>{se(),ue(),Me(),de(),Tc=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},Br=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Ec=(e,t)=>{if(e.length>1){let r=Br(e,1),i=Br(e,2),n=Br(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),be({starts:r,ends:i,axes:n})}else return t},la=(e,t,r,i,n)=>{let s=e;return e<0&&(s+=r[i[t]]),n[t]<0?Math.max(0,Math.min(s,r[i[t]]-1)):Math.max(0,Math.min(s,r[i[t]]))},zc=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${ee("uniforms.input_shape","i",r.length)};
            let steps_i = ${ee("uniforms.steps","i",r.length)};
            let signs_i = ${ee("uniforms.signs","i",r.length)};
            let starts_i = ${ee("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Cc=(e,t)=>{let r=e[0].dims,i=B.size(r),n=t.axes.length>0?B.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],s=Br(e,4);s.forEach($=>$!==0||(()=>{throw new Error("step cannot be 0")})),s.length===0&&(s=Array(n.length).fill(1));let a=t.starts.map(($,b)=>la($,b,r,n,s)),u=t.ends.map(($,b)=>la($,b,r,n,s));if(n.length!==a.length||n.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let $=0;$<r.length;++$)n.includes($)||(a.splice($,0,0),u.splice($,0,r[$]),s.splice($,0,1));let l=s.map($=>Math.sign($));s.forEach(($,b,I)=>{if($<0){let S=(u[b]-a[b])/$,E=a[b],A=E+S*s[b];a[b]=A,u[b]=E,I[b]=-$}});let d=r.slice(0);n.forEach(($,b)=>{d[$]=Math.ceil((u[$]-a[$])/s[$])});let h={dims:d,dataType:e[0].dataType},c=J("output",e[0].dataType,d.length),f=P("input",e[0].dataType,e[0].dims.length),y=B.size(d),w=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:a.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:s.length}],_=[{type:12,data:y},{type:12,data:a},{type:6,data:l},{type:12,data:s},...te(e[0].dims,d)],k=$=>`
      ${$.registerUniforms(w).declareVariables(f,c)}
        ${zc(f,c,r)}
        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${c.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${c.setByOffset("global_idx",f.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${a.length}_${s.length}`,inputDependencies:["rank"]},getShaderSource:k,getRunData:()=>({outputs:[h],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:_})}},Ac=(e,t)=>{Tc(e.inputs,t);let r=Ec(e.inputs,t);e.compute(Cc(e.inputs,r),{inputs:[0]})},Oc=e=>{let t=e.starts,r=e.ends,i=e.axes;return be({starts:t,ends:r,axes:i})}}),Mc,Bc,Nc,Rc,t0=L(()=>{se(),ue(),Me(),Nt(),de(),Mc=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Bc=(e,t)=>{let r=e.inputs[0],i=r.dims,n=B.size(i),s=i.length,a=B.normalizeAxis(t.axis,s),u=a<i.length-1,l,d=[];u?(d=Array.from({length:s},(O,x)=>x),d[a]=s-1,d[s-1]=a,l=e.compute(Qe(r,d),{inputs:[r],outputs:[-1]})[0]):l=r;let h=l.dims,c=h[s-1],f=n/c,y=Oe(c),w=c/y,_=64;f===1&&(_=256);let k=(O,x)=>x===4?`max(max(${O}.x, ${O}.y), max(${O}.z, ${O}.w))`:x===2?`max(${O}.x, ${O}.y)`:x===3?`max(max(${O}.x, ${O}.y), ${O}.z)`:O,$=P("x",l.dataType,l.dims,y),b=J("result",l.dataType,l.dims,y),I=$.type.value,S=De(l.dataType)==="f32"?`var threadMax = ${I}(-3.4028234663852886e+38f);`:`var threadMax = ${I}(-65504.0h);`,E=O=>`
      var<workgroup> rowMaxShared : ${I};
      var<workgroup> rowSumShared : ${I};
      var<workgroup> threadShared : array<${I}, ${_}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${I} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${I}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${O.registerUniform("packedCols","i32").declareVariables($,b)}
      ${O.mainStart(_)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${_};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${S}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${I}(${k("threadShared[0]",y)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${I}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${I}(${Bt("threadShared[0]",y)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${I}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,A=e.compute({name:"Softmax",shaderCache:{hint:`${y};${_}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:h,dataType:l.dataType}],dispatchGroup:{x:f},programUniforms:[{type:6,data:w}]}),getShaderSource:E},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(Qe(A,d),{inputs:[A]})},Nc=(e,t)=>{Mc(e.inputs),Bc(e,t)},Rc=e=>be({axis:e.axis})}),da,Dc,Pc,Uc,qc,r0=L(()=>{se(),ue(),de(),da=e=>Array.from(e.getBigInt64Array(),Number),Dc=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(da(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Pc=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Uc=(e,t)=>{let r=e[0].dims,i=t??da(e[1]),n=Pc(r,i),s=B.size(n),a=e[0].dataType,u=P("input",a,r.length),l=J("output",a,n.length),d=h=>`
      const inputShape = ${u.indices(...r)};
      ${h.registerUniform("output_size","u32").declareVariables(u,l)}
      ${h.mainStart()}
      ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:[{type:12,data:s},...te(e[0].dims,n)]}),getShaderSource:d}},qc=e=>{Dc(e.inputs),e.compute(Uc(e.inputs),{inputs:[0]})}}),Wc,Lc,Vc,i0=L(()=>{se(),ue(),de(),Wc=(e,t,r,i,n)=>{let s=J("output_data",n,r.length,4),a=P("a_data",t[1].dataType,t[1].dims.length,4),u=P("b_data",t[2].dataType,t[2].dims.length,4),l=P("c_data",t[0].dataType,t[0].dims.length,4),d,h=(c,f,y)=>`select(${f}, ${c}, ${y})`;if(!i)d=s.setByOffset("global_idx",h(a.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let c=(f,y,w="")=>{let _=`a_data[index_a${y}][component_a${y}]`,k=`b_data[index_b${y}][component_b${y}]`,$=`bool(c_data[index_c${y}] & (0xffu << (component_c${y} * 8)))`;return`
            let output_indices${y} = ${s.offsetToIndices(`global_idx * 4u + ${y}u`)};
            let offset_a${y} = ${a.broadcastedIndicesToOffset(`output_indices${y}`,s)};
            let offset_b${y} = ${u.broadcastedIndicesToOffset(`output_indices${y}`,s)};
            let offset_c${y} = ${l.broadcastedIndicesToOffset(`output_indices${y}`,s)};
            let index_a${y} = offset_a${y} / 4u;
            let index_b${y} = offset_b${y} / 4u;
            let index_c${y} = offset_c${y} / 4u;
            let component_a${y} = offset_a${y} % 4u;
            let component_b${y} = offset_b${y} % 4u;
            let component_c${y} = offset_c${y} % 4u;
            ${f}[${y}] = ${w}(${h(_,k,$)});
          `};n===9?d=`
            var data = vec4<u32>(0);
            ${c("data",0,"u32")}
            ${c("data",1,"u32")}
            ${c("data",2,"u32")}
            ${c("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${c("output_data[global_idx]",0)}
            ${c("output_data[global_idx]",1)}
            ${c("output_data[global_idx]",2)}
            ${c("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,a,u,s)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},Lc=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,n=e[1].dataType,s=!(B.areEqual(t,r)&&B.areEqual(r,i)),a=t,u=B.size(t);if(s){let d=pr.calcShape(pr.calcShape(t,r,!1),i,!1);if(!d)throw new Error("Can't perform where op on the given tensors");a=d,u=B.size(a)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>Wc(d,e,a,s,n),getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...te(i,t,r,a)]})}},Vc=e=>{e.compute(Lc(e.inputs))}}),Gc,n0=L(()=>{wg(),In(),_g(),bg(),$g(),vg(),xg(),Eg(),Cg(),Ag(),Og(),Mg(),Bg(),Ng(),Rg(),Dg(),Pg(),Ug(),qg(),Wg(),Lg(),Vg(),Gg(),Hg(),Fg(),rp(),jg(),Kg(),Qg(),Zg(),Yg(),xn(),Xg(),cp(),Jg(),e0(),t0(),lp(),r0(),Nt(),Cn(),i0(),Gc=new Map([["Abs",[ku]],["Acos",[Su]],["Acosh",[Iu]],["Add",[hl]],["ArgMax",[lu,Sn]],["ArgMin",[uu,Sn]],["Asin",[Tu]],["Asinh",[Eu]],["Atan",[zu]],["Atanh",[Cu]],["Attention",[mu]],["AveragePool",[Lp,Wp]],["BatchNormalization",[_u]],["BiasAdd",[vu]],["BiasSplitGelu",[dl]],["Cast",[Ou,Au]],["Ceil",[Nu]],["Clip",[Bu]],["Concat",[Tl,El]],["Conv",[Vn,Wn]],["ConvTranspose",[td,Xl]],["Cos",[Ru]],["Cosh",[Du]],["CumSum",[id,nd]],["DepthToSpace",[ud,ld]],["DequantizeLinear",[Yp,Xp]],["Div",[fl]],["Einsum",[md,gd]],["Elu",[Pu,Er]],["Equal",[ml]],["Erf",[Uu]],["Exp",[qu]],["Expand",[bd]],["FastGelu",[vd]],["Floor",[Wu]],["FusedConv",[Vn,Wn]],["Gather",[Id,Sd]],["GatherElements",[Dd,Rd]],["GatherBlockQuantized",[Od,Md]],["GatherND",[Ed,zd]],["Gelu",[Lu]],["Gemm",[Wd,qd]],["GlobalAveragePool",[Gp,Vp]],["GlobalMaxPool",[Kp,jp]],["Greater",[_l]],["GreaterOrEqual",[$l]],["GridSample",[Zd,Yd]],["GroupQueryAttention",[gp]],["HardSigmoid",[Zu,Qu]],["InstanceNormalization",[_p]],["LayerNormalization",[vp]],["LeakyRelu",[Vu,Er]],["Less",[bl]],["LessOrEqual",[vl]],["Log",[nl]],["MatMul",[kp]],["MatMulNBits",[Ep,zp]],["MaxPool",[Hp,Fp]],["Mul",[gl]],["MultiHeadAttention",[tp,Jd]],["Neg",[Hu]],["Not",[Gu]],["Pad",[Pp]],["Pow",[yl]],["QuickGelu",[ol,Er]],["Range",[tc]],["Reciprocal",[Fu]],["ReduceMin",[iu]],["ReduceMean",[Xo]],["ReduceMax",[ru]],["ReduceSum",[au]],["ReduceProd",[nu]],["ReduceL1",[Jo]],["ReduceL2",[eu]],["ReduceLogSum",[ou]],["ReduceLogSumExp",[tu]],["ReduceSumSquare",[su]],["Relu",[ju]],["Resize",[vc,xc]],["RotaryEmbedding",[pp]],["ScatterND",[ac,nc]],["Sigmoid",[Ku]],["Sin",[Yu]],["Sinh",[Xu]],["Slice",[Ac,Oc]],["SkipLayerNormalization",[Ic]],["Split",[op,up]],["Sqrt",[Ju]],["Softmax",[Nc,Rc]],["Sub",[wl]],["Tan",[el]],["Tanh",[tl]],["ThresholdedRelu",[il,Er]],["Tile",[qc]],["Transpose",[_o,bo]],["Where",[Vc]]])}),Hc,a0=L(()=>{Xe(),xt(),de(),Hc=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,n){rt(e.programInfo.name);let s=this.backend.device,a=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let d of t)u.push({binding:u.length,resource:{buffer:d.buffer}});for(let d of r)u.push({binding:u.length,resource:{buffer:d.buffer}});n&&u.push({binding:u.length,resource:n});let l=s.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}a.setPipeline(e.computePipeline),a.setBindGroup(0,l),a.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Ye(e.programInfo.name)}dispose(){}build(e,t){rt(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&i.push(`enable ${d.extension};`)});let n=ho(t,this.backend.device.limits),s=e.getShaderSource(n),a=`${i.join(`
`)}
${n.additionalImplementations}
${s}`,u=r.createShaderModule({code:a,label:e.name});ge("verbose",()=>`[WebGPU] ${e.name} shader code: ${a}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return Ye(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&i<=n)return[t,r,i];let s=t*r*i,a=Math.ceil(Math.sqrt(s));if(a>n){if(a=Math.ceil(Math.cbrt(s)),a>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[a,a,a]}else return[a,a,1]}}}),Fc={};dr(Fc,{WebGpuBackend:()=>Zc});var jc,Kc,Qc,Zc,s0=L(()=>{Xe(),se(),xt(),Xs(),gg(),n0(),a0(),jc=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let n=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let s=e[i].dims.length;r.push(`${n};${s}`);break}case"dims":{let s=e[i].dims.join(",");r.push(`${n};${s}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},Kc=(e,t,r)=>{var n,s;let i=e.name;return(n=e.shaderCache)!=null&&n.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${jc(t,((s=e.shaderCache)==null?void 0:s.inputDependencies)??new Array(t.length).fill("dims"))}`,i},Qc=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Zc=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=s=>t.features.has(s)&&r.push(s)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(i),this.adapterInfo=new Qc(t.info||await t.requestAdapterInfo()),this.gpuDataManager=uo(this),this.programManager=new Hc(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,sn(e.logLevel,!!e.debug),this.device.onuncapturederror=s=>{s.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${s.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;rt(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var i;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let n=0;n<t.length/2;n++){let s=r[n],a=s.kernelId,u=this.kernels.get(a),l=u.kernelType,d=u.kernelName,h=s.programName,c=s.inputTensorViews,f=s.outputTensorViews,y=t[n*2],w=t[n*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=y);let _=Number(y-this.queryTimeBase),k=Number(w-this.queryTimeBase);if(!Number.isSafeInteger(_)||!Number.isSafeInteger(k))throw new RangeError("incorrect timestamp range");if((i=this.env.webgpu.profiling)!=null&&i.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:c.map($=>({dims:$.dims,dataType:vt($.dataType)})),outputsMetadata:f.map($=>({dims:$.dims,dataType:vt($.dataType)})),kernelId:a,kernelType:l,kernelName:d,programName:h,startTime:_,endTime:k});else{let $="";c.forEach((I,S)=>{$+=`input[${S}]: [${I.dims}] | ${vt(I.dataType)}, `});let b="";f.forEach((I,S)=>{b+=`output[${S}]: [${I.dims}] | ${vt(I.dataType)}, `}),console.log(`[profiling] kernel "${a}|${l}|${d}|${h}" ${$}${b}start time: ${_} ns, execution time: ${k-_} ns`)}vr("GPU",`${h}::${y}::${w}`)}e.unmap(),this.pendingQueries.delete(e)}),Ye()}run(e,t,r,i,n,s){rt(e.name);let a=[];for(let b=0;b<t.length;++b){let I=t[b].data;if(I===0)continue;let S=this.gpuDataManager.get(I);if(!S)throw new Error(`no GPU data for input: ${I}`);a.push(S)}let{outputs:u,dispatchGroup:l,programUniforms:d}=e.getRunData(t),h=r.length===0?u.map((b,I)=>I):r;if(h.length!==u.length)throw new Error(`Output size ${h.length} must be equal to ${u.length}.`);let c=[],f=[];for(let b=0;b<u.length;++b){if(!Number.isInteger(h[b])||h[b]<-3||h[b]>=s)throw new Error(`Invalid output index: ${h[b]}`);if(h[b]===-3)continue;let I=h[b]===-1,S=h[b]===-2,E=I||S?n(u[b].dataType,u[b].dims):i(h[b],u[b].dataType,u[b].dims);if(c.push(E),E.data===0)continue;let A=this.gpuDataManager.get(E.data);if(!A)throw new Error(`no GPU data for output: ${E.data}`);if(I&&this.temporaryData.push(A),S){let O=this.kernelPersistentData.get(this.currentKernelId);O||(O=[],this.kernelPersistentData.set(this.currentKernelId,O)),O.push(A)}f.push(A)}if(a.length!==t.length||f.length!==c.length){if(f.length===0)return Ye(e.name),c;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let y;if(d){let b=0,I=[];d.forEach(O=>{let x=typeof O.data=="number"?[O.data]:O.data;if(x.length===0)return;let D=O.type===10?2:4,U,H;O.type===10?(H=x.length>4?16:x.length>2?8:x.length*D,U=x.length>4?16:D*x.length):(H=x.length<=2?x.length*D:16,U=16),b=Math.ceil(b/H)*H,I.push(b);let K=O.type===10?8:4;b+=x.length>4?Math.ceil(x.length/K)*U:x.length*D});let S=16;b=Math.ceil(b/S)*S;let E=new ArrayBuffer(b);d.forEach((O,x)=>{let D=I[x],U=typeof O.data=="number"?[O.data]:O.data;if(O.type===6)new Int32Array(E,D,U.length).set(U);else if(O.type===12)new Uint32Array(E,D,U.length).set(U);else if(O.type===10)new Uint16Array(E,D,U.length).set(U);else if(O.type===1)new Float32Array(E,D,U.length).set(U);else throw new Error(`Unsupported uniform type: ${vt(O.type)}`)});let A=this.gpuDataManager.create(b,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(A.buffer,0,E,0,b),this.gpuDataManager.release(A.id),y={offset:0,size:b,buffer:A.buffer}}let w=this.programManager.normalizeDispatchGroupSize(l),_=w[1]===1&&w[2]===1,k=Kc(e,t,_),$=this.programManager.getArtifact(k);if($||($=this.programManager.build(e,w),this.programManager.setArtifact(k,$),ge("info",()=>`[artifact] key: ${k}, programName: ${e.name}`)),d&&$.uniformVariablesInfo){if(d.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${d.length} in program "${$.programInfo.name}".`);for(let b=0;b<d.length;b++){let I=d[b],S=I.type,E=typeof I.data=="number"?1:I.data.length,[A,O]=$.uniformVariablesInfo[b];if(S!==A||E!==O)throw new Error(`Uniform variable ${b} mismatch: expect type ${A} with size ${O}, got type ${S} with size ${E} in program "${$.programInfo.name}".`)}}if(ge("info",()=>`[ProgramManager] run "${e.name}" (key=${k}) with ${w[0]}x${w[1]}x${w[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let b={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:t,outputTensorViews:c};this.pendingKernels.push(b),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(b)}return this.programManager.run($,a,f,w,y),Ye(e.name),c}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let n=Gc.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let s={kernelType:e,kernelName:i,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,s)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let n=i.kernelType,s=i.kernelName,a=i.kernelEntry,u=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${s}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),ge("info",()=>`[WebGPU] Start to run kernel "[${n}] ${s}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),a(t,u[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${s}" failed. ${d}`)),1}finally{l&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${n}] ${s}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let s=n.get(t),a=this.gpuDataManager.registerExternalBuffer(r,i,s);return n.set(t,[a,r]),a}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await wn(this,e,t);return on(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){ge("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){ge("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){ge("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let n=this.getComputePassEncoder(),s=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(s.computePipeline),n.setBindGroup(0,s.bindGroup),n.dispatchWorkgroups(...s.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Yc={};dr(Yc,{init:()=>Jc});var pi,Xc,Jc,o0=L(()=>{se(),xt(),ue(),mg(),pi=class um{constructor(t,r,i,n){this.module=t,this.dataType=r,this.data=i,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(B.size(t)!==B.size(this.dims))throw new Error("Invalid new shape");return new um(this.module,this.dataType,this.data,t)}},Xc=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,n=r/e.PTR_SIZE,s=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*n++,s));let a=Number(e.getValue(i*n++,s));this.outputCount=Number(e.getValue(i*n++,s)),this.customDataOffset=Number(e.getValue(i*n++,"*")),this.customDataSize=Number(e.getValue(i*n++,s));let u=[];for(let l=0;l<a;l++){let d=Number(e.getValue(i*n++,s)),h=Number(e.getValue(i*n++,"*")),c=Number(e.getValue(i*n++,s)),f=[];for(let y=0;y<c;y++)f.push(Number(e.getValue(i*n++,s)));u.push(new pi(e,d,h,f))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var a;let r=((a=t==null?void 0:t.inputs)==null?void 0:a.map(u=>typeof u=="number"?this.inputs[u]:u))??this.inputs,i=(t==null?void 0:t.outputs)??[],n=(u,l,d)=>new pi(this.module,l,this.output(u,d),d),s=(u,l)=>{let d=Zt(u,l);if(!d)throw new Error(`Unsupported data type: ${u}`);let h=d>0?this.backend.gpuDataManager.create(d).id:0;return new pi(this.module,u,h,l)};return this.backend.run(e,r,i,n,s,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=i===4?"i32":"i64",s=this.module.stackAlloc((1+t.length)*i);this.module.setValue(s,t.length,n);for(let a=0;a<t.length;a++)this.module.setValue(s+i*(a+1),t[a],n);return this.module._JsepOutput(this.opKernelContext,e,s)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},Jc=async(e,t,r,i)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let s=(s0(),_r(Fc)).WebGpuBackend,a=new s;await a.initialize(r,i),n("webgpu",[a,u=>a.alloc(Number(u)),u=>a.free(u),(u,l,d,h=!1)=>{if(h)ge("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(d)}`),a.memcpy(Number(u),Number(l));else{ge("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let c=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(d));a.upload(Number(l),c)}},async(u,l,d)=>{ge("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${d}`),await a.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(u,l,d)=>a.createKernel(u,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>a.releaseKernel(u),(u,l,d,h)=>{ge("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${u}, contextDataOffset=${l}`);let c=new Xc(t,a,Number(l));return a.computeKernel(Number(u),c,h)},()=>a.captureBegin(),()=>a.captureEnd(),()=>a.replay()])}else{let s=new no(r);n("webnn",[s,()=>s.reserveTensorId(),a=>s.releaseTensorId(a),async(a,u,l,d,h)=>s.ensureTensor(a,u,l,d,h),(a,u)=>{s.uploadTensor(a,u)},async(a,u)=>s.downloadTensor(a,u),(a,u)=>s.registerMLContext(a,u),!!r.trace])}}}),eh,pa,ca,Rt,th,ha,ci,fa,ma,ga,ya,wa,_a,rh=L(()=>{Xe(),cg(),hg(),se(),Kt(),en(),Ls(),eh=(e,t)=>{Te()._OrtInit(e,t)!==0&&ve("Can't initialize onnxruntime.")},pa=async e=>{eh(e.wasm.numThreads,Xr(e.logLevel))},ca=async(e,t)=>{var i,n;(n=(i=Te()).asyncInit)==null||n.call(i);let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let s=e.webgpu.powerPreference;if(s!==void 0&&s!=="low-power"&&s!=="high-performance")throw new Error(`Invalid powerPreference setting: "${s}"`);let a=e.webgpu.forceFallbackAdapter;if(a!==void 0&&typeof a!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${a}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:s,forceFallbackAdapter:a}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let s=(o0(),_r(Yc)).init;t==="webgpu"&&await s("webgpu",Te(),e,r),t==="webnn"&&await s("webnn",Te(),e)}},Rt=new Map,th=e=>{let t=Te(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&ve("Can't get session input/output count.");let s=i===4?"i32":"i64";return[Number(t.getValue(n,s)),Number(t.getValue(n+i,s))]}finally{t.stackRestore(r)}},ha=(e,t)=>{let r=Te(),i=r.stackSave(),n=0;try{let s=r.PTR_SIZE,a=r.stackAlloc(2*s);r._OrtGetInputOutputMetadata(e,t,a,a+s)!==0&&ve("Can't get session input/output metadata.");let u=Number(r.getValue(a,"*"));n=Number(r.getValue(a+s,"*"));let l=r.HEAP32[n/4];if(l===0)return[u,0];let d=r.HEAPU32[n/4+1],h=[];for(let c=0;c<d;c++){let f=Number(r.getValue(n+8+c*s,"*"));h.push(f!==0?r.UTF8ToString(f):Number(r.getValue(n+8+(c+d)*s,"*")))}return[u,l,h]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},ci=e=>{let t=Te(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},fa=async(e,t)=>{var c,f,y,w;let r,i,n=Te();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=ci(e);let s=0,a=0,u=0,l=[],d=[],h=[];try{if([a,l]=await Ws(t),(t==null?void 0:t.externalData)&&n.mountExternalData){let x=[];for(let D of t.externalData){let U=typeof D=="string"?D:D.path;x.push(an(typeof D=="string"?D:D.data).then(H=>{n.mountExternalData(U,H)}))}await Promise.all(x)}for(let x of(t==null?void 0:t.executionProviders)??[])if((typeof x=="string"?x:x.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof x!="string"){let D=x,U=D==null?void 0:D.context,H=D==null?void 0:D.gpuDevice,K=D==null?void 0:D.deviceType,Q=D==null?void 0:D.powerPreference;U?n.currentContext=U:H?n.currentContext=await n.webnnCreateMLContext(H):n.currentContext=await n.webnnCreateMLContext({deviceType:K,powerPreference:Q})}else n.currentContext=await n.webnnCreateMLContext();break}s=await n._OrtCreateSession(r,i,a),(c=n.webgpuOnCreateSession)==null||c.call(n,s),s===0&&ve("Can't create a session."),(f=n.jsepOnCreateSession)==null||f.call(n),n.currentContext&&(n.webnnRegisterMLContext(s,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[_,k]=th(s),$=!!(t!=null&&t.enableGraphCapture),b=[],I=[],S=[],E=[],A=[];for(let x=0;x<_;x++){let[D,U,H]=ha(s,x);D===0&&ve("Can't get an input name."),d.push(D);let K=n.UTF8ToString(D);b.push(K),S.push(U===0?{name:K,isTensor:!1}:{name:K,isTensor:!0,type:vt(U),shape:H})}for(let x=0;x<k;x++){let[D,U,H]=ha(s,x+_);D===0&&ve("Can't get an output name."),h.push(D);let K=n.UTF8ToString(D);I.push(K),E.push(U===0?{name:K,isTensor:!1}:{name:K,isTensor:!0,type:vt(U),shape:H});{if($&&(t==null?void 0:t.preferredOutputLocation)===void 0){A.push("gpu-buffer");continue}let Q=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((y=t==null?void 0:t.preferredOutputLocation)==null?void 0:y[K])??"cpu",N=n.webnnIsGraphOutput;if(Q==="cpu"&&N&&N(s,K)){A.push("ml-tensor-cpu-output");continue}if(Q!=="cpu"&&Q!=="cpu-pinned"&&Q!=="gpu-buffer"&&Q!=="ml-tensor")throw new Error(`Not supported preferred output location: ${Q}.`);if($&&Q!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${Q}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);A.push(Q)}}let O=null;return A.some(x=>x==="gpu-buffer"||x==="ml-tensor"||x==="ml-tensor-cpu-output")&&(u=n._OrtCreateBinding(s),u===0&&ve("Can't create IO binding."),O={handle:u,outputPreferredLocations:A,outputPreferredLocationsEncoded:A.map(x=>x==="ml-tensor-cpu-output"?"ml-tensor":x).map(x=>nn(x))}),Rt.set(s,[s,d,h,O,$,!1]),[s,b,I,S,E]}catch(_){throw d.forEach(k=>n._OrtFree(k)),h.forEach(k=>n._OrtFree(k)),u!==0&&n._OrtReleaseBinding(u)!==0&&ve("Can't release IO binding."),s!==0&&n._OrtReleaseSession(s)!==0&&ve("Can't release session."),_}finally{n._free(r),a!==0&&n._OrtReleaseSessionOptions(a)!==0&&ve("Can't release session options."),l.forEach(_=>n._free(_)),(w=n.unmountExternalData)==null||w.call(n)}},ma=e=>{var l,d,h;let t=Te(),r=Rt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,s,a,u]=r;a&&(u&&t._OrtClearBoundOutputs(a.handle)!==0&&ve("Can't clear bound outputs."),t._OrtReleaseBinding(a.handle)!==0&&ve("Can't release IO binding.")),(l=t.jsepOnReleaseSession)==null||l.call(t,e),(d=t.webnnOnReleaseSession)==null||d.call(t,e),(h=t.webgpuOnReleaseSession)==null||h.call(t,e),n.forEach(c=>t._OrtFree(c)),s.forEach(c=>t._OrtFree(c)),t._OrtReleaseSession(i)!==0&&ve("Can't release session."),Rt.delete(e)},ga=async(e,t,r,i,n,s,a=!1)=>{if(!e){t.push(0);return}let u=Te(),l=u.PTR_SIZE,d=e[0],h=e[1],c=e[3],f=c,y,w;if(d==="string"&&(c==="gpu-buffer"||c==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(a&&c!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${s} when enableGraphCapture is true.`);if(c==="gpu-buffer"){let $=e[2].gpuBuffer;w=Zt(Qt(d),h);{let b=u.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');y=b(i,s,$,w)}}else if(c==="ml-tensor"){let $=e[2].mlTensor;w=Zt(Qt(d),h);let b=u.webnnRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');y=b(i,$,Qt(d),h)}else{let $=e[2];if(Array.isArray($)){w=l*$.length,y=u._malloc(w),r.push(y);for(let b=0;b<$.length;b++){if(typeof $[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);u.setValue(y+b*l,it($[b],r),"*")}}else{let b=u.webnnIsGraphInput,I=u.webnnIsGraphOutput;if(d!=="string"&&b&&I){let S=u.UTF8ToString(n);if(b(i,S)||I(i,S)){let E=Qt(d);w=Zt(E,h),f="ml-tensor";let A=u.webnnCreateTemporaryTensor,O=u.webnnUploadTensor;if(!A||!O)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let x=await A(i,E,h);O(x,new Uint8Array($.buffer,$.byteOffset,$.byteLength)),y=x}else w=$.byteLength,y=u._malloc(w),r.push(y),u.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,w),y)}else w=$.byteLength,y=u._malloc(w),r.push(y),u.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,w),y)}}let _=u.stackSave(),k=u.stackAlloc(4*h.length);try{h.forEach((b,I)=>u.setValue(k+I*l,b,l===4?"i32":"i64"));let $=u._OrtCreateTensor(Qt(d),y,w,k,h.length,nn(f));$===0&&ve(`Can't create tensor for input/output. session=${i}, index=${s}.`),t.push($)}finally{u.stackRestore(_)}},ya=async(e,t,r,i,n,s)=>{var K,Q,N,X;let a=Te(),u=a.PTR_SIZE,l=Rt.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],h=l[1],c=l[2],f=l[3],y=l[4],w=l[5],_=t.length,k=i.length,$=0,b=[],I=[],S=[],E=[],A=[],O=a.stackSave(),x=a.stackAlloc(_*u),D=a.stackAlloc(_*u),U=a.stackAlloc(k*u),H=a.stackAlloc(k*u);try{[$,b]=Rs(s),Ot("wasm prepareInputOutputTensor");for(let G=0;G<_;G++)await ga(r[G],I,E,e,h[t[G]],t[G],y);for(let G=0;G<k;G++)await ga(n[G],S,E,e,c[i[G]],_+i[G],y);Mt("wasm prepareInputOutputTensor");for(let G=0;G<_;G++)a.setValue(x+G*u,I[G],"*"),a.setValue(D+G*u,h[t[G]],"*");for(let G=0;G<k;G++)a.setValue(U+G*u,S[G],"*"),a.setValue(H+G*u,c[i[G]],"*");if(f&&!w){let{handle:G,outputPreferredLocations:xe,outputPreferredLocationsEncoded:W}=f;if(h.length!==_)throw new Error(`input count from feeds (${_}) is expected to be always equal to model's input count (${h.length}).`);Ot("wasm bindInputsOutputs");for(let q=0;q<_;q++){let ie=t[q];await a._OrtBindInput(G,h[ie],I[q])!==0&&ve(`Can't bind input[${q}] for session=${e}.`)}for(let q=0;q<k;q++){let ie=i[q];(K=n[q])!=null&&K[3]?(A.push(S[q]),a._OrtBindOutput(G,c[ie],S[q],0)!==0&&ve(`Can't bind pre-allocated output[${q}] for session=${e}.`)):a._OrtBindOutput(G,c[ie],0,W[ie])!==0&&ve(`Can't bind output[${q}] to ${xe[q]} for session=${e}.`)}Mt("wasm bindInputsOutputs"),Rt.set(e,[d,h,c,f,y,!0])}(Q=a.jsepOnRunStart)==null||Q.call(a,d),(N=a.webnnOnRunStart)==null||N.call(a,d);let Y;f?Y=await a._OrtRunWithBinding(d,f.handle,k,U,$):Y=await a._OrtRun(d,D,x,_,H,k,U,$),Y!==0&&ve("failed to call OrtRun().");let re=[],le=[];Ot("wasm ProcessOutputTensor");for(let G=0;G<k;G++){let xe=Number(a.getValue(U+G*u,"*"));if(xe===S[G]||A.includes(S[G])){re.push(n[G]),xe!==S[G]&&a._OrtReleaseTensor(xe)!==0&&ve("Can't release tensor.");continue}let W=a.stackSave(),q=a.stackAlloc(4*u),ie=!1,ne,ke=0;try{a._OrtGetTensorData(xe,q,q+u,q+2*u,q+3*u)!==0&&ve(`Can't access output tensor data on index ${G}.`);let lt=u===4?"i32":"i64",ft=Number(a.getValue(q,lt));ke=a.getValue(q+u,"*");let sr=a.getValue(q+u*2,"*"),dt=Number(a.getValue(q+u*3,lt)),qe=[];for(let $e=0;$e<dt;$e++)qe.push(Number(a.getValue(sr+$e*u,lt)));a._OrtFree(sr)!==0&&ve("Can't free memory for tensor dims.");let Ne=qe.reduce(($e,oe)=>$e*oe,1);ne=vt(ft);let Je=f==null?void 0:f.outputPreferredLocations[i[G]];if(ne==="string"){if(Je==="gpu-buffer"||Je==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let $e=[];for(let oe=0;oe<Ne;oe++){let We=a.getValue(ke+oe*u,"*"),mt=a.getValue(ke+(oe+1)*u,"*"),St=oe===Ne-1?void 0:mt-We;$e.push(a.UTF8ToString(We,St))}re.push([ne,qe,$e,"cpu"])}else if(Je==="gpu-buffer"&&Ne>0){let $e=a.jsepGetBuffer;if(!$e)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let oe=$e(ke),We=Zt(ft,Ne);if(We===void 0||!tn(ne))throw new Error(`Unsupported data type: ${ne}`);ie=!0,re.push([ne,qe,{gpuBuffer:oe,download:a.jsepCreateDownloader(oe,We,ne),dispose:()=>{a._OrtReleaseTensor(xe)!==0&&ve("Can't release tensor.")}},"gpu-buffer"])}else if(Je==="ml-tensor"&&Ne>0){let $e=a.webnnEnsureTensor,oe=a.webnnIsGraphInputOutputTypeSupported;if(!$e||!oe)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Zt(ft,Ne)===void 0||!rn(ne))throw new Error(`Unsupported data type: ${ne}`);if(!oe(e,ne,!1))throw new Error(`preferredLocation "ml-tensor" for ${ne} output is not supported by current WebNN Context.`);let We=await $e(e,ke,ft,qe,!1);ie=!0,re.push([ne,qe,{mlTensor:We,download:a.webnnCreateMLTensorDownloader(ke,ne),dispose:()=>{a.webnnReleaseTensorId(ke),a._OrtReleaseTensor(xe)}},"ml-tensor"])}else if(Je==="ml-tensor-cpu-output"&&Ne>0){let $e=a.webnnCreateMLTensorDownloader(ke,ne)(),oe=re.length;ie=!0,le.push((async()=>{let We=[oe,await $e];return a.webnnReleaseTensorId(ke),a._OrtReleaseTensor(xe),We})()),re.push([ne,qe,[],"cpu"])}else{let $e=Yr(ne),oe=new $e(Ne);new Uint8Array(oe.buffer,oe.byteOffset,oe.byteLength).set(a.HEAPU8.subarray(ke,ke+oe.byteLength)),re.push([ne,qe,oe,"cpu"])}}finally{a.stackRestore(W),ne==="string"&&ke&&a._free(ke),ie||a._OrtReleaseTensor(xe)}}f&&!y&&(a._OrtClearBoundOutputs(f.handle)!==0&&ve("Can't clear bound outputs."),Rt.set(e,[d,h,c,f,y,!1]));for(let[G,xe]of await Promise.all(le))re[G][2]=xe;return Mt("wasm ProcessOutputTensor"),re}finally{(X=a.webnnOnRunEnd)==null||X.call(a,d),a.stackRestore(O),I.forEach(Y=>a._OrtReleaseTensor(Y)),S.forEach(Y=>a._OrtReleaseTensor(Y)),E.forEach(Y=>a._free(Y)),$!==0&&a._OrtReleaseRunOptions($),b.forEach(Y=>a._free(Y))}},wa=e=>{let t=Te(),r=Rt.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&ve("Can't get an profile file name."),t._OrtFree(n)},_a=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),Dt,He,fr,Nr,Rr,hi,ba,fi,ir,nr,ih,nh,ah,sh,oh,uh,lh,dh,ph=L(()=>{Xe(),rh(),Kt(),Zi(),Dt=()=>!!Ee.wasm.proxy&&typeof document<"u",fr=!1,Nr=!1,Rr=!1,fi=new Map,ir=(e,t)=>{let r=fi.get(e);r?r.push(t):fi.set(e,[t])},nr=()=>{if(fr||!Nr||Rr||!He)throw new Error("worker not ready")},ih=e=>{switch(e.data.type){case"init-wasm":fr=!1,e.data.err?(Rr=!0,ba[1](e.data.err)):(Nr=!0,ba[0]()),hi&&(URL.revokeObjectURL(hi),hi=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=fi.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},nh=async()=>{if(!Nr){if(fr)throw new Error("multiple calls to 'initWasm()' detected.");if(Rr)throw new Error("previous call to 'initWasm()' failed.");if(fr=!0,Dt())return new Promise((e,t)=>{He==null||He.terminate(),As().then(([r,i])=>{try{He=i,He.onerror=s=>t(s),He.onmessage=ih,ba=[e,t];let n={type:"init-wasm",in:Ee};!n.in.wasm.wasmPaths&&(r||Fi)&&(n.in.wasm.wasmPaths={wasm:new URL("/Gemini-AI-Translator/assets/ort-wasm-simd-threaded.jsep-C887KxcQ.wasm",self.location.href).href}),He.postMessage(n),hi=r}catch(n){t(n)}},t)});try{await Ji(Ee.wasm),await pa(Ee),Nr=!0}catch(e){throw Rr=!0,e}finally{fr=!1}}},ah=async e=>{if(Dt())return nr(),new Promise((t,r)=>{ir("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:Ee}};He.postMessage(i)});await ca(Ee,e)},sh=async e=>Dt()?(nr(),new Promise((t,r)=>{ir("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};He.postMessage(i,[e.buffer])})):ci(e),oh=async(e,t)=>{if(Dt()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return nr(),new Promise((r,i)=>{ir("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},s=[];e instanceof Uint8Array&&s.push(e.buffer),He.postMessage(n,s)})}else return fa(e,t)},uh=async e=>{if(Dt())return nr(),new Promise((t,r)=>{ir("release",[t,r]);let i={type:"release",in:e};He.postMessage(i)});ma(e)},lh=async(e,t,r,i,n,s)=>{if(Dt()){if(r.some(a=>a[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(a=>a))throw new Error("pre-allocated output tensor is not supported for proxy.");return nr(),new Promise((a,u)=>{ir("run",[a,u]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:s}};He.postMessage(d,_a(l))})}else return ya(e,t,r,i,n,s)},dh=async e=>{if(Dt())return nr(),new Promise((t,r)=>{ir("end-profiling",[t,r]);let i={type:"end-profiling",in:e};He.postMessage(i)});wa(e)}}),$a,ch,hh,u0=L(()=>{Xe(),ph(),se(),Li(),Ls(),$a=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},ch=e=>{switch(e[3]){case"cpu":return new tt(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!tn(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return tt.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!rn(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return tt.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},hh=class{async fetchModelAndCopyToWasmMemory(e){return sh(await an(e))}async loadModel(e,t){rt();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await oh(r,t),Ye()}async dispose(){return uh(this.sessionId)}async run(e,t,r){rt();let i=[],n=[];Object.entries(e).forEach(c=>{let f=c[0],y=c[1],w=this.inputNames.indexOf(f);if(w===-1)throw new Error(`invalid input '${f}'`);i.push(y),n.push(w)});let s=[],a=[];Object.entries(t).forEach(c=>{let f=c[0],y=c[1],w=this.outputNames.indexOf(f);if(w===-1)throw new Error(`invalid output '${f}'`);s.push(y),a.push(w)});let u=i.map((c,f)=>$a(c,()=>`input "${this.inputNames[n[f]]}"`)),l=s.map((c,f)=>c?$a(c,()=>`output "${this.outputNames[a[f]]}"`):null),d=await lh(this.sessionId,n,u,a,l,r),h={};for(let c=0;c<d.length;c++)h[this.outputNames[a[c]]]=s[c]??ch(d[c]);return Ye(),h}startProfiling(){}endProfiling(){dh(this.sessionId)}}}),fh={};dr(fh,{OnnxruntimeWebAssemblyBackend:()=>xa,initializeFlags:()=>va,wasmBackend:()=>mh});var va,xa,mh,l0=L(()=>{Xe(),ph(),u0(),va=()=>{(typeof Ee.wasm.initTimeout!="number"||Ee.wasm.initTimeout<0)&&(Ee.wasm.initTimeout=0);let e=Ee.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),Ee.wasm.simd=!1),typeof Ee.wasm.proxy!="boolean"&&(Ee.wasm.proxy=!1),typeof Ee.wasm.trace!="boolean"&&(Ee.wasm.trace=!1),typeof Ee.wasm.numThreads!="number"||!Number.isInteger(Ee.wasm.numThreads)||Ee.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Ee.wasm.numThreads=1;else{let t=typeof navigator>"u"?Qm("node:os").cpus().length:navigator.hardwareConcurrency;Ee.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},xa=class{async init(e){va(),await nh(),await ah(e)}async createInferenceSessionHandler(e,t){let r=new hh;return await r.loadModel(e,t),r}},mh=new xa});Xe(),Xe(),Xe();var d0="1.24.3",gh=_s;{let e=(l0(),_r(fh)).wasmBackend;Ft("webgpu",e,5),Ft("webnn",e,5),Ft("cpu",e,10),Ft("wasm",e,10)}Object.defineProperty(Ee.versions,"web",{value:d0,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var p0=Object.freeze({__proto__:null,get InferenceSession(){return Wi},get TRACE(){return vr},get TRACE_EVENT_BEGIN(){return Ot},get TRACE_EVENT_END(){return Mt},get TRACE_FUNC_BEGIN(){return rt},get TRACE_FUNC_END(){return Ye},get Tensor(){return tt},default:gh,get env(){return Ee},get registerBackend(){return Ft}});const c0="PaddleOCR-ModelCache",mr="models",h0=1;let mi;const yh=()=>new Promise((e,t)=>{if(mi)return e(mi);const r=indexedDB.open(c0,h0);r.onerror=()=>{t("Error opening IndexedDB.")},r.onsuccess=()=>{mi=r.result,e(mi)},r.onupgradeneeded=()=>{const i=r.result;i.objectStoreNames.contains(mr)||i.createObjectStore(mr)}}),ka=e=>new Promise(async(t,r)=>{try{const a=(await yh()).transaction(mr,"readonly").objectStore(mr).get(e);a.onsuccess=()=>{t(a.result)},a.onerror=()=>{r("Error getting data from IndexedDB.")}}catch(i){r(i)}}),Sa=(e,t)=>new Promise(async(r,i)=>{try{const u=(await yh()).transaction(mr,"readwrite").objectStore(mr).put(t,e);u.onsuccess=()=>{r()},u.onerror=()=>{i("Error setting data in IndexedDB.")}}catch(n){i(n)}});let gi=null;const ar=(e,t)=>self.postMessage({type:e,payload:t});self.onmessage=async e=>{const{type:t,payload:r}=e.data;switch(t){case"load":try{const{key:i,detPath:n,recPath:s,dictPath:a}=r;ar("status","initializing");const u="det-model",l=`rec-model-${i}`,d=`dict-${i}`;let h=await ka(u),c=await ka(l),f=await ka(d);const y=[];h||y.push(fetch(n).then(_=>_.arrayBuffer()).then(async _=>{h=_,await Sa(u,_)})),c||y.push(fetch(s).then(_=>_.arrayBuffer()).then(async _=>{c=_,await Sa(l,_)})),f||y.push(fetch(a).then(_=>_.arrayBuffer()).then(async _=>{f=new TextDecoder("utf-8").decode(_),await Sa(d,f)})),y.length>0&&await Promise.all(y);const w=gh||p0;w.env.wasm.numThreads=0,w.env.wasm.simd=!0,w.env.wasm.wasmPaths="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/",Ya({canvas:(_,k)=>new OffscreenCanvas(_,k),imageData:(_,k,$)=>new ImageData(_,k,$)}),gi=await vm({det:{input:new Uint8Array(h)},rec:{input:new Uint8Array(c),decodeDic:f,optimize:{space:!1}},ort:w,ortOption:{executionProviders:["webgpu","wasm"]}}),ar("status","ready")}catch(i){console.error("OCR Worker Load Error:",i),ar("error",i.message||"Initialization failed")}break;case"recognize":if(!gi){ar("error","OCR Instance not initialized");return}try{const{imageData:i,imageBitmap:n}=r;let s=i;if(n){const d=new OffscreenCanvas(n.width,n.height),h=d.getContext("2d");if(!h)throw new Error("Worker canvas context error");h.drawImage(n,0,0),s=h.getImageData(0,0,d.width,d.height),n.close()}if(!s)throw new Error("No input image provided to worker");const a=performance.now(),u=await gi.ocr(s),l=performance.now();ar("result",{result:u,time:l-a})}catch(i){console.error("OCR Worker Recognition Error:",i),ar("error",i.message||"Recognition failed")}break;case"unload":gi=null,ar("status","uninitialized");break}}})();
