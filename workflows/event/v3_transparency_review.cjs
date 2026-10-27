// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const D=require('./v3_design.cjs');
(async()=>{
 const rows=[];for(const f of ["field_0967.json","field_1047.json","field_1048.json"])rows.push(...JSON.parse(D.fs.readFileSync(D.path.join(D.V,"field_0966",f))).records);
 const arts=rows.filter(r=>r.transparent),out=D.path.join(D.V,"field_0966","field_1328");D.fs.mkdirSync(out,{recursive:true});
 for(let n=0;n<arts.length;n+=8){const W=2400,H=1720;let s=D.rect(0,0,W,H,'#A9B8B1');for(let i=0;i<8&&n+i<arts.length;i++){
  const r=arts[n+i],x=(i%2)*1200,y=Math.floor(i/2)*430,b=await D.sharp(D.fs.readFileSync(D.path.join(D.OUT,r.relative+'.svg'))).resize(550,350,{fit:'inside'}).png().toBuffer();
  s+=D.rect(x+10,y+10,580,360,'#FFFFFF')+D.rect(x+600,y+10,580,360,'#102128');
  for(const ox of [25,615])s+=`<image x="${x+ox}" y="${y+15}" width="550" height="350" href="data:image/png;base64,${b.toString('base64')}"/>`;
  s+=D.T(r.id+' '+r.name,x+20,y+410,27,D.C.deep,1150);
 }await D.sharp(Buffer.from(D.wrap(W,H,s))).png().toFile(D.path.join(out,"field_1329_"+String(n/8+1).padStart(2,'0')+'.png'));}
 console.log('transparent artworks',arts.length,'sheets',Math.ceil(arts.length/8));
})();
