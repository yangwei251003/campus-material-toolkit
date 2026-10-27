// Local source archive; synthetic business fields. See supplement/README.md.
const ARCHIVE=require('../../supplement/archive_runtime.cjs');
ARCHIVE.configure();
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {Document,Packer,Paragraph,TextRun,ImageRun,Header,Footer,AlignmentType,HeadingLevel,ExternalHyperlink,PageNumber,BorderStyle,ShadingType}=require('docx');
const OUT=path.resolve(ARCHIVE.directory("workflows/club/build.cjs"),"../output/field_0001");
const W=1300;
const C={ink:'172B40',muted:'637489',blue:'2563A6',teal:'167D8D',orange:'C26924',purple:'7654A4',line:'CAD6E2',pale:'F1F5F9'};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const sources=[];
function tx(x,y,t,size=30,fill=C.ink,bold=false,anchor='middle'){return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="#${fill}" font-weight="${bold?700:400}">${esc(t)}</text>`;}
function box(x,y,w,h,lines,color=C.blue,dark=false){let o=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#${dark?color:'F4F7FA'}" stroke="#${color}" stroke-width="2"/>`;lines.forEach((t,i)=>o+=tx(x+w/2,y+(h-lines.length*40)/2+32+i*40,t,i===0?32:28,dark?'FFFFFF':C.ink,i===0));return o;}
function line(x1,y1,x2,y2){return `<path d="M${x1},${y1} L${x2},${y2}" fill="none" stroke="#${C.line}" stroke-width="4"/>`;}
async function chart(name,h,content){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}"><rect width="100%" height="100%" fill="white"/><g font-family="Microsoft YaHei,SimHei,sans-serif">${content}</g></svg>`;fs.writeFileSync(path.join(OUT,name+'.svg'),svg);const png=path.join(ARCHIVE.directory("workflows/club/build.cjs"),name+'.png');await sharp(Buffer.from(svg)).png().toFile(png);return {png,h};}
function run(t,opts={}){return new TextRun({text:t,font:{ascii:'Aptos',eastAsia:"field_0002",hAnsi:'Aptos'},...opts});}
function p(t,opts={}){return new Paragraph({spacing:{after:100,line:300},...opts,children:[run(t,opts.run||{})]});}
function head(n,title,sub){return [p(`${n}  /  field_0003`,{run:{size:19,color:C.teal,bold:true},spacing:{after:160}}),new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{after:140},children:[run(title,{size:44,bold:true,color:'111111'})]}),p(sub,{run:{size:21,color:C.muted},spacing:{after:180,line:290}})];}
function h(t){return p(t,{run:{size:25,bold:true},spacing:{before:140,after:90},keepNext:true});}
function band(t,color=C.teal){return p(t,{shading:{fill:'F0F5F8',type:ShadingType.CLEAR},border:{left:{color,size:20,style:BorderStyle.SINGLE,space:10}},indent:{left:140,right:100},run:{size:22,bold:true,color},spacing:{before:100,after:140,line:310}});}
function body(t){return p(t,{run:{size:22},spacing:{after:95,line:300}});}
function note(t){return p(t,{run:{size:18,color:C.muted},spacing:{after:100,line:260}});}
function role(title,desc){return [p(title,{run:{size:23,bold:true},keepNext:true,spacing:{before:100,after:45}}),body(desc)];}
function link(label,url){sources.push({label,url});return new Paragraph({spacing:{after:90,line:240},children:[new ExternalHyperlink({link:url,children:[run("field_0004｜"+label,{size:17,color:C.blue,underline:{}})]})]});}
function event(title,tag,desc,label,url){return [p(title,{run:{size:23,bold:true},keepNext:true,spacing:{before:135,after:45}}),p(tag+'  '+desc,{run:{size:21},spacing:{after:35,line:280},keepNext:true}),link(label,url)];}
function pic(ch,width=650){return new Paragraph({spacing:{after:120},children:[new ImageRun({type:'png',data:fs.readFileSync(ch.png),transformation:{width,height:Math.round(width*ch.h/W)},altText:{title:"field_0005",description:"field_0006",name:"field_0007"}})]});}
function branch(title,items,color){let s=box(430,15,440,85,Array.isArray(title)?title:[title],color,true)+line(650,100,650,140);const cols=items.length;const wid=(1240-(cols-1)*20)/cols;let centers=items.map((_,i)=>30+i*(wid+20)+wid/2);s+=line(centers[0],140,centers.at(-1),140);items.forEach((x,i)=>{s+=line(centers[i],140,centers[i],170)+box(30+i*(wid+20),170,wid,105,x,color);});return s;}
async function main(){
let s=box(380,10,540,76,["field_0008／field_0009"],C.muted)+line(650,86,650,113)+box(350,113,600,100,["field_0010","field_0011 · field_0012"],C.ink,true)+line(650,213,650,252)+line(166,252,1134,252);
const gs=[["field_0013","5 field_0014","field_0015 1＋field_0016 4"],["field_0017","17 field_0014","field_0015 1＋field_0018×4"],["field_0019","8 field_0014","field_0015 1＋field_0020 7"],["field_0021","9 field_0014","field_0015 1＋field_0022×2"]];const colors=[C.blue,C.orange,C.teal,C.purple];
gs.forEach((g,i)=>{let x=16+i*324;s+=line(x+150,252,x+150,286)+box(x,286,300,150,g,colors[i]);});
s+=tx(650,486,"field_0023 4 field_0024 · 39 field_0025 · field_0026",28,C.muted);
const overview=await chart("01_field_0027",515,s);
const ops=await chart("02_field_0013",300,branch(["field_0028 1 field_0014","field_0029"],[["field_0030","1 field_0014"],["field_0031","1 field_0014"],["field_0032","1 field_0014"],["field_0033","1 field_0014"]],C.blue));
let r=box(420,10,460,80,["field_0034 1 field_0014"],C.orange,true)+line(650,90,650,125)+line(165,125,1135,125);
['A','B','C','D'].forEach((a,i)=>{let x=15+i*325;r+=line(x+150,125,x+150,155)+box(x,155,300,95,[a+" field_0035｜4 field_0014","field_0036 1 field_0014"],C.orange);});
r+=tx(650,301,"field_0037：field_0038 1 ＋ field_0039 1 ＋ field_0040 1 ＋ field_0041 1",31,C.ink,true);
const race=await chart("03_field_0017",335,r);
let t=box(420,8,460,76,["field_0042 1 field_0014"],C.teal,true)+line(650,84,650,115)+line(117,115,1183,115);
[["field_0043","2 field_0014"],["field_0044","2 field_0014"],["field_0045","1 field_0014"],["field_0046","1 field_0014"],["field_0047","1 field_0014"]].forEach((a,i)=>{let x=17+i*256;t+=line(x+117,115,x+117,145)+box(x,145,234,94,a,C.teal);});
t+=line(650,239,650,272)+box(60,272,1180,83,["field_0048 3—5 field_0014｜field_0049"],C.teal);
const tech=await chart("04_field_0019",375,t);
const media=await chart("05_field_0021",300,branch("field_0050 1 field_0014",[["field_0051","2 field_0014"],["field_0052","2 field_0014"],["field_0053","2 field_0014"],["field_0054","2 field_0014"]],C.purple));
const pages=[];
pages.push([...head('01',"field_0055","field_0056｜field_0057｜000.10.23"),pic(overview),band("field_0058：field_0059 5＋field_0060 17＋field_0061 8＋field_0062 9＝39 field_0014"),body("field_0063 32 field_0014 → field_0064 39 field_0014：field_0065 2，field_0066 4，field_0067 1，field_0068。field_0069；field_0070。"),h("field_0071，field_0072"),body("field_0013：field_0073、field_0074、field_0075、field_0076。field_0017：field_0077、field_0078。"),body("field_0019：field_0079、field_0080。field_0021：field_0081、field_0082、field_0083。"),h("field_0084"),band("field_0085 → field_0086 → field_0087 → field_0088"),body("field_0089／field_0090，field_0091“field_0092＋field_0093＋field_0094”；field_0095；field_0096；field_0097。"),note("field_0098：field_0099、field_0100；field_0101、field_0102、field_0103。field_0104、field_0105，field_0106。")]);
pages.push([...head('02',"field_0013｜field_0107","5 field_0014｜field_0108“field_0109＋field_0016”，field_0110"),pic(ops),...role("field_0015 1 field_0014｜field_0111","SYNTHETIC FINANCIAL FIELD field_0112"),...role("field_0030 1 field_0014｜field_0113","field_0114、field_0115、field_0116；field_0117；field_0118，field_0119、field_0120、field_0121。"),...role("field_0031 1 field_0014｜field_0122","field_0123、field_0124；field_0125；field_0126、field_0127，field_0128、field_0129、field_0130。"),...role("field_0032 1 field_0014｜field_0131","field_0132、field_0133、field_0134；field_0135、field_0136；field_0137。field_0138／field_0139。"),...role("SYNTHETIC FINANCIAL FIELD field_0140","SYNTHETIC FINANCIAL FIELD field_0141"),band("field_0142：field_0143／field_0144／field_0145／field_0146／field_0147",C.blue),note("field_0148、field_0149；field_0150、field_0151、field_0152。field_0021“field_0054”field_0153，field_0154。")]);
pages.push([...head('03',"field_0017｜field_0155","17 field_0014｜field_0156，field_0157"),pic(race),...role("field_0015 1 field_0014｜field_0158、field_0159","field_0160、field_0161；field_0162；field_0163、field_0164，field_0165、field_0166。"),...role("field_0167 4 field_0014｜field_0168 1 field_0014","field_0169、field_0170、field_0171、field_0172；field_0173；field_0174，field_0175，field_0176。"),...role("field_0039 4 field_0014｜field_0168 1 field_0014","field_0177、field_0178、field_0179；field_0180；field_0181、field_0182；field_0183。"),...role("field_0040 4 field_0014｜field_0168 1 field_0014","field_0184；field_0185、field_0186、field_0187；field_0188。field_0189、field_0190。"),...role("field_0041 4 field_0014｜field_0168 1 field_0014","field_0191、field_0192、field_0193、field_0194、field_0195；field_0196；field_0197、field_0198，field_0199。"),band("field_0200 → field_0201 → field_0202 → field_0203 → field_0204",C.orange),note("field_0205：field_0206，field_0207、field_0208、field_0209。field_0210，field_0211、field_0212。field_0213，field_0214；field_0215，field_0216。")]);
pages.push([...head('04',"field_0017｜field_0217","field_0218，field_0219；field_0220，field_0221"),band("field_0222：F9U field_0223／field_0224／field_0225",C.orange),
...event("01  field_0226","【field_0227】","field_0228 F9U field_0229；field_0230，field_0231，field_0232。","field_0233｜000 field_0234","https://example.invalid/reference"),
...event("02  field_0235（field_0236）field_0237","【field_0227】","field_0238 F9U；field_0239，field_0240。field_0241。","field_0233｜000 field_0242","https://example.invalid/reference"),
...event("03  field_0243（field_0244）field_0245／iFlight field_0246","【field_0247】","field_0248 FPV field_0249；field_0250、field_0251。000 field_0252，field_0253。","field_0254 iDRC｜field_0255","https://example.invalid/reference"),
...event("04  field_0256（field_0257）field_0258","【field_0259】","000 field_0260 F9U field_0261、field_0262；field_0263，field_0264。","field_0265｜000 field_0266","https://example.invalid/reference"),
h("field_0267"),body("field_0268 → field_0269 → field_0270／field_0271 → field_0272。"),h("field_0273"),body("field_0274、field_0275、field_0276；field_0277、field_0278；field_0279。field_0280，field_0281。"),note("field_0282；field_0283、field_0284、field_0285、field_0286。field_0287。")]);
pages.push([...head('05',"field_0017｜field_0288","field_0289、field_0290、field_0291、field_0292；field_0293"),
...event("05  FAI World Drone Racing Championship｜field_0294","【field_0295】","field_0296 FPV field_0060；field_0297 F9U field_0298、field_0299，field_0300／field_0301。","FAI｜000 field_0302","https://example.invalid/reference"),
...event("06  FAI Drone Racing World Cup｜field_0303","【field_0304】","field_0305；field_0306。000 field_0307。","FAI｜field_0308","https://example.invalid/reference"),
...event("07  The World Games｜field_0309","【field_0310】","000 field_0311；field_0312，field_0313。","FAI｜000 field_0314","https://example.invalid/reference"),
...event("08  MultiGP Championship｜MultiGP field_0315","【field_0304】","field_0316；field_0317、field_0318，field_0319。","MultiGP｜field_0320","https://example.invalid/reference"),
...event('09  CDRC｜Collegiate Drone Racing Championship',"【field_0321】","SYNTHETIC FINANCIAL FIELD field_0322","MultiGP｜field_0323","https://example.invalid/reference"),
...event('10  DCL｜Drone Champions League',"【field_0324】","field_0325、field_0326；field_0327、field_0328。","DCL｜000 field_0329","https://example.invalid/reference"),
...event("11  British Drone Racing Championships｜field_0330","【field_0331】","5 field_0332 FPV field_0333；field_0334，field_0335。","BDRA｜000 field_0336","https://example.invalid/reference"),
...event("12  FAI e-Drone Racing World Cup｜field_0337","【field_0338】","FPV field_0339；field_0340，field_0341、field_0342。","FAI｜field_0343","https://example.invalid/reference")]);
pages.push([...head('06',"field_0019｜field_0344＋field_0345","8 field_0014｜field_0346；field_0347 1—2 field_0348"),pic(tech,570),...role("field_0015 1 field_0014｜field_0349、field_0350","field_0351；field_0352、field_0353；field_0354、field_0355；field_0356、field_0357，field_0358。"),...role("field_0043 2 field_0014","field_0359、field_0360、field_0361；field_0362；field_0363、field_0364。"),...role("field_0044 2 field_0014","field_0365、field_0366、field_0367、field_0368；field_0369、field_0370，field_0371。"),...role("field_0372 1 field_0014","field_0373、field_0374；field_0375 CAD、field_0376、field_0377，field_0378。"),...role("field_0046 1 field_0014","field_0379、field_0380、field_0381、field_0382；field_0383，field_0384，field_0385、field_0386。"),...role("field_0047 1 field_0014","field_0387；field_0388、field_0389。field_0390；field_0391。"),note("field_0392 2→1，field_0393 2、field_0394 2 field_0395，field_0396 1、field_0102 1，field_0397 1 field_0014。field_0398，field_0399。"),band("field_0102／field_0400／field_0401／field_0402／field_0403／field_0404／field_0405／field_0406／field_0407／field_0408",C.teal)]);
pages.push([...head('07',"field_0019｜field_0409、field_0410","field_0411；field_0412"),
...event("01  field_0413 RoboCup field_0414","【field_0415＋field_0227】","000 field_0416“field_0417”“field_0418”“field_0419”field_0420。field_0421；field_0422。","field_0423｜000 field_0424","https://example.invalid/reference"),
...event("02  field_0425（CRAIC）","【field_0426】","field_0427（field_0428）：field_0429、field_0402、field_0430。field_0431、field_0432，field_0433。","field_0434｜000 field_0435","https://example.invalid/reference"),
...event("03  field_0436（RAICOM）","【field_0437】","000 field_0438“field_0439”field_0440；field_0441。field_0442、field_0443／field_0444。","field_0445｜000 field_0446","https://example.invalid/reference"),
...event("04  field_0447 RoboMaster field_0448","【field_0449】","field_0450、field_0401、field_0451；field_0452，field_0453。field_0454。","RoboMaster｜field_0455","https://example.invalid/reference"),
...event("05  field_0456","【field_0457／field_0458】","000 field_0459，field_0460；field_0461。field_0462，field_0463。","field_0254｜000 field_0464","https://example.invalid/reference"),
band("field_0465：field_0466 → field_0467 → field_0468",C.teal),note("field_0469 000 field_0470“field_0471”；CRAIC field_0472，field_0473。field_0474；field_0475。")]);
pages.push([...head('08',"field_0019｜field_0476、field_0477","field_0478；field_0479"),
...event("06  field_0480（CUADC）","【field_0227】","field_0481；field_0482。000 field_0298“field_0483”field_0484，field_0485、field_0486。","CUADC｜000 field_0487","https://example.invalid/reference"),
...event("07  field_0488","【field_0227】","field_0233、field_0489；000 field_0490“field_0491（field_0492）”。field_0493、field_0494、field_0495，field_0496。","field_0233｜000 field_0497","https://example.invalid/reference"),
...event("08  field_0498","【field_0415】","field_0499、field_0500；field_0501，field_0502。","field_0503｜000 field_0504","https://example.invalid/reference"),
...event("09  “field_0505”field_0506","【field_0415】","field_0507、field_0508、field_0509；field_0510，field_0511、field_0512，field_0513。","field_0514｜field_0515（000）","https://example.invalid/reference"),
...event("10  field_0516","【field_0517】","field_0518、field_0519、field_0520、field_0521；field_0522／field_0523。","field_0524｜000 field_0525","https://example.invalid/reference"),
band("field_0526：field_0527 → field_0528 → field_0529 → field_0530 → field_0531",C.teal),note("field_0532，field_0533。“field_0534”field_0535，field_0536。field_0537，field_0538，field_0539。")]);
pages.push([...head('09',"field_0021｜field_0540","9 field_0014｜field_0541，field_0542"),pic(media),...role("field_0015 1 field_0014｜field_0543","field_0544、field_0545；field_0546，field_0547、field_0548、field_0549；field_0550，field_0551。"),...role("field_0051 2 field_0014｜field_0552","field_0553、field_0554，field_0555、field_0556；field_0557、field_0558，field_0559。"),...role("field_0052 2 field_0014｜field_0560","field_0561，field_0562；field_0563、field_0564；field_0565、field_0566，field_0567。"),...role("field_0053 2 field_0014｜field_0568","field_0569、field_0570，field_0571、field_0572；field_0573，field_0574，field_0575。"),...role("field_0054 2 field_0014｜field_0576","field_0577，field_0578；field_0579、field_0580，field_0581、field_0582，field_0583。"),band("field_0584 → field_0585 → field_0586 → field_0053 → field_0587 → field_0588",C.purple),body("field_0589；field_0590、field_0591，field_0592。field_0593／field_0594，field_0595。"),note("field_0596、field_0597，field_0598。field_0599，field_0600。")]);
pages.push([...head('10',"field_0601","field_0602；field_0603，field_0604"),
band("field_0605／field_0009 ↔ field_0606 ↔ field_0607 ↔ field_0608／field_0035／field_0609"),
h("field_0610"),body("field_0611 20 field_0612，field_0613“field_0375、field_0614、field_0615”；field_0616。field_0617 24 field_0618，field_0619，field_0620。"),
body("field_0621 1—2 field_0622；field_0621 3—6 field_0623、field_0624；field_0621 7—16 field_0625，field_0626。field_0627。"),
h("field_0628"),body("field_0629、field_0630；field_0631、field_0632。field_0633、field_0634、field_0635；field_0636，field_0637。"),
body("field_0638，field_0639、field_0640、field_0641；field_0642、field_0643、field_0644。"),
h("field_0645 → field_0646"),
...role("field_0647 Bristol University Drone Society → field_0059＋field_0062","field_0648、field_0649、field_0650；field_0651，field_0652。"),link("Bristol SU｜field_0653","https://example.invalid/reference"),
...role("field_0654 Triton UAS → field_0655","field_0656、field_0657、field_0658；field_0659，field_0660。"),link("Triton UAS｜field_0661","https://example.invalid/reference"),
...role("field_0662 UTAT → field_0476、field_0663","field_0664、field_0665；field_0666。"),link('University of Toronto Aerospace Team｜UAS',"https://example.invalid/reference"),
...role("MultiGP field_0667 → field_0668","field_0669、field_0670；field_0671。"),link('MultiGP｜Organizer Resources',"https://example.invalid/reference"),
]);

const sections=pages.map((children,i)=>({properties:{page:{size:{width:11906,height:16838},margin:{top:850,bottom:800,left:1070,right:1070,header:350,footer:350}}},headers:{default:new Header({children:[p("field_0056  /  field_0003",{run:{size:14,color:C.muted},spacing:{after:0}})]})},footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[run("field_0003  ·  field_0672     ",{size:16,color:C.muted}),new TextRun({children:[PageNumber.CURRENT],size:16,color:C.muted}),run(' / ',{size:16,color:C.muted}),new TextRun({children:[PageNumber.TOTAL_PAGES],size:16,color:C.muted})]})]})},children}));
const doc=new Document({creator:"field_0673",title:"field_0674",description:"field_0675、field_0676；field_0677",styles:{default:{document:{run:{font:{ascii:'Aptos',eastAsia:"field_0002",hAnsi:'Aptos'},size:22,color:C.ink},paragraph:{spacing:{line:300,after:100}}}}},sections});
fs.writeFileSync(path.join(OUT,"field_0003_field_0672.docx"),await Packer.toBuffer(doc));
fs.writeFileSync(path.join(ARCHIVE.directory("workflows/club/build.cjs"),'sources.json'),JSON.stringify(sources,null,2));
console.log('Created DOCX, five organization charts, and '+sources.length+' source links.');
}
main().catch(e=>{console.error(e);process.exit(1)});
