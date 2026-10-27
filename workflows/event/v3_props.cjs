// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const D=require('./v3_design.cjs');const {C,assets,rect,line,poly,T,checkers,brush,base,header,dateLine,drone,gate,icon,img,svgEmbed,badgeLogo,duo}=D;
function shape(kind,W=1000,H=700){
 const shapes={
 bubble:'M50,80Q30,50 75,35H910Q970,35 970,95V530Q970,590 910,590H370L225,670L250,590H80Q30,590 30,540Z',
 bolt:'M110,100L430,75L500,18L520,70L960,30L905,210L975,225L865,390L945,420L835,630L500,615L390,680L367,620L45,657L105,450L25,440L140,255L50,240Z',
 slab:'M130,45H970L875,650H25Z',
 gate:'M160,680L35,570L115,110L300,25H840L955,165L900,600L730,680Z',
 goggles:'M55,165Q500,35 945,165L985,465L870,605H660L500,490L340,605H130L15,465Z M150,270L385,245L355,405L300,470H170Z M615,245L850,270L830,470H700L645,405Z',
 shield:'M80,80L500,25L920,80V450L500,675L80,450Z',
 cloud:'M85,270Q10,185 105,130Q180,30 280,100Q400,-15 500,75Q660,-15 730,105Q910,10 930,170Q1050,255 940,330Q1010,460 905,535Q890,650 730,610Q620,720 490,625Q350,725 235,625Q75,670 90,535Q-15,425 85,270Z',
 ticket:'M55,70H945V200Q855,250 945,300V560H55V400Q145,350 55,300Z',
 frame:'M35,25H965V675H35Z M170,160H830V510H170Z',
 radio:'M260,110V35H300V105H700V35H740V110L890,145Q960,155 970,230L945,600Q935,670 845,655L680,600H320L155,655Q65,670 55,600L30,230Q40,155 110,145Z',
 arrow:'M40,210H650V35L980,350L650,665V490H40Z',
 heart:'M500,645L90,330C-75,85 275,-65 500,135C725,-65 1075,85 910,330Z'
 };return shapes[kind]||shapes.bubble;
}
function kt(kind,lines,index,original=false){const W=1000,H=kind==='frame'?750:700,d=kind==='frame'?'M20,0H980Q1000,0 1000,20V730Q1000,750 980,750H20Q0,750 0,730V20Q0,0 20,0Z M165,175H835V555H165Z':shape(kind),cid='kt'+index;let s=`<defs><clipPath id="${cid}" clip-rule="evenodd"><path d="${d}" fill-rule="evenodd"/></clipPath></defs><path d="${d}" fill="white" fill-rule="evenodd"/>`;
 const inner=`<path d="${d}" fill="${C.navy}" fill-rule="evenodd" transform="translate(500 ${H/2}) scale(.95) translate(-500 ${-H/2})"/>`;
 let body=inner+poly('15,585 940,390 965,440 20,640',C.green)+poly('60,620 900,485 940,500 50,655',C.gold)+checkers(40,415,10,35,C.green)+checkers(735,120,7,28,C.green);
 if(kind==='frame'){
  body+=T(lines.join(''),500,115,68,C.gold,840,true,'middle')+rect(175,584,650,65,C.navy,5)+T('2026.10.21 — 10.25',500,632,32,C.white,620,false,'middle');body+=duo(240,674,520,55);
 }else if(kind==='goggles'){
  body+=T(lines.join(''),500,215,68,C.gold,580,true,'middle')+rect(135,505,230,60,C.navy,7)+img(assets.mumu,150,513,205,41);body+=rect(660,500,210,68,C.white,7)+(original?img(assets.school,665,489,200,67):svgEmbed(assets.team,680,503,170,61))+icon('bolt',440,320,110,C.gold);
 }else if(kind==='radio'){
  body+=icon('radio',70,220,205,C.green)+T(lines[0],600,302,92,C.white,530,true,'middle');if(lines[1])body+=T(lines[1],600,424,95,C.gold,530,true,'middle');body+=rect(350,480,400,100,C.navy,8)+img(assets.mumu,375,500,350,69);
 }else{
  const centerX=kind==='arrow'?400:500;let y=lines.length===1?365:315;
  lines.forEach((a,i)=>body+=T(a,centerX,y+i*126,lines.length===1?133:107,i?C.gold:C.white,kind==='arrow'?580:815,true,'middle'));
  const logos=kind==='bubble'?[295,470,410,88]:kind==='shield'?[300,430,400,90]:kind==='heart'?[340,430,320,80]:kind==='arrow'?[130,395,440,75]:[295,500,410,88];body+=duo(...logos);
  if(original)body+=rect(170,100,420,95,C.white,8)+img(assets.school,185,75,390,130)+drone(775,163,280,-8,'KT'+index);
  else if(kind==='bubble')body+=icon('flag',100,105,80,C.gold);
 }
 s+=`<defs><clipPath id="${cid}Inner" clip-rule="evenodd"><path d="${d}" fill-rule="evenodd" transform="translate(500 ${H/2}) scale(.95) translate(-500 ${-H/2})"/></clipPath></defs><g clip-path="url(#${cid}Inner)">${body}</g>`;
 return{W,H,s,cut:`<path d="${d}"/>`};
}
const ktOriginal=[['bubble',["field_1257，field_1258","field_1259"]],['bolt',["field_1260","field_1261"]],['slab',["field_1065"]],['gate',["field_1066"]],['goggles',['FPV']],['gate',["SYNTHETIC",'FPV CLUB']]];
const ktNew=[['bolt',["field_1074"]],['slab',["field_1262"]],['cloud',["field_1263","field_1264"]],['frame',["field_1071"]],['goggles',["field_1072"]],['frame',["field_1265"]],['bolt',["field_1266"]],['shield',["field_1267"]],['bubble',["field_1268"]],['radio',["field_1269"]],['arrow',["field_1270"]],['heart',["field_1271"]]];
function flag(friendly=false,back=false){const W=600,H=2400,d=back?'M600,2400V430C600,180 340,0 0,0V2240Z':'M0,2400V430C0,180 260,0 600,0V2240Z',mid=back?265:335,cid='flag'+(+friendly)+(+back);let body=base(W,H)+poly('0,0 600,0 600,460 0,720',C.gold)+poly('0,650 600,390 600,440 0,720',C.green);
 body+=img(assets.school,mid-195,230,390,130)+T("field_1060",mid,780,94,C.white,390,true,'middle');
 const title=friendly?["field_1272","field_0961"]:["FPVfield_0060","field_1069"];body+=T(title[0],mid,1005,96,C.gold,390,true,'middle')+T(title[1],mid,1150,90,C.gold,390,true,'middle');
 body+=T(friendly?"field_1072":"field_1065",mid,1330,65,C.white,390,true,'middle')+T(friendly?"field_1071":"field_1066",mid,1435,65,C.white,390,true,'middle');
 body+=img(assets.mumu,mid-195,1770,390,77)+T('2026.10.21',mid,1980,42,C.white,390,false,'middle')+T('— 10.25',mid,2050,42,C.white,390,false,'middle')+checkers(60,2155,10,45);
 
 return{W,H,s:`<defs><clipPath id="${cid}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${cid})">${body}</g>`,cut:`<path d="${d}"/>`};}
