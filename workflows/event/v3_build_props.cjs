// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const D=require('./v3_design.cjs'),P=require('./v3_props.cjs'),S=require('./v3_stickers.cjs');
async function cutSave(group,id,name,art,mm,extra={}){const paper=/KT|贴纸|工牌|信息贴/.test(group)||id==='31';await D.save(group,id,name,art,mm,{cut:art.cut,transparent:true,bleed:paper?3:0,bleedColor:id.startsWith('29')?D.C.navy:D.C.white,dpi:300,...extra});}
(async()=>{
 for(let i=0;i<6;i++){const [kind,lines]=P.ktOriginal[i],a=P.kt(kind,lines,i+20,true);await cutSave("03_KTfield_0968_field_0969",String(i+20),"field_0970_"+lines.join(''),a,[500,350],{dpi:150});}
 for(let i=0;i<12;i++){const [kind,lines]=P.ktNew[i],a=P.kt(kind,lines,i+1,false),mm=kind==='frame'?[800,600]:[500,350];await cutSave("03_KTfield_0968_field_0969",'KT'+String(i+1).padStart(2,'0'),lines.join(''),a,mm,{dpi:150});}
 for(const friendly of [false,true])for(const back of [false,true]){const a=P.flag(friendly,back);await cutSave(friendly?"02_field_0960":"06_field_0971/26_field_0972",friendly?'F26'+(back?'B':'A'):'26'+(back?'B':'A'),(friendly?"field_0961":"field_0973")+"field_0972_"+(back?"field_0974":"field_0975"),a,[600,2400],{dpi:60,note:"field_097660×240cm；field_0977；field_0978。"});}
 await cutSave("06_field_0971/26_field_0972",'26C',"field_0979",P.flagSleeve(),[100,2400],{dpi:60,note:"field_0980100mmfield_0981，field_098250mmfield_0983；field_0984。"});
 await D.save("06_field_0971",'28',"field_0985_field_0986",P.direction(),[900,600],{dpi:120});
 for(const back of [false,true])await cutSave("05_field_0987",'29'+(back?'B':'A'),"field_0988_"+(back?"field_0974":"field_0975"),P.badge(back),[90,130],{dpi:300,note:"field_098960×30mmfield_0990；field_0991、field_099260×12mmfield_0993。"});
 await cutSave("06_field_0971",'30',"field_0994_field_0995",P.armband(),[100,70]);
 await cutSave("06_field_0971",'31',"field_0996_field_0997",P.pilotLabel(),[120,60]);
 await cutSave("05_field_0987",'LABEL01',"field_0998",P.label('',true),[60,12]);
 await cutSave("05_field_0987",'LABEL02',"field_0999",P.label('',true),[60,12]);
 const jobs=["field_1000","field_1001","field_1002","field_1003","field_1004","field_1005","field_1006","field_1007","field_1008","field_1009"];for(let i=0;i<jobs.length;i++)await cutSave("05_field_0987",'JOB'+String(i+1).padStart(2,'0'),jobs[i],P.label(jobs[i]),[60,12]);
 for(const id of ['45','46']){
  const g="06_field_0971/"+id+'_'+(id==='45'?"field_1010":"field_1011Polo")+"field_1012";
  for(const [suffix,name,kind,mm] of [['A',"field_1013","SYNTHETIC",[90,36]],['B',"field_1014",id==='45'?"SYNTHETIC":'staff',id==='45'?[260,104]:[260,208]],['C',"field_1015",'school',[80,32]],['D',"field_1016",'slogan',[260,65]],['E',"field_1017",'speed',[200,260]]])await cutSave(g,id+suffix,name,P.printMark(kind),mm,{dpi:300,note:"field_1018；field_1019、field_1020。"});
 }
 for(const back of [false,true])await cutSave("06_field_0971/47_field_1021",'47'+(back?'B':'A'),"field_1022_"+(back?"field_0974":"field_0975"),P.fan(back),[180,180]);
 for(const back of [false,true])await D.save("06_field_0971/48_field_1023",'48'+(back?'B':'A'),"A5field_1024_"+(back?"field_1025":"field_0975"),P.notebook(back),[148,210],{dpi:300});
 for(let i=0;i<5;i++){let a=S.original49(i);await cutSave("06_field_0971/49_field_1026",'49'+String(i+1),a.name,a,[60,60],{dpi:600});}
 for(let i=0;i<3;i++)await cutSave("06_field_0971/50_field_1027",'50'+String.fromCharCode(65+i),["field_1028","field_1029","field_1030"][i]+"field_1031",P.medal(["field_1028","field_1029","field_1030"][i]),[70,70],{dpi:600});
 await cutSave("06_field_0971/50_field_1027",'50D',"field_1032",P.medal('',true),[70,70],{dpi:600});
 await D.save("06_field_0971/50_field_1027",'50E',"field_1033_field_0975",P.ribbon(),[20,900],{bleed:0,dpi:150});await D.save("06_field_0971/50_field_1027",'50F',"field_1033_field_0974",P.ribbon(),[20,900],{bleed:0,dpi:150});
 await D.save("01_field_0959",'51',"field_1034_A4field_1035",P.certificate(),[297,210],{dpi:300});
 const stickerArts=[];for(let i=1;i<=48;i++){const a=S.sticker(i);stickerArts.push(a);await cutSave("04_field_1036/"+a.category,'ST'+String(i).padStart(2,'0'),a.name,a,[60,60],{dpi:600,note:"field_103760mm；field_1038，field_1039。"});}
 for(let i=0;i<3;i++){const a=S.sheet(stickerArts,i);await D.save("04_field_1036/A3field_1040",'A3_'+String(i+1).padStart(2,'0'),"16field_1041",a,[297,420],{cut:a.cut,dpi:300,bleed:3,note:"16field_1042/field_1043，4×4field_1044；field_1045，field_1046。"});}
 D.fs.writeFileSync(D.path.join(D.V,"field_0966","field_1047.json"),JSON.stringify({records:D.records,geometries:D.geometries,textAudit:D.textAudit},null,2));
})();
