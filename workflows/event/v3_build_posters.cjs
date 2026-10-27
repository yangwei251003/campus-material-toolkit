// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const D=require('./v3_design.cjs'),P=require('./v3_posters.cjs');
const names={'01':"field_0930",'02':"field_0931",'03':"field_0932",'04':"field_0933",'05':"field_08803field_0934",'06':"field_08802field_0934",'07':"field_08801field_0934",'08':"field_0935",'09':"field_0936",'10':"field_0937",'11':"field_0938",'12':"field_0939",'13':"field_0940",'14':"field_0926_Afield_0941",'15':"field_0926_Bfield_0942",'16':"field_0926_Cfield_0943",'17':"field_0944",'18':"field_0945",'19':"field_0946",'42':"field_0947",'43':"field_0948",'44':"field_0949"};
(async()=>{
 for(const id of Object.keys(names).sort()){
  let art,size,dpi=150,note='';
  if(['14','15','16'].includes(id)){art=P.wall(id);size=[6000,4000];dpi=25;note="field_0950、field_0951；field_0952。";}
  else if(['17','18','19'].includes(id)){art=P.stand(id);size=[800,1800];dpi=85;note="80×180cmfield_0953，field_0954。";}
  else if(id==='42'){art=P.directory42();size=[900,600];dpi=120;note="field_0955，field_0956。";}
  else if(id==='44'){art=P.schedule44();size=[900,600];dpi=120;note="field_0957，field_0958。";}
  else{art=P.poster(id);size=['02','10','11'].includes(id)?[1600,900]:id==='43'?[900,600]:['01','03','04'].includes(id)?[600,900]:[600,750];dpi=['02','10','11'].includes(id)?80:150;}
  await D.save("01_field_0959",id,names[id],art,size,{dpi,note});
 }
 for(const id of ['01','02','05','06','07','14','15','16']){
  const wall=['14','15','16'].includes(id),art=wall?P.wall(id,true):P.poster(id,true);const mm=wall?[6000,4000]:id==='02'?[1600,900]:id==='01'?[600,900]:[600,750];
  await D.save("02_field_0960",'F'+id,names[id]+"_field_0961",art,mm,{dpi:wall?25:id==='02'?80:150,note:"field_0962"+id+"field_0963；field_06219field_0964F26field_0965。"});
 }
 D.fs.writeFileSync(D.path.join(D.V,"field_0966","field_0967.json"),JSON.stringify({records:D.records,geometries:D.geometries,textAudit:D.textAudit},null,2));
})();
