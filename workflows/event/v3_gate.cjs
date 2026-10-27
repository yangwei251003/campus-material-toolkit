// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const D=require('./v3_design.cjs');const {C,assets,base,T,poly,rect,checkers,img,svgEmbed}=D;
(async()=>{
 const g="07_field_1174_field_1120";let s=D.bg('27',1536,1024)+D.drone(770,520,610,-10,'27');
 await D.save(g,'27R',"field_1175_field_1176",{W:1536,H:1024,s},[900,600],{dpi:110,pending:true,note:"field_1177；field_1178。"});
 for(const [id,name,type] of [['27A',"field_1179",'top'],['27B',"field_1180",'side'],['27C',"field_1181",'bottom']]){
  let W=1200,H=220,art=base(W,H);if(type==='top')art=rect(0,0,W,H,C.white)+poly('0,0 300,0 70,220 0,220',C.green)+img(assets.school,250,-40,700,250);else if(type==='side')art+=img(assets.mumu,250,35,700,139);else art+=T("field_1065",600,150,140,C.white,1000,true,'middle');
  await D.save(g,id,name+"_field_1182",{W,H,s:art},[1200,220],{dpi:100,pending:true,note:"field_1183，field_1184；field_1185、field_1186、field_1187。"});
 }
 D.fs.writeFileSync(D.path.join(D.V,"field_0966","field_1048.json"),JSON.stringify({records:D.records,geometries:D.geometries},null,2));
})();