function flagSleeve(){const W=200,H=2400;return{W,H,s:rect(0,0,W,H,C.navy)+poly('0,0 200,0 200,2400 100,2400',C.green),cut:rect(0,0,W,H,'none')};}
function badge(back=false){const W=900,H=1300,d='M50,0H850Q900,0 900,50V1250Q900,1300 850,1300H50Q0,1300 0,1250V50Q0,0 50,0Z';let s=base(W,H)+header(W,155);if(!back){
 s+=T("field_1011",W/2,410,141,C.gold,790,true,'middle')+T('STAFF',W/2,505,68,C.white,630,false,'middle')+T("field_0914",W/2,590,38,C.white,770,false,'middle')+rect(150,690,600,300,C.white,12)+checkers(50,1080,14,49)+T('2026.10.21 — 10.25',W/2,1240,32,C.white,750,false,'middle');
 }else{
 s+=svgEmbed(assets.company,160,260,580,300)+img(assets.mumu,120,640,660,130)+T("field_1273",W/2,945,58,C.white,750,false,'middle')+T("field_1274 · field_1275",W/2,1050,43,C.gold,730,false,'middle');}
 return{W,H,s:`<defs><clipPath id="bd${back}"><path d="${d}"/></clipPath></defs><g clip-path="url(#bd${back})">${s}</g>`,cut:`<path d="${d}"/>`};}
