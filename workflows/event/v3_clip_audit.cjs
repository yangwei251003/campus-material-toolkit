// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const D=require('./v3_design.cjs'),X=ARCHIVE.external("xml-js");
const records=[];for(const f of ["field_0967.json","field_1047.json","field_1048.json"])records.push(...JSON.parse(D.fs.readFileSync(D.path.join(D.V,"field_0966",f))).records);
function clone(x){return JSON.parse(JSON.stringify(x));}
function pick(e,target){if(e===target||e.name==='defs')return clone(e);const cs=(e.elements||[]).map(c=>pick(c,target)).filter(Boolean);if(!cs.length)return null;return{...e,attributes:{...(e.attributes||{})},elements:cs};}
function unclip(e){if(e.attributes)delete e.attributes['clip-path'];for(const c of e.elements||[])unclip(c);return e;}
async function pixels(root,target,W,H,raw){let p=pick(root,target);if(raw)p=unclip(p);const a=p.attributes={...p.attributes,width:W+200,height:H+200,viewBox:`-100 -100 ${W+200} ${H+200}`};
 if(!raw){p.elements=[{type:'element',name:'defs',elements:[{type:'element',name:'clipPath',attributes:{id:'qaTrim'},elements:[{type:'element',name:'rect',attributes:{x:0,y:0,width:W,height:H}}]}]},{type:'element',name:'g',attributes:{'clip-path':'url(#qaTrim)'},elements:p.elements}];}
 const svg=X.js2xml({elements:[p]},{compact:false});const b=await D.sharp(Buffer.from(svg)).resize(512,512,{fit:'inside'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});let n=0;for(let i=3;i<b.data.length;i+=4)if(b.data[i]>32)n++;return n;
}
(async()=>{const failures=[],results=[];let all=0;for(const r of records){const xml=D.fs.readFileSync(D.path.join(D.OUT,r.relative+'.svg'),'utf8'),root=X.xml2js(xml,{compact:false,ignoreComment:true}).elements.find(e=>e.name==='svg');const vb=root.attributes.viewBox.split(/\s+/).map(Number),targets=[];function scan(e){if(e.type==='element'&&e.name==='g'){
  if(e.attributes?.['aria-label'])targets.push([e,e.attributes['aria-label'],"field_1049"]);
  else if(e.attributes?.transform&&(e.elements||[]).find(c=>c.name==='path')?.attributes?.['fill-rule']==='evenodd')targets.push([e,"field_1050","field_1051"]);
 }if(e.name!=='defs')for(const c of e.elements||[])scan(c);}scan(root);
 for(const [t,label,kind] of targets){const normal=await pixels(root,t,vb[2],vb[3],false),raw=await pixels(root,t,vb[2],vb[3],true),loss=raw?Math.max(0,(raw-normal)/raw):0;let a={id:r.id,label,kind,raw_pixels:raw,visible_pixels:normal,clipped_fraction:loss};all++;if(loss>.012){failures.push(a);console.log('CLIP',r.id,label,loss.toFixed(3));}results.push(a);}
 }
 const j={checked_elements:all,failures,results};D.fs.writeFileSync(D.path.join(D.V,"field_0966","field_1052.json"),JSON.stringify(j,null,2));console.log('elements',all,'clipped',failures.length);
})();
