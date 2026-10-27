// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const fs=require('fs'),path=require('path');
const root=path.resolve(ARCHIVE.directory("workflows/event/add_visual_references.cjs"),"../output/field_0872_V1");
const dir=path.join(ARCHIVE.directory("workflows/event/add_visual_references.cjs"),'visual_docx/unpacked');
const items=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
if(items.length!==51||items.some(a=>!fs.existsSync(path.join(root,a.file||'missing'))))throw Error('51 images required');
let xml=fs.readFileSync(path.join(dir,'word/document.xml'),'utf8'),rels=fs.readFileSync(path.join(dir,'word/_rels/document.xml.rels'),'utf8');
if(xml.includes("field_0873"))throw Error('References already inserted');
const e=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let rid=0;
function run(s,bold=false,size=18,color='162D3B'){return `<w:r><w:rPr><w:rFonts w:ascii="Microsoft YaHei" w:eastAsia="field_0002" w:hAnsi="Microsoft YaHei"/>${bold?'<w:b/>':''}<w:color w:val="${color}"/><w:sz w:val="${size}"/></w:rPr><w:t xml:space="preserve">${e(s)}</w:t></w:r>`;}
function link(label,target){const id='rIdVisualRef'+(++rid);rels=rels.replace('</Relationships>',`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${e(encodeURI(target))}" TargetMode="External"/></Relationships>`);return `<w:hyperlink r:id="${id}">${run(label,false,18,'006E72')}</w:hyperlink>`;}
function para(content,extra=''){return `<w:p><w:pPr>${extra}<w:spacing w:after="80" w:line="240" w:lineRule="auto"/></w:pPr>${content}</w:p>`;}
function after(needle,addition){let done=false;xml=xml.replace(/<w:p\b[^>]*>[\s\S]*?<\/w:p>/g,p=>{if(!done&&p.replace(/<[^>]*>/g,'').replace(/\s+/g,'').includes(needle)){done=true;return p+addition;}return p;});if(!done)throw Error('Missing anchor '+needle);}
after("field_0874：",para(run("field_0875：01-13field_0876，field_0877、field_0878/field_0879、field_0880、field_0881。")+link("field_0882","00_field_0883.html")+run("；field_0884。")));
after("field_0885：",para(run("field_0886：14-51field_0876，field_0887、field_0888、KTfield_0889、field_0890、field_0891、field_0892。")+link("field_0882","00_field_0883.html")+run("；field_0893Wordfield_0894。")));
let appendix=para(run("field_0873（V1）",true,28,'006E72'),'<w:pageBreakBefore/>');
appendix+=para(run("51field_0895PNG。field_0896，field_0897Wordfield_0898；field_0899imagesfield_0900，field_0901。"));
appendix+=para(link("field_0902","00_field_0883.html"));
appendix+=para(run("field_0903；field_0904、field_0905、field_0906。field_0907。"));
const widths=[600,2300,6966];
function row(vals,header=false){return `<w:tr><w:trPr><w:cantSplit/>${header?'<w:tblHeader/>':''}</w:trPr>`+vals.map((v,i)=>`<w:tc><w:tcPr><w:tcW w:w="${widths[i]}" w:type="dxa"/>${header?'<w:shd w:val="clear" w:fill="E9F4F2"/>':''}<w:tcMar><w:top w:w="60" w:type="dxa"/><w:start w:w="90" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:end w:w="90" w:type="dxa"/></w:tcMar></w:tcPr>${para(v)}</w:tc>`).join('')+'</w:tr>';}
appendix+='<w:tbl><w:tblPr><w:tblW w:w="9866" w:type="dxa"/><w:tblBorders>'+['top','left','bottom','right','insideH','insideV'].map(x=>`<w:${x} w:val="single" w:sz="3" w:color="D5E0E4"/>`).join('')+'</w:tblBorders></w:tblPr><w:tblGrid>'+widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('')+'</w:tblGrid>';
appendix+=row([run("field_0908",true),run("field_0909",true),run("field_0910（field_0911）",true)],true);
for(const a of items)appendix+=row([run(a.id),run(a.group),link(path.basename(a.file),a.file)]);
appendix+='</w:tbl>';
const end=xml.lastIndexOf('<w:sectPr');if(end<0)throw Error('Missing section properties');xml=xml.slice(0,end)+appendix+xml.slice(end);
fs.writeFileSync(path.join(dir,'word/document.xml'),xml,'utf8');fs.writeFileSync(path.join(dir,'word/_rels/document.xml.rels'),rels,'utf8');
console.log('Added hyperlink references',rid,'; embedded images: 0');