function label(text='',blank=false){const W=1200,H=240,d='M24,0H1176Q1200,0 1200,24V216Q1200,240 1176,240H24Q0,240 0,216V24Q0,0 24,0Z';let s=rect(0,0,W,H,C.white,24,C.navy,4)+rect(0,0,20,H,C.green);if(!blank)s+=T(text,600,163,137,C.ink,1100,false,'middle');return{W,H,s,cut:`<path d="${d}"/>`};}
function armband(){const W=1000,H=700,d='M70,10H930Q990,10 990,70V630Q990,690 930,690H70Q10,690 10,630V70Q10,10 70,10Z';let s=base(W,H)+T("field_1011",W/2,330,172,C.gold,880,true,'middle')+T('STAFF',W/2,447,82,C.white,780,false,'middle')+img(assets.mumu,330,510,340,67);return{W,H,s:`<defs><clipPath id="arm"><path d="${d}"/></clipPath></defs><g clip-path="url(#arm)">${s}</g>`,cut:`<path d="${d}"/>`};}
function pilotLabel(){const W=1200,H=600,d='M20,5H1190L1115,595H5Z';let s=base(W,H)+header(W,110)+T('PILOT',65,300,151,C.white,760,true)+rect(820,150,290,160,C.white,10)+rect(90,365,995,105,C.white,8)+T("field_0914",650,545,39,C.white,1000,true,'middle');return{W,H,s:`<defs><clipPath id="pl"><path d="${d}"/></clipPath></defs><g clip-path="url(#pl)">${s}</g>`,cut:`<path d="${d}"/>`};}
function direction(){const W=1536,H=1024;let s=base(W,H)+header(W,125)+T("field_0985",100,445,158,C.white,1050,true)+T('RACE DIRECTION',110,565,75,C.gold,1100)+poly('180,720 1080,720 1080,635 1390,810 1080,985 1080,900 180,900',C.gold);return{W,H,s};}
function fan(back=false){const W=1000,H=1000,d='M200,20H800Q980,20 980,200V800Q980,980 800,980H200Q20,980 20,800V200Q20,20 200,20Z';let s=base(W,H)+rect(80,70,840,160,C.white,12)+img(assets.school,105,25,790,263);if(!back)s+=T("field_1065",500,405,155,C.white,850,true,'middle')+T("field_1066",500,595,155,C.gold,850,true,'middle')+drone(500,775,580,-10,'47');else s+=img(assets.mumu,135,350,730,145)+T("field_1065，field_1066",500,640,66,C.gold,790,true,'middle')+checkers(95,745,12,66);return{W,H,s:`<defs><clipPath id="fan${back}"><path d="${d}"/></clipPath></defs><g clip-path="url(#fan${back})">${s}</g>`,cut:`<path d="${d}"/>`};}
function notebook(back=false){const W=1000,H=1419;let s=base(W,H);if(!back){s+=img(assets.mumu,105,200,790,156)+T("field_1065",W/2,605,136,C.gold,850,true,'middle')+T("field_1066",W/2,780,136,C.white,850,true,'middle')+gate(330,930,350,300)+icon('drone',395,995,210,C.gold);}else{s+=duo(180,400,640,190)+T('2026.10.21 — 10.25',W/2,818,45,C.white,850,false,'middle')+T("field_0914",W/2,930,49,C.gold,850,true,'middle');}return{W,H,s};}
function medal(rank="field_1028",back=false){const W=700,H=700,d='M350,0A350,350 0 1 1 349.99,0Z';let s=`<circle cx="350" cy="350" r="350" fill="${C.gold}"/><circle cx="350" cy="350" r="317" fill="none" stroke="${C.navy}" stroke-width="9"/>`;
 if(!back){s+=T("field_1060",350,150,55,C.navy,530,false,'middle')+T("field_1070",350,218,40,C.navy,540,false,'middle')+T(rank,350,376,126,C.navy,510,false,'middle')+icon('drone',242,408,215,C.navy)+T('2026',350,643,40,C.navy,330,false,'middle');}else{s+=rect(55,190,590,162,C.navy,18)+img(assets.mumu,85,220,530,105)+T("field_1065，field_1066",350,445,50,C.navy,550,true,'middle')+T('2026.10.21 — 10.25',350,545,27,C.navy,510,false,'middle');}return{W,H,s,cut:`<path d="${d}"/>`};}
function ribbon(){const W=200,H=9000;let s=rect(0,0,W,H,C.navy)+rect(0,0,18,H,C.green)+rect(182,0,18,H,C.gold);for(let y=100;y<9000;y+=1000){s+=`<g transform="translate(30 ${y}) rotate(90)">${img(assets.mumu,0,-140,650,130)}</g>`+checkers(25,y+730,5,30);}return{W,H,s};}
function certificate(){const W=1485,H=1050;let s=rect(-20,-20,W+40,H+40,C.white)+rect(25,25,W-50,H-50,'none',0,C.navy,18)+rect(55,55,W-110,H-110,'none',0,C.gold,5)+header(W,118);
 s+=T("field_1034",W/2,349,136,C.navy,1250,false,'middle')+T("field_0914",W/2,451,62,C.navy,1290,true,'middle');
 s+=T("field_1276：",340,600,47,C.navy,370)+line(605,606,1160,606,C.navy,2)+T("field_1277：",340,722,47,C.navy,370)+line(605,728,1160,728,C.navy,2)+T("field_1278：",340,844,47,C.navy,370)+line(605,850,1160,850,C.navy,2);
 s+=checkers(85,926,10,28,C.navy)+checkers(1115,926,10,28,C.green);return{W,H,s};}
function printMark(kind,role){let W=1000,H=400,s='';if(kind==="SYNTHETIC"){s=img(assets.mumu,20,100,960,190);}else if(kind==='school'){s=rect(20,50,960,300,C.white,24)+img(assets.school,20,30,960,320);}else if(kind==='staff'){H=800;s=T("field_1011",500,330,174,C.gold,960,true,'middle')+T('STAFF',500,486,130,C.white,850,false,'middle')+img(assets.mumu,180,600,640,127);}else if(kind==='slogan'){H=250;s=T("field_1065，field_1066",500,180,118,C.gold,960,true,'middle');}else if(kind==='speed'){H=1300;s=poly('100,1180 500,15 760,0 430,940 900,555 985,650 400,1250',C.green)+poly('120,1240 320,1300 890,740 740,730',C.gold)+checkers(450,1060,6,70,C.white);}return{W,H,s};}
module.exports={shape,kt,ktOriginal,ktNew,flag,flagSleeve,badge,label,armband,pilotLabel,direction,fan,notebook,medal,ribbon,certificate,printMark};
