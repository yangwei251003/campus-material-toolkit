// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const D=require('./v3_design.cjs');const {C,assets,rect,line,poly,T,checkers,brush,base,drone,gate,icon,img,svgEmbed,badgeLogo,duo}=D;
const slogans=["field_1065","field_1066","field_1072","field_1074","field_1071","field_1267","field_1281","field_1265","field_1282","field_1283","field_1284","field_1285"];
const equip=["field_1286","field_1287","field_1288","FPVfield_1289","field_1290","field_1291","field_1292","field_1293","field_1294","field_1295","field_1296","field_1297"];
const ipWords=["field_1298","field_1299","field_1300","field_1301","field_1302","field_1303","field_1304","field_1292","field_1074","field_1305","field_1269","field_1306"];
const fun=[["field_1268"],["field_1266"],["field_1271"],["field_1263","field_1264"],["field_1269","field_1307"],["field_1308","field_1309"],["field_1310","field_1311"],["field_1270"],["field_1312","field_1313"],["field_1314","field_1315"],["field_1316"],["field_1317","field_1318"]];
function cutPath(k){return[
 'M500,20A480,480 0 1 1 499.99,20Z',
 'M100,25H900Q975,25 975,100V900Q975,975 900,975H100Q25,975 25,900V100Q25,25 100,25Z',
 'M70,110L500,20L930,110V700L500,980L70,700Z',
 'M120,40H880L985,240V760L880,960H120L15,760V240Z',
 'M70,45H930V825H670L500,975L455,825H70Z',
 'M500,20L620,130L815,80L840,280L980,400L870,550L930,750L730,790L610,975L445,865L250,940L210,745L25,615L140,460L70,260L280,225Z'
 ][k%6];}
function frame(k,id){const d=cutPath(k),clip='st'+id;let s=`<defs><clipPath id="${clip}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="white"/>`;return{d,clip,s};}
function sticker(n){const W=1000,H=1000,k=n-1,{d,clip,s:outer}=frame(k,n);let body='',name,category;
 if(n<=12){name=slogans[k];category="field_1319";const dark=k%3!==1;body=rect(0,0,W,H,dark?C.navy:C.gold)+poly('20,730 970,450 980,565 40,850',C.green)+checkers(60,92,11,58,dark?C.green:C.navy);
  body+=T(name,500,360,125,dark?C.gold:C.navy,680,true,'middle');
  if(k%3===0)body+=icon('drone',385,380,230,dark?C.white:C.navy);else if(k%3===1)body+=icon('gate',385,380,230,C.navy);else body+=icon('goggles',385,380,230,C.white);
  body+=duo(250,620,500,110)+T(k<6?"field_1320":"field_1321",500,757,28,dark?C.white:C.navy,400,false,'middle')+T(k<6?"field_1069":"field_0961",500,798,30,dark?C.white:C.navy,270,false,'middle')+T('2026',500,860,24,dark?C.white:C.navy,130,false,'middle');
 }else if(n<=24){name=equip[k-12];category="field_1322";body=rect(0,0,W,H,k%2?C.navy:C.mint)+poly('30,740 950,580 975,710 55,885',C.green);
  body+=T(name,500,320,100,k%2?C.gold:C.navy,690,true,'middle');
  if(n<=15){body+=gate(350,350,300,305,C.green)+drone(500,515,480,-12,'ST'+n);}
  else{const kind=['goggles','radio','battery','propeller','goggles','gate','flag','tools','clock'][n-16];body+=icon(kind,350,350,300,k%2?C.white:C.navy);}
  body+=T('FPV RACING',500,700,44,k%2?C.gold:C.navy,510,false,'middle')+rect(300,720,400,80,C.navy,12)+img(assets.mumu,330,730,340,67);
 }else if(n<=36){const i=n-24;name=ipWords[i-1];category="field_1323";body=rect(0,0,W,H,C.mint)+poly('20,750 1000,540 1000,800 20,975',C.green)+checkers(65,70,11,56,C.white);
  const file=D.path.join(D.A,'IP'+String(i).padStart(2,'0')+'.png');body+=img(file,200,140,600,540);
  body+=rect(130,700,740,105,C.navy,35)+T(name,500,n===36?765:780,90,C.gold,n===36?450:520,true,'middle');
 }else{name=fun[n-37].join('');category="field_1324";const ls=fun[n-37];body=rect(0,0,W,H,k%3===0?C.gold:C.navy)+poly('15,650 990,430 990,575 15,820',C.green)+checkers(90,100,11,55,k%3===0?C.navy:C.green);
  body+=icon(['bolt','flag','goggles','heart'][(n-37)%4],335,260,330,k%3===0?C.navy:C.gold);
  let y=ls.length===1?720:650;ls.forEach((s,i)=>body+=T(s,500,y+i*135,ls.length===1?130:110,k%3===0?C.navy:C.white,i?510:650,true,'middle'));
 }
 
 let s=outer+`<defs><clipPath id="${clip}Inner"><path d="${d}" transform="translate(500 500) scale(.957) translate(-500 -500)"/></clipPath></defs><g clip-path="url(#${clip}Inner)">${body}</g>`;
 return{W,H,s,cut:`<path d="${d}"/>`,name,category};
}
function original49(i){let a=sticker([13,21,16,1,2][i]);a.name=["field_1325","field_1326","FPVfield_1327","field_1065","field_1066"][i];return a;}
function sheet(arts,index){const W=2970,H=4200;let s=rect(0,0,W,H,C.white),cut='';for(let i=0;i<16;i++){const a=arts[index*16+i],x=(i%4+.5)*742.5-300,y=(Math.floor(i/4)+.5)*1050-300;s+=`<g transform="translate(${x} ${y}) scale(.6)">${a.s}</g>`;cut+=`<g transform="translate(${x} ${y}) scale(.6)">${a.cut}</g>`;}return{W,H,s,cut};}
module.exports={sticker,original49,sheet};
