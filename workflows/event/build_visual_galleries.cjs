// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const fs=require('fs'),path=require('path');
const D=ARCHIVE.external("docx");
const {Document,Packer,Paragraph,TextRun,ImageRun,Table,TableRow,TableCell,HeadingLevel,WidthType,ShadingType,BorderStyle,AlignmentType}=D;
const root=path.resolve(ARCHIVE.directory("workflows/event/build_visual_galleries.cjs"),"../output/field_0872_V1");
const items=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
if(items.length!==51||items.some(a=>!a.file||!fs.existsSync(path.join(root,a.file))))throw Error('All 51 images must exist before building');
const font='Microsoft YaHei', width=9866;
function para(text,opts={}){return new Paragraph({spacing:{after:90,line:250},children:[new TextRun({text,font,size:20,color:'162D3B'})],...opts});}
function cell(a,full){
 if(!a)return new TableCell({width:{size:full?width:width/2,type:WidthType.DXA},children:[para('')]});
 const file=path.join(root,a.file),buf=fs.readFileSync(file),iw=buf.readUInt32BE(16),ih=buf.readUInt32BE(20);
 let w=full?600:300,h=w*ih/iw;
 if(h>450){w=w*450/h;h=450;}
 return new TableCell({width:{size:full?width:width/2,type:WidthType.DXA},margins:{top:90,bottom:130,left:100,right:100},children:[
  new Paragraph({keepNext:true,spacing:{after:70},children:[new TextRun({text:a.id+'  '+a.name,font,size:20,bold:true,color:'006E72'})]}),
  new Paragraph({alignment:AlignmentType.CENTER,keepNext:true,spacing:{after:80},children:[new ImageRun({type:'png',data:buf,transformation:{width:Math.round(w),height:Math.round(h)},altText:{title:a.name,description:`field_0908${a.id}，${a.group}，field_0917`,name:a.name}})]}),
  para(`V1field_0918  |  field_0919 ${iw}:${ih}`,{spacing:{after:20},children:[new TextRun({text:`V1field_0918  |  field_0908 ${a.id}`,font,size:16,color:'586870'})]})
 ]});
}
function section(list,title){
 const children=[new Paragraph({heading:HeadingLevel.HEADING_2,pageBreakBefore:true,children:[new TextRun({text:title,font,size:26,bold:true,color:'006E72'})]}),para("field_0920 imagegen field_0921，field_0922。field_0923；field_0924、field_0925。")];
 const groups=[...new Set(list.map(a=>a.group))];
 for(const group of groups){
  children.push(new Paragraph({heading:HeadingLevel.HEADING_2,keepNext:true,children:[new TextRun({text:group,font,size:24,bold:true,color:'006E72'})]}));
  const g=list.filter(a=>a.group===group),full=group==="field_0926";
  const rows=[];
  for(let i=0;i<g.length;i+=full?1:2){rows.push(new TableRow({cantSplit:true,children:full?[cell(g[i],true)]:[cell(g[i],false),cell(g[i+1],false)]}));}
  const noBorder={style:BorderStyle.NONE,size:0,color:'FFFFFF'};
  children.push(new Table({width:{size:width,type:WidthType.DXA},columnWidths:full?[width]:[width/2,width/2],borders:{top:noBorder,bottom:noBorder,left:noBorder,right:noBorder,insideHorizontal:noBorder,insideVertical:noBorder},rows}));
  children.push(para(''));
 }
 return children;
}
async function build(){
 for(const [n,list,title]of[['04',items.slice(0,13),"04.1 field_0927"],['05',items.slice(13),"05.1 field_0928、field_0929"]]){
  const doc=new Document({sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1020,bottom:1020,left:1020,right:1020}}},children:section(list,title)}]});
  fs.writeFileSync(path.join(ARCHIVE.directory("workflows/event/build_visual_galleries.cjs"),'visual_docx',`gallery${n}.docx`),await Packer.toBuffer(doc));
 }
 console.log('gallery fragments built');
}
build().catch(e=>{console.error(e);process.exit(1)});
