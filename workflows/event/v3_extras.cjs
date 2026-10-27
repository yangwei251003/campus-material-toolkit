// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const D=require('./v3_design.cjs'),P=require('./v3_props.cjs');
(async()=>{
 const dir=D.path.join(D.OUT,"08_field_1093");D.fs.mkdirSync(dir,{recursive:true});
 const screens=[];
 for(const [id,group,name] of [['02',"01_field_0959","field_0931"],['F02',"02_field_0960","field_0931_field_0961"]]){
  const input=D.path.join(D.OUT,group,id+'_'+name+'.svg'),dest=D.path.join(dir,id+'_1920x1080.png');
  await D.sharp(D.fs.readFileSync(input)).resize(1920,1080,{fit:'fill'}).png().toFile(dest);screens.push({id,file:D.path.relative(D.OUT,dest).replaceAll('\\','/'),pixels:[1920,1080]});
 }
 const W=1600,H=1050;let s=D.rect(0,0,W,H,D.C.white)+D.T("field_1094、field_1095",60,85,55,D.C.navy,1470);
 s+=D.T("field_1096｜field_1097｜field_1098：mm",60,140,25,D.C.ink,1450);
 for(const [back,x] of [[false,100],[true,510]]){
  const a=P.flag(false,back),d=a.cut.match(/d="([^"]+)"/)[1];
  s+=`<g transform="translate(${x} 200) scale(.26)"><path d="${d}" fill="#E9F2EE" stroke="#002A40" stroke-width="6"/><defs><clipPath id="gf${back}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="none" stroke="#D02D91" stroke-width="30" stroke-dasharray="30 24" clip-path="url(#gf${back})"/><rect x="${back?70:140}" y="300" width="390" height="1800" fill="none" stroke="#00B97B" stroke-width="8" stroke-dasharray="30 24"/></g>`;
  s+=D.T(back?"field_0974：field_1099":"field_0975：field_1099",x-10,880,26,D.C.navy,340);
 }
 s+=D.rect(780,200,26,624,D.C.navy)+D.T("field_1100",850,260,32,D.C.navy,660)+D.T("field_1101100 × 000",850,320,27,D.C.ink,660)+D.T("field_110250field_0981",850,375,27,D.C.ink,660);
 s+=D.T("field_1103：field_110415field_1105",850,475,29,D.C.ink,680)+D.T("field_1106：field_1107",850,535,29,D.C.ink,680)+D.T("field_0976：000 × 000",850,625,33,D.C.navy,680)+D.T("field_1108，field_1109。",850,690,27,D.C.ink,680)+D.T("field_1110。",850,745,27,D.C.ink,680);
 s+=D.T("field_1111；field_1112。field_11133mmfield_1114。",60,985,28,D.C.navy,1480);
 await D.save("00_field_1115",'GUIDE01',"field_1116",{W,H,s},[297,210],{bleed:0,dpi:120,note:"field_1096，field_1117。"});
 D.fs.writeFileSync(D.path.join(D.V,"field_0966","field_1118.json"),JSON.stringify({screens,guide:D.records},null,2));console.log('screens and sewing guide ready');
})();
