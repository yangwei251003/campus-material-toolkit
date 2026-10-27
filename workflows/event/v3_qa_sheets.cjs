// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const D=require('./v3_design.cjs');
(async()=>{
 const r=[];for(const f of ["field_0967.json","field_1047.json","field_1048.json"])r.push(...JSON.parse(D.fs.readFileSync(D.path.join(D.V,"field_0966",f))).records);
 const q=D.path.join(D.V,"field_0966","field_1279");D.fs.mkdirSync(q,{recursive:true});
 for(let start=0;start<r.length;start+=6){const batch=r.slice(start,start+6),W=2000,H=2350;let s=D.rect(0,0,W,H,'#E9EEEB');for(let i=0;i<batch.length;i++){const x=(i%2)*1000,y=Math.floor(i/2)*780,a=batch[i],p=D.path.join(D.OUT,a.relative+'.svg');const png=await D.sharp(D.fs.readFileSync(p)).resize(930,680,{fit:'inside'}).png().toBuffer();s+=D.rect(x+20,y+10,960,710,'#FFFFFF',12)+`<image x="${x+35}" y="${y+20}" width="930" height="680" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${png.toString('base64')}"/>`+D.T(a.id+' '+a.name,x+40,y+760,28,D.C.ink,920);}
  await D.sharp(Buffer.from(D.wrap(W,H,s))).png().toFile(D.path.join(q,"field_1280_"+String(start/6+1).padStart(2,'0')+'.png'));
 }
 console.log('artwork records',r.length,'review sheets',Math.ceil(r.length/6));
})();
