// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const D=require('./v3_design.cjs');const {C,assets,rect,line,poly,T,checkers,brush,base,header,dateLine,drone,gate,icon,img,svgEmbed,bg,footer}=D;
function poster(id,friendly=false){let W=1024,H=1536,s='';const gid=friendly?'F'+id:id;
 if(id==='01')return D.poster01(friendly);if(id==='02')return D.poster02(friendly);if(id==='43')return D.rules43();
 if(['05','06','07','08','09','12','13'].includes(id)){W=1122;H=1402;}if(['10','11'].includes(id)){W=1672;H=941;}
 s=bg(id,W,H)+header(W,id==='10'||id==='11'?125:128);
 if(id==='03'){
  s+=T("field_1188，",110,285,126,C.white,800,true)+T("field_1189！",50,421,114,C.gold,932,true)+T("field_1190",W/2,501,59,C.white,830,true,'middle');
  s+=T("field_1191 3 field_1192",W/2,602,48,C.white,830,false,'middle')+drone(425,880,660,-12,gid);
  s+=T('2026.10.21 — 10.25',65,1320,30,C.white,670)+T("field_1193",65,1384,31,C.white,670);
 }else if(id==='04'){
  s+=T("field_1194",70,293,85,C.white,880,true)+T("field_1195",55,438,133,C.gold,908,true);
  s+=brush(130,497,805,121)+T("field_1196 · field_1197 · field_1005",W/2,546,35,C.white,800,true,'middle')+T("field_1007 · field_1008 · field_1198",W/2,593,35,C.white,800,true,'middle');
  s+=drone(530,905,620,-11,gid)+T("field_1199",W/2,1490,30,C.white,810,false,'middle')+T('2026.10.21 — 10.25',90,1427,26,C.white,670);
 }else if(['05','06','07'].includes(id)){
  s+=T(friendly?"field_1200":"field_0914",58,255,85,C.gold,1000,true);
  s+=T(friendly?"field_1071，field_1072":"field_1065，field_1066",W/2,341,56,C.white,810,true,'middle');
  s+=T("field_0880",75,id==='07'?552:520,91,C.white,400,true)+T("field_0934",id==='05'?936:965,id==='05'?1080:780,106,C.white,150,true);
  const a=id==='05'?[430,820,650,-12]:id==='06'?[400,880,600,65]:[590,950,680,-6];s+=drone(...a,gid);
  s+=rect(260,1305,620,60,C.navy,6)+T('2026.10.21 — 10.25',W/2,1353,36,C.white,570,false,'middle');
 }else if(id==='08'){
  s+=drone(290,1060,520,-8,gid)+T("field_1201",610,1000,104,C.gold,460,true);
  s+=rect(640,1070,400,78,C.white,4)+rect(641,1190,398,57,'#00354A',4)+T('FPV PILOT',800,1322,31,C.green,370,false,'middle');
 }else if(id==='09'){
  s+=T("field_1202",90,435,176,C.white,450,true)+T("field_1203",565,435,176,C.gold,460,true)+drone(450,625,380,150,gid);
  s+=T("field_1065，field_1066",W/2,1302,61,C.white,900,true,'middle');
 }else if(id==='10'){
  s+=T("field_1204",110,321,173,C.gold,855,true)+T("field_0914",125,422,75,C.white,1040,true)+drone(500,658,650,-12,gid);
 }else if(id==='11'){
  s+=poly('610,150 1630,108 1615,318 610,338',C.navy)+T("field_1205",105,295,145,C.white,530,true)+T("field_1206",650,295,145,C.gold,900,true)+T("field_1207",W/2,400,92,C.white,970,true,'middle');
  s+=T("field_0914",W/2,466,41,C.white,1090,true,'middle')+drone(1000,691,650,-10,gid);
 }else if(id==='12'){
  s+=T("field_1208",60,333,101,C.gold,1000,true)+brush(150,365,850,108,C.gold)+T("field_1209",W/2,446,61,C.ink,850,true,'middle')+T("field_1210，field_1211",W/2,535,43,C.white,800,false,'middle');
  s+=drone(770,850,600,-6,gid);
 }else if(id==='13'){
  s+=T("field_1212，",100,286,112,C.white,935,true)+T("field_1213",95,422,128,C.gold,930,true)+T("field_1214",W/2,505,64,C.white,900,true,'middle')+T("FPVfield_1215",W/2,599,68,C.ink,770,true,'middle');
  s+=drone(360,985,535,0,gid)+T("field_1216",300,1278,36,C.white,270,false,'middle')+T("field_1217",596,1278,36,C.white,270,false,'middle')+T("field_1218",888,1278,36,C.white,270,false,'middle')+dateLine(W,1360);
 }
 return{W,H,s};
}
function wall(id,friendly=false){const W=1800,H=1200,light=id==='15';let s=base(W,H,light)+header(W,150);const ink=light?C.ink:C.white;
 s+=T(friendly?"field_1060":"field_1067",W/2,320,96,ink,1500,true,'middle')+T(friendly?"field_0960":"field_1070",W/2,475,136,light?C.navy:C.gold,1550,true,'middle');
 s+=brush(390,538,1020,87,light?C.green:C.green)+T(friendly?"field_1071，field_1072":"field_1065，field_1066",W/2,602,61,C.white,950,true,'middle');
 s+=T(friendly?"field_1074 · field_1073 · field_1072":'',W/2,690,36,ink,1400,false,'middle')+T('2026.10.21 — 10.25',W/2,755,35,ink,800,false,'middle');
 s+=`<path d="M-150,1150Q600,780 1950,1060M-100,1195Q850,850 1950,1150" fill="none" stroke="${C.green}" stroke-width="23"/><path d="M-100,1178Q850,822 1950,1100" fill="none" stroke="${C.gold}" stroke-width="9"/>`;
 s+=gate(90,720,210,350,C.green)+gate(1500,730,200,350,C.green);
 if(id!=='16'){s+=drone(230,595,190,-12,(friendly?'F':'')+id+'a')+drone(1580,595,170,160,(friendly?'F':'')+id+'b');}
 return{W,H,s};
}
function stand(id){const W=800,H=1800;let s=bg(id,W,H)+header(W,145);if(id==='17'){
  s+=T("field_1060",90,310,103,C.white,630,true)+T("field_1219",55,437,105,C.gold,690,true)+T("field_1212，field_1213",W/2,518,36,C.white,710,true,'middle');
  s+=drone(420,875,650,-12,id)+rect(0,1160,W,640,C.navy);
  ['radio','tools','trophy'].forEach((k,i)=>{let x=35+i*250;s+=rect(x,1180,230,180,C.deep,0,C.green,2)+icon(k,x+70,1200,90,C.gold)+T(["field_1220","field_1221","field_0061"][i],x+115,1335,39,C.white,210,false,'middle');});
  s+=T("field_1220 · field_1221 · field_0061 · field_1202",W/2,1430,44,C.white,710,false,'middle')+T("field_1222，field_1223",W/2,1490,29,C.white,700,false,'middle')+img(assets.mumu,65,1580,410,81)+rect(575,1560,175,175,C.white,4)+checkers(35,1745,14,32);
 }else if(id==='18'){
  s+=T("field_1224",65,297,98,C.white,680,true)+T("field_1225",65,423,114,C.gold,660,true)+T("field_1226 · field_1227 · field_1228",W/2,501,35,C.white,715,true,'middle');
  s+=gate(245,550,380,465)+drone(420,850,650,-12,id);
  const labels=["field_1229","field_1230","field_1231","field_1232","field_1233","field_1234"];for(let i=0;i<6;i++){let x=30+(i%3)*255,y=1115+Math.floor(i/3)*99;s+=rect(x,y,235,79,C.deep,5,C.green,2)+T(labels[i],x+117,y+50,29,C.white,215,false,'middle');}
  s+=T("field_1217 · field_1235",W/2,1376,34,C.ink,700,false,'middle');
 }else{
  s+=T("field_1236",60,335,103,C.white,680,true)+T("field_1237",55,466,125,C.gold,690,true)+T("field_1238 · field_1239 · field_1240",W/2,558,35,C.white,720,true,'middle');
  s+=drone(430,1250,550,0,id);
 }return{W,H,s};}
function directory42(){const W=1536,H=1024;let s=base(W,H)+header(W,125)+T("field_0947",80,278,122,C.gold,1100,true);const labels=["field_1241","field_1242 A","field_1242 B","field_1243","field_1244","field_1245","field_1246","field_1006"];const notes=["field_1247","field_1248","field_1249，field_1250","field_1251","field_1252","field_1253","field_1254","field_1255"];
 labels.forEach((x,i)=>{let xx=65+(i%4)*367,yy=350+Math.floor(i/4)*282;s+=rect(xx,yy,337,248,C.white,6)+rect(xx,yy,337,12,i===3?C.gold:C.green)+T('0'+(i+1),xx+24,yy+64,42,C.green,125,true)+T(x,xx+24,yy+142,40,C.ink,292)+T(notes[i],xx+24,yy+202,24,C.ink,292);});return{W,H,s};}
function schedule44(){const W=1536,H=1024;let s=bg('44',W,H)+header(W,125)+T("field_1256",66,305,130,C.gold,795,true)+rect(60,330,710,66,C.navy,6)+T('2026.10.21 — 10.25',78,377,39,C.white,685)+drone(470,672,675,-12,'44');
 
 return{W,H,s};}
module.exports={poster,wall,stand,directory42,schedule44};
