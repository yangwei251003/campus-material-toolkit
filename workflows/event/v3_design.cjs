// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const M=path.join(ARCHIVE.directory("workflows/event/v3_design.cjs"),'v3_tooling','node_modules');
const sharp=ARCHIVE.external("sharp");
const opentype=ARCHIVE.external("opentype.js");
const PDFDocument=ARCHIVE.external("pdfkit"),SVGtoPDF=ARCHIVE.external("svg-to-pdfkit");
const ROOT=path.resolve(ARCHIVE.directory("workflows/event/v3_design.cjs"),'..'),V=path.join(ROOT,'output',"field_1053_V3"),A=path.join(V,"field_0966","field_1054_R2field_1055");
const OUT=path.join(V,"V3_field_1056_20261016");
const C={navy:'#002A40',deep:'#001D30',green:'#00B97B',gold:'#F6E67A',white:'#FFFFFF',mint:'#DCF4E8',ink:'#032B41',grey:'#D8E1E5'};
const font=opentype.parse(fs.readFileSync(path.join(ARCHIVE.directory("workflows/event/v3_design.cjs"),'v3_tooling','msyhbd.ttf'))),eng=opentype.parse(fs.readFileSync("input/input_1057"));
const assets={drone:path.join(A,"field_1058_field_1059.png"),school:path.join(A,"field_1060_logofield_1061.svg"),mumu:path.join(A,"SYNTHETIC_logofield_1061.svg"),company:path.join(A,"field_1062_logofield_1061.svg"),team:path.join(A,"field_1063_logofield_1061.svg")};
const records=[],geometries=[],textAudit=[];let seq=0;const cache={};
function xml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
function img(p,x,y,w,h,more=''){if(p.endsWith('.svg'))return svgEmbed(p,x,y,w,h);if(!cache[p])cache[p]=fs.readFileSync(p).toString('base64');let mime=p.endsWith('.jpg')?'image/jpeg':'image/png';return `<image x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" href="data:${mime};base64,${cache[p]}" ${more}/>`;}
function svgEmbed(p,x,y,w,h){let s=fs.readFileSync(p,'utf8');const vb=s.match(/viewBox="([^"]+)"/)[1];const [a,b,sw,sh]=vb.split(/\s+/).map(Number);const z=Math.min(w/sw,h/sh);return `<g transform="translate(${x+(w-sw*z)/2-a*z} ${y+(h-sh*z)/2-b*z}) scale(${z})">${s.replace(/<svg[^>]*>|<\/svg>/g,'')}</g>`;}
function rect(x,y,w,h,fill,rx=0,stroke='',sw=1){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${sw}"`:''}/>`;}
function line(x1,y1,x2,y2,color,sw=2,more=''){return `<path d="M${x1},${y1}L${x2},${y2}" fill="none" stroke="${color}" stroke-width="${sw}" ${more}/>`;}
function poly(points,fill,more=''){return `<polygon points="${points}" fill="${fill}" ${more}/>`;}
function T(s,x,y,size,color=C.white,width=99999,italic=false,anchor='start'){
 const f=/^[\x00-\x7F]*$/.test(s)?eng:font;
 const advance=f.getAdvanceWidth(s,size);const z=Math.min(1,width/advance),sz=size*z;const aw=f.getAdvanceWidth(s,sz);let xx=x-(anchor==='middle'?aw/2:anchor==='end'?aw:0);
 const d=f.getPath(s,0,0,sz).toPathData(3); textAudit.push(s);
 return `<g aria-label="${xml(s)}" transform="translate(${xx} ${y})${italic?' skewX(-10)':''}"><path fill="${color}"${italic?` stroke="${color}" stroke-width="${sz*.012}" stroke-linejoin="miter"`:''} d="${d}"/></g>`;
}
function checkers(x,y,n=7,size=22,c1=C.green,c2=C.navy){let s='';for(let r=0;r<2;r++)for(let c=0;c<n;c++)if((r+c)%2===0)s+=rect(x+c*size,y+r*size,size,size,c1);return s;}
function brush(x,y,w,h,color=C.green){let s=poly(`${x},${y+h*.8} ${x+w*.07},${y+h*.12} ${x+w},${y} ${x+w*.96},${y+h*.8} ${x+w*.1},${y+h}`,color);for(let i=0;i<15;i++){let k=((i*37)%17)/17; s+=line(x+w*k,y+h*((i*13)%10)/10,x+w*Math.min(1,k+.17),y+h*((i*13)%10)/10-5,C.navy,1+(i%3));}return s;}
function base(W,H,light=false){let s=rect(-20,-20,W+40,H+40,light?'#F4F8F3':C.navy);s+=poly(`0,0 ${W*.58},0 ${W*.44},${H*.15} 0,${H*.1}`,light?'#FFFFFF':C.deep);s+=poly(`0,${H*.9} ${W},${H*.66} ${W},${H*.89} 0,${H}`,light?'#E0EDE2':'#00334B');s+=poly(`0,${H*.94} ${W},${H*.84} ${W},${H*.858} 0,${H*.956}`,C.green);s+=poly(`0,${H*.97} ${W},${H*.88} ${W},${H*.886} 0,${H*.978}`,C.gold);s+=checkers(W*.76,H*.91,8,W*.023,light?'#A7C9B9':'#005A5D');return s;}
function header(W,H=130,{team=false,school=true}={}){let s=rect(0,0,W,H,C.navy);if(school){s+=poly(`0,0 ${W*.57},0 ${W*.5},${H} 0,${H}`,C.white);s+=img(assets.school,W*.035,H*.12,W*.445,H*.68);}
 s+=svgEmbed(assets.company,W*.59,H*.08,W*.14,H*.78);s+=img(assets.mumu,W*.77,H*.18,W*.20,H*.62);s+=poly(`0,${H-11} ${W*.34},${H+25} 0,${H+2}`,C.green);s+=poly(`${W},${H-30} ${W*.81},${H+19} ${W},${H-16}`,C.gold);return s;}
function dateLine(W,y,color=C.white){return T('2026.10.21 — 10.25',W/2,y,31,color,W*.8,false,'middle');}
function drone(cx,cy,width,angle=0,id=''){
 const sw=1542,sh=1020,s=width/sw;const rad=angle*Math.PI/180;
 const pts=[[717,147],[320,460],[1235,350],[890,730]],nose=[686,514],tail=[1000,330];
 const f=([x,y])=>{x=(x-sw/2)*s;y=(y-sh/2)*s;return [cx+x*Math.cos(rad)-y*Math.sin(rad),cy+x*Math.sin(rad)+y*Math.cos(rad)];};
 geometries.push({id,source:"field_1058_field_1059.png",transform:{cx,cy,scaleX:s,scaleY:s,rotation:angle},motors:pts.map(f),camera:f(nose),rearConnector:f(tail),invariant:'single intact aircraft; no local arm/motor/propeller transform'});
 return `<g data-aircraft="whole-reference-photo" transform="translate(${cx} ${cy}) rotate(${angle}) scale(${s}) translate(${-sw/2} ${-sh/2})">${img(assets.drone,0,0,sw,sh)}</g>`;
}
function gate(x,y,w,h,color=C.green){let s=`<path d="M${x},${y+h}L${x},${y}L${x+w},${y}L${x+w},${y+h}" fill="none" stroke="${C.white}" stroke-width="${w*.095}" stroke-linejoin="round"/>`;s+=line(x,y,x+w,y,color,w*.047);for(let i=0;i<8;i++){s+=rect(x-w*.048,y+h*.48+i*h*.055,w*.096,h*.055,i%2?C.white:C.navy);s+=rect(x+w-w*.048,y+h*.48+i*h*.055,w*.096,h*.055,i%2?C.navy:C.white);}return s;}
function icon(kind,x,y,size,color=C.white){let s='',k=size/100;let stroke=`fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
 if(kind==='gate')s=`<path d="M14,86V14H86V86" ${stroke}/><path d="M30,28H70M30,43H70" ${stroke}/>`;
 if(kind==='flag')s=`<path d="M22,91V12M23,14Q48,4 60,20Q77,36 94,14V59Q76,78 58,57Q43,42 22,54" ${stroke}/>`;
 if(kind==='clock')s=`<circle cx="50" cy="55" r="37" ${stroke}/><path d="M50,55V30M50,55L70,64M40,5H60M50,5V15" ${stroke}/>`;
 if(kind==='safe')s=`<path d="M8,68H92M13,43V90M87,43V90" ${stroke}/><path d="M20,63L35,48M40,63L55,48M60,63L75,48M80,63L92,51" stroke="${C.gold}" stroke-width="9"/>`;
 if(kind==='goggles')s=`<path d="M8,33Q50,16 92,33L86,71Q66,83 54,62H46Q34,83 14,71Z" ${stroke}/><path d="M22,10V30M78,10V30" ${stroke}/><circle cx="30" cy="51" r="9" ${stroke}/><circle cx="70" cy="51" r="9" ${stroke}/>`;
 if(kind==='radio')s=`<rect x="13" y="27" width="74" height="61" rx="14" ${stroke}/><path d="M26,9V27M74,9V27" ${stroke}/><circle cx="32" cy="52" r="10" ${stroke}/><circle cx="68" cy="52" r="10" ${stroke}/><path d="M32,52L37,42M68,52L62,44M38,75H63" ${stroke}/>`;
 if(kind==='battery')s=`<rect x="24" y="17" width="52" height="73" rx="9" ${stroke}/><path d="M40,6H60M52,30L38,56H59L46,79" ${stroke}/>`;
 if(kind==='trophy')s=`<path d="M28,14H72V45Q72,68 50,68Q28,68 28,45ZM28,22H10V37Q10,53 29,53M72,22H90V37Q90,53 71,53M50,69V84M31,91H69" ${stroke}/>`;
 if(kind==='tools')s=`<path d="M25,10Q8,34 33,42L78,87L89,76L45,31Q52,10 34,10L32,26L22,20Z" ${stroke}/><path d="M77,8L90,22L69,43M34,63L13,86L24,96L46,73" ${stroke}/>`;
 if(kind==='drone'){
 s=`<path d="M24,24L76,76M24,76L76,24" stroke="${color}" stroke-width="10"/><rect x="40" y="30" width="20" height="40" rx="5" fill="${color}"/><circle cx="50" cy="31" r="8" fill="${C.green}"/>`;
 for(const [a,b] of [[24,24],[76,24],[24,76],[76,76]]){s+=`<circle cx="${a}" cy="${b}" r="6" fill="${C.gold}"/>`;for(const d of [0,120,240])s+=`<ellipse cx="${a+10}" cy="${b}" rx="14" ry="4" fill="${color}" transform="rotate(${d} ${a} ${b})"/>`;}}
 if(kind==='bolt')s=`<path d="M62,5L16,59H46L37,95L86,41H55Z" fill="${color}"/>`;
 if(kind==='propeller'){for(const d of [0,120,240])s+=`<ellipse cx="69" cy="50" rx="29" ry="10" fill="${color}" transform="rotate(${d} 50 50)"/>`;s+=`<circle cx="50" cy="50" r="11" fill="${C.gold}"/><circle cx="50" cy="50" r="4" fill="${C.navy}"/>`;}
 if(kind==='heart')s=`<path d="M50,88L13,51C-9,16 31,-1 50,25C69,-1 109,16 87,51Z" fill="${color}"/>`;
 return `<g transform="translate(${x} ${y}) scale(${k})">${s}</g>`;
}
function badgeLogo(x,y,w,h,team=false){return team?svgEmbed(assets.team,x,y,w,h):img(assets.mumu,x,y,w,h);}
function duo(x,y,w,h){return rect(x,y,w,h,C.white,10)+rect(x+w*.015,y+h*.06,w*.485,h*.88,C.navy,8)+badgeLogo(x+w*.04,y+h*.07,w*.43,h*.86)+badgeLogo(x+w*.54,y+h*.03,w*.42,h*.94,true);}
function bg(id,W,H,clip=null){const p=path.join(A,id+"_field_1064.png");if(!fs.existsSync(p))throw new Error('Missing background '+p);const i=img(p,0,0,W,H);if(!clip)return i;const cid='clip'+(++seq);return `<defs><clipPath id="${cid}">${rect(...clip,C.white)}</clipPath></defs><g clip-path="url(#${cid})">${i}</g>`;}
function footer(W,H,msg="field_1065，field_1066"){return brush(W*.1,H-168,W*.8,72,C.green)+T(msg,W*.5,H-113,47,C.white,W*.72,true,'middle')+dateLine(W,H-46);}
function eventTitles(W,y,friendly=false){let s='';if(friendly){s+=T("field_1060",W*.11,y,85,C.white,W*.8,true);s+=T("field_0960",W*.075,y+137,110,C.gold,W*.84,true);}else{s+=T("field_1067",W*.13,y,79,C.white,W*.77,true);s+=T("field_1068",W*.07,y+130,118,C.gold,W*.85,true);s+=T("field_1069",W*.07,y+245,118,C.gold,W*.85,true);}return s;}
function poster01(friendly=false){const W=1024,H=1536;let s=bg('01',W,H)+header(W);s+=T(friendly?"field_1060":"field_1067",135,278,91,C.white,790,true);s+=T(friendly?"field_0960":"field_1070",75,412,99,C.gold,880,true);let sy=465;s+=brush(125,sy,790,67)+T(friendly?"field_1071，field_1072":"field_1065，field_1066",W/2,sy+49,46,C.white,740,true,'middle');s+=rect(230,552,570,57,C.navy,8)+dateLine(W,593);s+=drone(510,975,780,-12,friendly?'F01':'01');s+=rect(0,1312,W,224,C.navy)+T(friendly?"field_1073 · field_1074 · field_1072":"field_1075 · field_1076 · field_1077",W/2,1368,30,C.white,890,false,'middle');s+=svgEmbed(assets.company,140,1410,260,85)+img(assets.mumu,560,1420,320,65);s+=poly(`0,1536 0,1498 1024,1508 1024,1536`,C.green);return{W,H,s};}
function poster02(friendly=false){const W=1672,H=941;let s=bg('02',W,H)+header(W,145);
 s+=T(friendly?"field_1060":"field_1078",110,345,112,C.white,850,true);s+=T(friendly?"field_0960":"field_1079",85,510,118,C.gold,940,true);s+=brush(100,586,820,76)+T(friendly?"field_1071，field_1072":"field_1065，field_1066",500,644,50,C.white,720,true,'middle');s+=rect(125,729,630,72,C.navy,9)+T('2026.10.21 — 10.25',145,781,38,C.white,610);s+=drone(1320,620,640,-12,friendly?'F02':'02');return{W,H,s};}
function rules43(){const W=1536,H=1024;let s=base(W,H)+bg('43',W,H,[900,125,636,425])+header(W,125);s+=T("field_1080",70,290,116,C.white,810,true)+T("field_1081",65,445,127,C.gold,840,true)+drone(1220,332,552,-6,'43');
 const names=["field_1082","field_1083","field_1084","field_1085"],lines=["field_1086","field_1087","field_1088","field_1089"],icons=['gate','flag','clock','safe'];
 for(let i=0;i<4;i++){let x=45+i*369;s+=rect(x,559,350,396,C.deep,14,C.green,2)+rect(x,786,350,169,C.white);s+=T('0'+(i+1),x+25,617,52,C.green,110,true)+icon(icons[i],x+91,635,173,C.white);s+=T(names[i]+'：',x+22,850,48,C.ink,312)+T(lines[i],x+22,912,38,C.ink,306);}
 return{W,H,s};}
function wrap(W,H,s){return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s}</svg>`;}
async function save(group,id,name,art,mm,{cut=null,bleed=3,transparent=false,note='',dpi=150,pending=false,bleedColor=null}={}){
 const dir=path.join(OUT,group),stem=id+'_'+name;fs.mkdirSync(dir,{recursive:true});const svg=wrap(art.W,art.H,art.s).replace(`width="${art.W}" height="${art.H}"`,`width="${mm[0]}mm" height="${mm[1]}mm"`);fs.writeFileSync(path.join(dir,stem+'.svg'),svg);
 let rasterW=Math.round(mm[0]/25.4*dpi),rasterH=Math.round(mm[1]/25.4*dpi);let limit=6200;const r=Math.min(1,limit/Math.max(rasterW,rasterH));rasterW=Math.round(rasterW*r);rasterH=Math.round(rasterH*r);
 await sharp(Buffer.from(svg),{limitInputPixels:false}).resize(rasterW,rasterH).png().withMetadata({density:Math.round(dpi*r)}).toFile(path.join(dir,stem+'.png'));
 const unit=Math.max(...mm)>5000?2:1,pW=(mm[0]+bleed*2)*72/25.4/unit,pH=(mm[1]+bleed*2)*72/25.4/unit;
 await new Promise((resolve,reject)=>{const doc=new PDFDocument({size:[pW,pH],pdfVersion:'1.7',margin:0,autoFirstPage:true,compress:true,info:{Title:stem+' | V3',Author:"field_1062 / field_1053",Subject:note}});const stream=fs.createWriteStream(path.join(dir,stem+'.pdf'));doc.pipe(stream);stream.on('finish',resolve);stream.on('error',reject);const b=bleed*72/25.4/unit;doc.page.dictionary.data.TrimBox=[b,b,pW-b,pH-b];doc.page.dictionary.data.BleedBox=[0,0,pW,pH];if(unit!==1)doc.page.dictionary.data.UserUnit=unit;const opts={preserveAspectRatio:'xMidYMid meet',warningCallback:m=>{if(!/font/i.test(m))fs.appendFileSync(path.join(V,"field_0966","PDFfield_1090.txt"),stem+': '+m+'\n');}};if(!transparent||bleed>0)doc.rect(0,0,pW,pH).fill(bleedColor||(transparent?C.white:C.navy));if(!transparent){const z=Math.max(pW/(mm[0]*72/25.4/unit),pH/(mm[1]*72/25.4/unit));const uw=mm[0]*72/25.4/unit*z,uh=mm[1]*72/25.4/unit*z;SVGtoPDF(doc,svg,(pW-uw)/2,(pH-uh)/2,{...opts,width:uw,height:uh});}SVGtoPDF(doc,svg,b,b,{...opts,width:mm[0]*72/25.4/unit,height:mm[1]*72/25.4/unit});doc.end();});
 if(cut){const cs=wrap(art.W,art.H,`<g id="CutContour" fill="none" stroke="#FF00FF" stroke-width="${art.W/mm[0]*.2}" fill-rule="evenodd">${cut}</g>`).replace(`width="${art.W}" height="${art.H}"`,`width="${mm[0]}mm" height="${mm[1]}mm"`);fs.writeFileSync(path.join(dir,stem+"_field_1091.svg"),cs);}
 records.push({id,name,group,stem,relative:group+'/'+stem,size_mm:mm,bleed_mm:bleed,pixels:[rasterW,rasterH],transparent,cut:!!cut,pending,note,text:[...art.s.matchAll(/aria-label="([^"]+)"/g)].map(x=>x[1]),sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,stem+'.png'))).digest('hex')});
 console.log('saved',id,name);
}
module.exports={ROOT,V,A,OUT,C,assets,records,geometries,textAudit,img,svgEmbed,rect,line,poly,T,checkers,brush,base,header,dateLine,drone,gate,icon,badgeLogo,duo,bg,footer,eventTitles,poster01,poster02,rules43,wrap,save,sharp,fs,path};
if(require.main===module)(async()=>{await save("01_field_0959",'01',"field_0930",poster01(),[600,900]);await save("01_field_0959",'02',"field_0931",poster02(),[1600,900],{dpi:80});await save("01_field_0959",'43',"field_0948",rules43(),[900,600],{dpi:120});fs.writeFileSync(path.join(V,"field_0966","field_1092.json"),JSON.stringify({records,geometries,textAudit},null,2));})();
