// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const fs=require('fs');
const path=require('path');
const D=ARCHIVE.external("docx");
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,Header,Footer,PageNumber,HeadingLevel,AlignmentType,WidthType,BorderStyle,ShadingType}=D;
const data=JSON.parse(fs.readFileSync(path.join(ARCHIVE.directory("workflows/event/build_docx.cjs"),'plan.json'),'utf8'));
const out=path.resolve(ARCHIVE.directory("workflows/event/build_docx.cjs"),"../output/field_0912"); fs.mkdirSync(out,{recursive:true});
const clean=s=>s.replace(/[—–]/g,'-');
const font='Microsoft YaHei', navy='162D3B', teal='006E72', orange='E77A3F', gray='586870';
const pageWidth=11906, margin=1020, width=pageWidth-margin*2;
function run(text,options={}){return new TextRun({text:clean(text),font,...options});}
function para(text,options={}){return new Paragraph({spacing:{after:95,line:276},children:[run(text)],...options});}
function h2(text){return new Paragraph({heading:HeadingLevel.HEADING_2,keepNext:true,children:[run(text,{bold:true,color:teal})]});}
function table(block,small=false){
 const ws=block.widths.map(x=>Math.floor(width*x/100)); ws[ws.length-1]+=width-ws.reduce((a,b)=>a+b,0);
 const border={style:BorderStyle.SINGLE,size:3,color:'D5E0E4'};
 const rows=[block.headers,...block.rows].map((row,r)=>new TableRow({tableHeader:r===0,cantSplit:true,children:row.map((cell,c)=>new TableCell({width:{size:ws[c],type:WidthType.DXA},borders:{top:border,bottom:border,left:border,right:border},shading:{type:ShadingType.CLEAR,fill:r===0?navy:(r%2===0?'F1F6F7':'FFFFFF')},margins:{top:85,bottom:85,left:120,right:120},children:[new Paragraph({spacing:{after:0,line:small?232:250},children:[run(cell,{size:small?18:20,bold:r===0,color:r===0?'FFFFFF':navy})]})]}))}));
 return new Table({width:{size:width,type:WidthType.DXA},columnWidths:ws,rows});
}
let children=[];
for(let i=0;i<data.pages.length;i++){
 const page=data.pages[i], small=i===6;
 if(i===0){
  children.push(new Paragraph({spacing:{after:110},children:[run(data.title,{bold:true,size:40,color:'000000'})]}));
  children.push(para(data.subtitle,{spacing:{after:60},children:[run(data.subtitle,{size:21,color:teal,bold:true})]}));
  children.push(para(data.version,{spacing:{after:160},children:[run(data.version,{size:18,color:gray})]}));
 }
 children.push(new Paragraph({heading:HeadingLevel.HEADING_1,pageBreakBefore:i>0,keepNext:true,children:[run(page.heading,{color:'000000'})]}));
 children.push(para(page.lead,{spacing:{after:135,line:270},children:[run(page.lead,{color:teal,size:small?19:21})]}));
 for(const b of page.blocks){
  if(b.type==='h2'){children.push(h2(b.text));continue;}
  if(b.type==='table'){children.push(table(b,small));children.push(para('',{spacing:{after:20,line:50}}));continue;}
  if(b.type==='callout'){
   children.push(new Paragraph({spacing:{before:80,after:100,line:265},shading:{type:ShadingType.CLEAR,fill:'E9F4F2'},border:{left:{style:BorderStyle.SINGLE,size:14,color:teal,space:8}},children:[run(b.label+'  ',{bold:true,color:teal,size:20}),run(b.text,{size:20})]}));continue;
  }
  if(b.type==='source'){
   children.push(new Paragraph({spacing:{after:40,line:205},children:[new D.ExternalHyperlink({link:b.url,children:[run(b.label,{color:teal,size:16,underline:{type:'single'}})]}),run('：'+b.text,{size:16,color:gray})]}));continue;
  }
  let size=b.type==='small'?16:(small?19:21);
  children.push(new Paragraph({spacing:{after:b.type==='small'?70:90,line:b.type==='small'?215:(small?248:274)},children:[...(b.label?[run(b.label,{bold:true,size})]:[]),run(b.text,{size,color:b.type==='small'?gray:navy})]}));
 }
}
const doc=new Document({creator:"field_0913",title:data.title,description:data.subtitle,styles:{default:{document:{run:{font,size:21,color:navy},paragraph:{spacing:{after:90,line:274}}}},paragraphStyles:[{id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font,size:31,bold:true,color:'000000'},paragraph:{spacing:{before:100,after:145},outlineLevel:0}},{id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font,size:23,bold:true,color:teal},paragraph:{spacing:{before:140,after:85},outlineLevel:1}}]},sections:[{properties:{page:{size:{width:pageWidth,height:16838},margin:{top:margin,bottom:margin,left:margin,right:margin,header:440,footer:440}}},headers:{default:new Header({children:[new Paragraph({spacing:{after:0},border:{bottom:{style:BorderStyle.SINGLE,size:4,color:'B5CED0',space:6}},children:[run("field_0914",{size:16,color:gray}),run("    field_0915",{size:16,color:gray})]})]})},footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[run('2026.10.11  |  ',{size:16,color:gray}),new TextRun({children:[PageNumber.CURRENT],font,size:16,color:gray})]})]})},children}]});
Packer.toBuffer(doc).then(buf=>{let file=path.join(out,"field_0914_field_0916.docx");fs.writeFileSync(file,buf);console.log(file);});
