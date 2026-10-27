// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const fs=require('fs'),path=require('path'),sharp=require('sharp');
const {Document,Packer,Paragraph,TextRun,ImageRun,Header,Footer,AlignmentType,HeadingLevel,ExternalHyperlink,PageNumber,BorderStyle,ShadingType}=require('docx');
const OUT=path.resolve(ARCHIVE.directory("workflows/club/revise_teacher.cjs"),"../output/field_0001");
const BASE="field_0003_field_0672_field_0868";
const C={ink:'172B40',muted:'637489',blue:'2563A6',orange:'C26924',teal:'167D8D',purple:'7654A4',line:'BDCAD8'};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
function text(x,y,t,size=30,color=C.ink,bold=false){return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#${color}" font-weight="${bold?700:400}">${esc(t)}</text>`;}
function rect(x,y,w,h,lines,color,dark=false,size=30){let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#${dark?color:'F5F8FA'}" stroke="#${color}" stroke-width="2"/>`;lines.forEach((v,i)=>s+=text(x+w/2,y+h/2-(lines.length-1)*19+11+i*38,v,size,dark?'FFFFFF':C.ink,dark||i===0));return s;}
function line(x1,y1,x2,y2,color=C.line){return `<path d="M${x1},${y1} L${x2},${y2}" stroke="#${color}" stroke-width="3" fill="none"/>`;}
async function diagram(){
let s=rect(380,5,540,68,["field_0008／field_0009"],C.muted)+line(650,73,650,96)+rect(360,96,580,94,["field_0010","field_0679，field_0012"],C.ink,true)+line(650,190,650,227)+line(162,227,1137,227);
const cols=[{x:12,c:C.blue,name:"field_0013｜9 field_0014",lead:"field_0015 1 field_0014",roles:["field_0030 2 field_0014","field_0031 2 field_0014","field_0032 2 field_0014","field_0033 2 field_0014"]},{x:337,c:C.orange,name:"field_0017｜17 field_0014",lead:"field_0015 1 field_0014",teams:["A、B、C、D field_0035","field_0168 4 field_0014，field_0680 16 field_0014"],roles:["field_0038 1 field_0014","field_0039 1 field_0014","field_0040 1 field_0014","field_0041 1 field_0014"]},{x:662,c:C.teal,name:"field_0019｜17 field_0014",lead:"field_0015 1 field_0014",teams:["A、B、C、D field_0035","field_0168 4 field_0014，field_0680 16 field_0014"],roles:["field_0681 1 field_0014","field_0046 1 field_0014","field_0682 1 field_0014","field_0683 1 field_0014"]},{x:987,c:C.purple,name:"field_0021｜9 field_0014",lead:"field_0015 1 field_0014",roles:["field_0051 2 field_0014","field_0052 2 field_0014","field_0053 2 field_0014","field_0054 2 field_0014"]}];
for(const col of cols){const x=col.x,mid=x+150;s+=line(mid,227,mid,257)+rect(x,257,300,80,[col.name],col.c,true)+line(mid,337,mid,360)+rect(x+20,360,260,70,[col.lead],col.c);let top=470;
if(col.teams){s+=line(mid,430,mid,460)+rect(x+5,460,290,98,col.teams,col.c,false,28)+line(mid,558,mid,589)+text(mid,620,"field_0684",28,col.c,true);top=654;}else{s+=line(mid,430,mid,465)+text(mid,497,"field_0685",28,col.c,true);top=531;}
const rail=x+10;s+=line(mid,top-22,mid,top-10)+line(mid,top-10,rail,top-10)+line(rail,top-10,rail,top+31+3*88);col.roles.forEach((v,i)=>{const yy=top+i*88;s+=line(rail,yy+31,x+28,yy+31)+rect(x+28,yy,268,64,[v],col.c,false,27);});
if(col.teams){s+=text(mid,1046,col.name.startsWith("field_0060")?"field_0686 · field_0687":"field_0688 · field_0689",26,col.c,true);}else{s+=text(mid,1046,col.name.startsWith("field_0059")?"field_0690":"field_0691",26,col.c,true);}
}
s+=`<rect x="12" y="1090" width="1275" height="80" rx="12" fill="#EDF3F7"/>`+text(650,1140,"field_0692 52 field_0014＝field_0059 9＋field_0060 17＋field_0061 17＋field_0062 9",34,C.ink,true);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="1190" viewBox="0 0 1300 1190"><rect width="100%" height="100%" fill="white"/><g font-family="Microsoft YaHei,SimHei,sans-serif">${s}</g></svg>`;
fs.writeFileSync(path.join(OUT,"field_0693_field_0868.svg"),svg);const file=path.join(OUT,"field_0693_field_0868.png");await sharp(Buffer.from(svg)).png().toFile(file);return file;
}
function run(t,opts={}){return new TextRun({text:t,font:{ascii:'Aptos',eastAsia:"field_0002",hAnsi:'Aptos'},...opts});}
function p(t,size=22,opts={}){return new Paragraph({spacing:{line:285,after:85},...opts,children:[run(t,{size,...(opts.run||{})})]});}
function title(n,t,sub){return [p(n+" / field_0003",18,{run:{color:C.teal,bold:true},spacing:{after:100}}),new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{after:120},children:[run(t,{size:40,bold:true,color:'111111'})]}),p(sub,20,{run:{color:C.muted},spacing:{after:140,line:270}})];}
function h(t,c=C.ink){return p(t,26,{run:{bold:true,color:c},keepNext:true,spacing:{before:140,after:85}});}
function row(t,d){return new Paragraph({spacing:{after:105,line:290},children:[run(t+'  ',{bold:true,size:22}),run(d,{size:22})]});}
function band(t,c=C.teal){return p(t,22,{run:{color:c,bold:true},shading:{fill:'F0F5F8',type:ShadingType.CLEAR},border:{left:{color:c,size:18,style:BorderStyle.SINGLE,space:8}},indent:{left:100},spacing:{before:90,after:120,line:280}});}
function link(t,url){return new Paragraph({spacing:{after:90,line:230},children:[new ExternalHyperlink({link:url,children:[run(t,{size:17,color:C.blue,underline:{}})]})]});}
function event(t,d,label,url){return [row(t,d),link("field_0004｜"+label,url)];}
async function main(){const diagramPath=await diagram();const pages=[];
pages.push([...title('01',"field_0693","field_0056｜field_0868｜000.10.26"),new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:100},children:[new ImageRun({type:'png',data:fs.readFileSync(diagramPath),transformation:{width:650,height:595},altText:{title:"field_0693",description:"field_00599field_0014、field_006017field_0014、field_006117field_0014、field_00629field_0014，field_086952field_0014；field_0695",name:"field_0696"}})]}),band("field_0697：field_0085 · field_0086 · field_0087 · field_0088"),p("field_0698“field_0092、field_0093、field_0094”；field_0699，field_0700。field_0701；field_0702，field_0703。",19)]);
pages.push([...title('02',"field_0704","field_0705，field_0706；field_0680 18 field_0014"),h("field_0013｜9 field_0014＝field_0015 1＋field_0036 2",C.blue),
row("field_0015 1 field_0014","field_0029；field_0707，field_0708、field_0075、field_0709，field_0710。"),
row("field_0030 2 field_0014","field_0711、field_0115、field_0712、field_0713、field_0714。"),
row("field_0031 2 field_0014","field_0715、field_0716、field_0717；field_0718、field_0719。"),
row("field_0032 2 field_0014","field_0720，field_0721、field_0722，field_0137。"),
row("field_0033 2 field_0014","SYNTHETIC FINANCIAL FIELD field_0723"),
band("field_0142：field_0724＋field_0144＋field_0146＋field_0147",C.blue),
h("field_0021｜9 field_0014",C.purple),
row("field_0015 1 field_0014","field_0725，field_0726，field_0727，field_0728。"),
row("field_0051 2 field_0014","field_0729、field_0730、field_0731；field_0732、field_0733。"),
row("field_0052 2 field_0014","field_0734、field_0735；field_0563，field_0736。"),
row("field_0053 2 field_0014","field_0737、field_0738；field_0739，field_0740。"),
row("field_0054 2 field_0014","field_0741、field_0742；field_0743、field_0744、field_0745。"),
band("field_0584 → field_0082 → field_0587 → field_0588",C.purple),
p("field_0746：field_0593／field_0747；field_0633、field_0748；field_0749。field_0627，field_0750、field_0751。",19),
p("field_0752：Bristol field_0753、Triton UAS field_0754；field_0755。",18,{run:{color:C.muted}}),link("Bristol SU｜field_0653","https://example.invalid/reference"),link("Triton UAS｜field_0756","https://example.invalid/reference")]);
pages.push([...title('03',"field_0017｜field_0686，field_0687","17 field_0014＝field_0015 1＋4 field_0757｜field_0156"),
band("field_0168 4 field_0014：field_0038 1＋field_0039 1＋field_0040 1＋field_0041 1",C.orange),
row("field_0015 1 field_0014","field_0758，field_0759、field_0760，field_0761，field_0762。"),
row("field_0038｜field_0168 1 field_0014","field_0763、field_0764，field_0765，field_0766。"),
row("field_0039｜field_0168 1 field_0014","field_0177、field_0767；field_0768，field_0769。"),
row("field_0040｜field_0168 1 field_0014","field_0770，field_0771、field_0186、field_0772；field_0773。"),
row("field_0041｜field_0168 1 field_0014","field_0774、field_0775，field_0776、field_0777、field_0778。"),
h("field_0779"),p("field_0780：field_0781，field_0782、field_0783。field_0784：field_0785，field_0786、field_0787。"),p("field_0788，field_0206，field_0789；field_0215，field_0790。"),
h("field_0791｜field_0792，field_0793"),
...event("field_0243（field_0244）field_0245／iFlight field_0246","【field_0247】field_0794 FPV field_0249；field_0795，field_0796。","iDRC field_0254","https://example.invalid/reference"),
...event("field_0226","【field_0797】F9U field_0060；field_0798，field_0799。","field_0233｜000 field_0800","https://example.invalid/reference"),
...event("FAI Drone Racing World Cup｜field_0801","【field_0802】field_0803；field_0804。","FAI field_0805","https://example.invalid/reference"),
p("field_0806、field_0807。field_0808，field_0809。",18,{run:{color:C.muted}})]);
pages.push([...title('04',"field_0019｜field_0688，field_0689","17 field_0014＝field_0015 1＋4 field_0757｜field_0810"),
band("A、B、C、D field_0870；field_0812 1 field_0014，field_0813",C.teal),
row("field_0015 1 field_0014","field_0814，field_0815、field_0816；field_0817，field_0818，field_0819。"),
row("field_0681｜field_0168 1 field_0014","field_0820；field_0821、field_0822，field_0823。"),
row("field_0046｜field_0168 1 field_0014","field_0824、field_0380、field_0403、field_0825；field_0826，field_0384。"),
row("field_0682｜field_0168 1 field_0014","field_0365、field_0366、field_0367、field_0827，field_0828。"),
row("field_0683｜field_0168 1 field_0014","field_0829、field_0830；field_0831，field_0832。"),
h("field_0833"),p("field_0780：field_0834、field_0835，field_0836；field_0837，field_0838。"),p("field_0784：field_0839，field_0840、field_0841；field_0842，field_0843。"),p("field_0844、field_0845；field_0846，field_0847。field_0871。"),
h("field_0791｜field_0849"),
...event("field_0413 RoboCup field_0414","【field_0415】field_0850；field_0851，field_0852。","field_0423｜000 field_0298","https://example.invalid/reference"),
...event("field_0425（CRAIC）","【field_0853】field_0854，field_0855、field_0856，field_0857。","field_0434｜000 field_0858","https://example.invalid/reference"),
...event("“field_0505”field_0506","【field_0859】field_0860、field_0508、field_0861。","field_0514｜field_0862","https://example.invalid/reference"),
p("field_0863、field_0400、field_0401、field_0402、field_0403、field_0404、field_0405、field_0406、field_0407、field_0864；field_0865。field_0866、field_0867。",18,{run:{color:C.muted}})]);
const sections=pages.map((children)=>({properties:{page:{size:{width:11906,height:16838},margin:{top:700,bottom:700,left:1070,right:1070,header:300,footer:300}}},headers:{default:new Header({children:[p("field_0056  /  field_0003",14,{run:{color:C.muted}})]})},footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[run("field_0678    ",{size:16,color:C.muted}),new TextRun({children:[PageNumber.CURRENT],size:16}),run(' / ',{size:16}),new TextRun({children:[PageNumber.TOTAL_PAGES],size:16})]})]})},children}));
const doc=new Document({creator:"field_0673",title:"field_0674（field_0678）",styles:{default:{document:{run:{font:{ascii:'Aptos',eastAsia:"field_0002"},size:22,color:C.ink},paragraph:{spacing:{after:85,line:285}}}}},sections});
fs.writeFileSync(path.join(OUT,BASE+'.docx'),await Packer.toBuffer(doc));console.log(BASE+'.docx');
}
main().catch(e=>{console.error(e);process.exit(1)});
