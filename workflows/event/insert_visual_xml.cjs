// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const fs=require('fs'),path=require('path');
const base=path.join(ARCHIVE.directory("workflows/event/insert_visual_xml.cjs"),'visual_docx'),orig=path.join(base,'unpacked');
let xml=fs.readFileSync(path.join(orig,'word/document.xml'),'utf8');
let rels=fs.readFileSync(path.join(orig,'word/_rels/document.xml.rels'),'utf8');
let types=fs.readFileSync(path.join(orig,'[Content_Types].xml'),'utf8');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const plain=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
let docId=2000,imageCount=0;
const namespace={wp:'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',a:'http://schemas.openxmlformats.org/drawingml/2006/main',pic:'http://schemas.openxmlformats.org/drawingml/2006/picture',r:'http://schemas.openxmlformats.org/officeDocument/2006/relationships'};
for(const [p,uri]of Object.entries(namespace)){if(!xml.includes('xmlns:'+p+'='))xml=xml.replace(/<w:document\b/,'<w:document xmlns:'+p+'="'+uri+'"');}
function fragment(n){
 const dir=path.join(base,'gallery'+n),f=fs.readFileSync(path.join(dir,'word/document.xml'),'utf8');
 let body=f.match(/<w:body>([\s\S]*?)<\/w:body>/)[1].replace(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/g,'');
 const rr=fs.readFileSync(path.join(dir,'word/_rels/document.xml.rels'),'utf8');
 for(const rel of rr.match(/<Relationship\b[^>]*\/?>/g)||[]){
  const type=rel.match(/Type="([^"]+)"/),id=rel.match(/Id="([^"]+)"/),target=rel.match(/Target="([^"]+)"/);
  if(!type||!type[1].endsWith('/image'))continue;
  const newId='rIdVisual'+n+'_'+(++imageCount),newName='visual_'+n+'_'+path.basename(target[1]);
  const media=path.join(orig,'word/media');fs.mkdirSync(media,{recursive:true});fs.copyFileSync(path.join(dir,'word',target[1]),path.join(media,newName));
  body=body.split('r:embed="'+id[1]+'"').join('r:embed="'+newId+'"');
  rels=rels.replace('</Relationships>','<Relationship Id="'+newId+'" Type="'+type[1]+'" Target="media/'+newName+'"/></Relationships>');
 }
 body=body.replace(/<wp:docPr\b[^>]*\bid="[^"]*"[^>]*>/g,m=>m.replace(/id="[^"]*"/,'id="'+(++docId)+'"'));
 return body;
}
function insertAfter(needle,body){
 let done=false;
 xml=xml.replace(/<w:p\b[^>]*>[\s\S]*?<\/w:p>/g,p=>{if(!done&&plain(p).includes(needle.replace(/\s+/g,''))){done=true;return p+body;}return p;});
 if(!done)throw new Error('Insertion anchor missing: '+needle);
}
insertAfter("field_0874：",fragment('04'));
insertAfter("field_0885：",fragment('05'));
if(!types.includes('Extension="png"'))types=types.replace('</Types>','<Default Extension="png" ContentType="image/png"/></Types>');
fs.writeFileSync(path.join(orig,'word/document.xml'),xml,'utf8');fs.writeFileSync(path.join(orig,'word/_rels/document.xml.rels'),rels,'utf8');fs.writeFileSync(path.join(orig,'[Content_Types].xml'),types,'utf8');
console.log('Inserted image relationships',imageCount);
if(imageCount!==51)throw Error('Expected 51 image relationships');
