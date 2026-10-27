// Original local docx layout/control code; every business body literal is external synthetic input.
const fs = require('fs');
const path = require('path');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,AlignmentType,VerticalAlign,HeadingLevel,Header,Footer,PageNumber,ExternalHyperlink,TableLayoutType}=require('docx');
const requested = process.argv.indexOf('--workspace');
if(requested < 0 || !process.argv[requested+1]) throw new Error('Pass --workspace for an initialized independent fixture workspace');
const WORKSPACE=path.resolve(process.argv[requested+1]);
if(!fs.existsSync(path.join(WORKSPACE,'.campus-material-workspace.json')))throw new Error('Independent workspace marker missing');
const OUT=path.join(WORKSPACE,'organization');
fs.mkdirSync(OUT,{recursive:true});
const PUBLIC_COPY=JSON.parse(fs.readFileSync(path.join(OUT,'content.json'),'utf8'));
const C={navy:'17384A',teal:'127F82',orange:'C57835',ink:'172C38',muted:'526A77',line:'D4E1E5',pale:'EDF5F5',light:'F4F7F9',white:'FFFFFF'};
const W=10106;
const run=(s,o={})=>new TextRun({text:s,font:'Microsoft YaHei',size:21,color:C.ink,...o});
function p(s,o={}) {o.spacing={lineRule:'exact',...(o.spacing||{})};return new Paragraph({snapToGrid:false,spacing:{after:100,line:290,lineRule:'exact'},children:[run(s)],...o});}
function rich(children,o={}) {o.spacing={lineRule:'exact',...(o.spacing||{})};return new Paragraph({snapToGrid:false,spacing:{after:90,line:280,lineRule:'exact'},children,...o});}
function h(s,level=2){return new Paragraph({snapToGrid:false,heading:level===1?HeadingLevel.HEADING_1:HeadingLevel.HEADING_2,spacing:{before:level===1?0:220,after:140},children:[run(s,{bold:true,size:level===1?38:26,color:level===1?C.ink:C.teal})]});}
function small(s){return p(s,{children:[run(s,{size:18,color:C.muted})],spacing:{after:90,line:250}});}
function link(label,url){return new ExternalHyperlink({link:url,children:[run(label,{color:C.teal,underline:{},size:18})]});}
function source(label,url){return rich([link(label,url)],{spacing:{before:30,after:35,line:220}});}
function cell(content,width,head=false,i=0){
 const children=Array.isArray(content)?content.flat(Infinity):[p(content,{spacing:{after:0,line:270},children:[run(content,{bold:head,size:head?20:20,color:head?C.white:C.ink})]})];
 return new TableCell({width:{size:width,type:WidthType.DXA},verticalAlign:VerticalAlign.CENTER,shading:{fill:head?C.navy:(i%2?C.light:C.white),type:ShadingType.CLEAR},margins:{top:110,bottom:110,left:130,right:130},borders:{top:{style:BorderStyle.SINGLE,size:3,color:C.line},bottom:{style:BorderStyle.SINGLE,size:3,color:C.line},left:{style:BorderStyle.SINGLE,size:3,color:C.line},right:{style:BorderStyle.SINGLE,size:3,color:C.line}},children});
}
function table(headers,rows,widths){return new Table({width:{size:W,type:WidthType.DXA},columnWidths:widths,layout:TableLayoutType.FIXED,rows:[new TableRow({tableHeader:true,cantSplit:true,children:headers.map((x,j)=>cell(x,widths[j],true))}),...rows.map((r,i)=>new TableRow({cantSplit:true,children:r.map((x,j)=>cell(x,widths[j],false,i))}))]});}
function cards(items){const widths=items.map((_,i)=>Math.floor(W/items.length)+(i===items.length-1?W%items.length:0));return new Table({width:{size:W,type:WidthType.DXA},columnWidths:widths,layout:TableLayoutType.FIXED,rows:[new TableRow({cantSplit:true,children:items.map((it,i)=>new TableCell({width:{size:widths[i],type:WidthType.DXA},shading:{fill:C.pale,type:ShadingType.CLEAR},margins:{top:160,bottom:160,left:130,right:130},borders:{top:{style:BorderStyle.SINGLE,size:12,color:C.teal},bottom:{style:BorderStyle.SINGLE,size:3,color:C.line},left:{style:BorderStyle.SINGLE,size:6,color:C.white},right:{style:BorderStyle.SINGLE,size:6,color:C.white}},children:[p(it[0],{alignment:AlignmentType.CENTER,children:[run(it[0],{bold:true,size:23,color:C.teal})],spacing:{after:70,line:280}}),...it.slice(1).map(x=>p(x,{alignment:AlignmentType.CENTER,children:[run(x,{size:19})],spacing:{after:30,line:250}}))]}))})]});}
const arrow=s=>p(s,{alignment:AlignmentType.CENTER,children:[run(s,{size:19,color:C.muted})],spacing:{before:70,after:70,line:230}});
const note=s=>new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W],rows:[new TableRow({cantSplit:true,children:[new TableCell({width:{size:W,type:WidthType.DXA},shading:{fill:C.pale,type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:180,right:180},children:[p(s,{spacing:{after:0,line:270},children:[run(s,{size:20,color:C.navy})]})]})]})]});
function item(name,desc,url,label=PUBLIC_COPY["field_001"]){return [p(name,{children:[run(name,{bold:true,size:20})],spacing:{after:50,line:270}}),...(desc?[small(desc)]:[]),source(label+' ↗',url)];}
const pages=[];
function page(kicker,title,subtitle,body){pages.push([p(kicker,{children:[run(kicker,{size:18,bold:true,color:C.teal,characterSpacing:40})],spacing:{after:100}}),h(title,1),small(subtitle),...body]);}

page(PUBLIC_COPY["field_002"],PUBLIC_COPY["field_003"],PUBLIC_COPY["field_004"],[
 note(PUBLIC_COPY["field_005"]),
 h(PUBLIC_COPY["field_006"]),
 cards([[PUBLIC_COPY["field_007"],PUBLIC_COPY["field_008"],PUBLIC_COPY["field_009"]]]),
 arrow(PUBLIC_COPY["field_010"]),
 cards([[PUBLIC_COPY["field_011"],PUBLIC_COPY["field_012"],PUBLIC_COPY["field_013"]]]),
 arrow(PUBLIC_COPY["field_014"]),
 cards([[PUBLIC_COPY["field_015"],PUBLIC_COPY["field_016"],PUBLIC_COPY["field_017"]],[PUBLIC_COPY["field_018"],PUBLIC_COPY["field_019"],PUBLIC_COPY["field_020"]],[PUBLIC_COPY["field_021"],PUBLIC_COPY["field_022"],PUBLIC_COPY["field_023"]],[PUBLIC_COPY["field_024"],PUBLIC_COPY["field_025"],PUBLIC_COPY["field_026"]]]),
 h(PUBLIC_COPY["field_027"]),
 table([PUBLIC_COPY["field_028"],PUBLIC_COPY["field_029"],PUBLIC_COPY["field_030"]],[
 [PUBLIC_COPY["field_031"],PUBLIC_COPY["field_032"],PUBLIC_COPY["field_033"]],
 [PUBLIC_COPY["field_034"],PUBLIC_COPY["field_035"],PUBLIC_COPY["field_036"]],
 [PUBLIC_COPY["field_037"],PUBLIC_COPY["field_038"],PUBLIC_COPY["field_039"]],
 ],[1300,4403,4403]),
 h(PUBLIC_COPY["field_040"]),
 table([PUBLIC_COPY["field_041"],PUBLIC_COPY["field_042"],PUBLIC_COPY["field_043"],PUBLIC_COPY["field_044"]],[
 [PUBLIC_COPY["field_045"],PUBLIC_COPY["field_046"],PUBLIC_COPY["field_046"],PUBLIC_COPY["field_047"]],
 [PUBLIC_COPY["field_029"],PUBLIC_COPY["field_048"],PUBLIC_COPY["field_049"],PUBLIC_COPY["field_050"]],
 [PUBLIC_COPY["field_030"],PUBLIC_COPY["field_051"],PUBLIC_COPY["field_052"],PUBLIC_COPY["field_053"]],
 [PUBLIC_COPY["field_054"],PUBLIC_COPY["field_052"],PUBLIC_COPY["field_052"],PUBLIC_COPY["field_055"]],
 [PUBLIC_COPY["field_056"],PUBLIC_COPY["field_057"],PUBLIC_COPY["field_058"],PUBLIC_COPY["field_059"]],
 ],[1900,850,850,6506]),
 small(PUBLIC_COPY["field_060"])
]);

page(PUBLIC_COPY["field_061"],PUBLIC_COPY["field_062"],PUBLIC_COPY["field_063"],[
 table([PUBLIC_COPY["field_064"],PUBLIC_COPY["field_065"],PUBLIC_COPY["field_066"],PUBLIC_COPY["field_067"]],[
 [PUBLIC_COPY["field_068"],PUBLIC_COPY["field_069"],PUBLIC_COPY["field_070"],PUBLIC_COPY["field_071"]],
 [PUBLIC_COPY["field_072"],PUBLIC_COPY["field_073"],PUBLIC_COPY["field_074"],PUBLIC_COPY["field_075"]],
 [PUBLIC_COPY["field_076"],PUBLIC_COPY["field_077"],PUBLIC_COPY["field_078"],PUBLIC_COPY["field_079"]],
 ],[2050,4150,2050,1856]),
 small(PUBLIC_COPY["field_080"]),
 h(PUBLIC_COPY["field_081"]),
 cards([[PUBLIC_COPY["field_082"],PUBLIC_COPY["field_083"],PUBLIC_COPY["field_084"]],[PUBLIC_COPY["field_085"],PUBLIC_COPY["field_086"],PUBLIC_COPY["field_087"]],[PUBLIC_COPY["field_088"],PUBLIC_COPY["field_089"],PUBLIC_COPY["field_090"]],[PUBLIC_COPY["field_091"],PUBLIC_COPY["field_092"],PUBLIC_COPY["field_093"]]]),
 h(PUBLIC_COPY["field_094"]),
 arrow(PUBLIC_COPY["field_095"]),
 table([PUBLIC_COPY["field_096"],PUBLIC_COPY["field_097"],PUBLIC_COPY["field_098"]],[
 [PUBLIC_COPY["field_099"],PUBLIC_COPY["field_100"],PUBLIC_COPY["field_101"]],
 [PUBLIC_COPY["field_102"],PUBLIC_COPY["field_103"],PUBLIC_COPY["field_104"]],
 [PUBLIC_COPY["field_105"],PUBLIC_COPY["field_106"],PUBLIC_COPY["field_107"]],
 [PUBLIC_COPY["field_108"],PUBLIC_COPY["field_109"],PUBLIC_COPY["field_110"]],
 [PUBLIC_COPY["field_111"],PUBLIC_COPY["field_112"],PUBLIC_COPY["field_113"]],
 ],[1500,4600,4006]),
 h(PUBLIC_COPY["field_114"]),
 p(PUBLIC_COPY["field_115"]),
 small(PUBLIC_COPY["field_116"])
]);

page(PUBLIC_COPY["field_117"],PUBLIC_COPY["field_118"],PUBLIC_COPY["field_119"],[
 table([PUBLIC_COPY["field_064"],PUBLIC_COPY["field_065"],PUBLIC_COPY["field_067"]],[
 [PUBLIC_COPY["field_120"],PUBLIC_COPY["field_121"],PUBLIC_COPY["field_122"]],
 [PUBLIC_COPY["field_123"],PUBLIC_COPY["field_124"],PUBLIC_COPY["field_125"]],
 [PUBLIC_COPY["field_126"],PUBLIC_COPY["field_127"],PUBLIC_COPY["field_128"]],
 [PUBLIC_COPY["field_129"],PUBLIC_COPY["field_130"],PUBLIC_COPY["field_131"]],
 [PUBLIC_COPY["field_132"],PUBLIC_COPY["field_133"],PUBLIC_COPY["field_134"]],
 ],[1950,6000,2156]),
 h(PUBLIC_COPY["field_135"]),
 cards([[PUBLIC_COPY["field_136"],PUBLIC_COPY["field_137"],PUBLIC_COPY["field_138"]],[PUBLIC_COPY["field_139"],PUBLIC_COPY["field_137"],PUBLIC_COPY["field_138"]],[PUBLIC_COPY["field_140"],PUBLIC_COPY["field_137"],PUBLIC_COPY["field_138"]],[PUBLIC_COPY["field_141"],PUBLIC_COPY["field_137"],PUBLIC_COPY["field_138"]]]),
 small(PUBLIC_COPY["field_142"]),
 h(PUBLIC_COPY["field_143"]),
 table([PUBLIC_COPY["field_144"],PUBLIC_COPY["field_145"]],[
 [PUBLIC_COPY["field_146"],PUBLIC_COPY["field_147"]],
 [PUBLIC_COPY["field_148"],PUBLIC_COPY["field_149"]],
 [PUBLIC_COPY["field_150"],PUBLIC_COPY["field_151"]],
 [PUBLIC_COPY["field_152"],PUBLIC_COPY["field_153"]],
 ],[1550,8556]),
 note(PUBLIC_COPY["field_154"]),
 source(PUBLIC_COPY["field_155"],PUBLIC_COPY["field_156"])
]);

page(PUBLIC_COPY["field_157"],PUBLIC_COPY["field_158"],PUBLIC_COPY["field_159"],[
 table([PUBLIC_COPY["field_160"],PUBLIC_COPY["field_161"],PUBLIC_COPY["field_162"]],[
 [item(PUBLIC_COPY["field_163"],PUBLIC_COPY["field_164"],PUBLIC_COPY["field_165"],PUBLIC_COPY["field_166"]),PUBLIC_COPY["field_167"],PUBLIC_COPY["field_168"]],
 [item(PUBLIC_COPY["field_169"],PUBLIC_COPY["field_170"],PUBLIC_COPY["field_171"]),PUBLIC_COPY["field_172"],PUBLIC_COPY["field_173"]],
 [item(PUBLIC_COPY["field_174"],PUBLIC_COPY["field_175"],PUBLIC_COPY["field_176"]),PUBLIC_COPY["field_177"],PUBLIC_COPY["field_178"]],
 [item(PUBLIC_COPY["field_179"],PUBLIC_COPY["field_180"],PUBLIC_COPY["field_181"]),PUBLIC_COPY["field_182"],PUBLIC_COPY["field_183"]],
 [item(PUBLIC_COPY["field_184"],PUBLIC_COPY["field_185"],PUBLIC_COPY["field_186"]),PUBLIC_COPY["field_187"],PUBLIC_COPY["field_188"]],
 [item(PUBLIC_COPY["field_189"],PUBLIC_COPY["field_190"],PUBLIC_COPY["field_191"]),PUBLIC_COPY["field_192"],PUBLIC_COPY["field_193"]],
 [item(PUBLIC_COPY["field_194"],PUBLIC_COPY["field_195"],PUBLIC_COPY["field_196"]),PUBLIC_COPY["field_197"],PUBLIC_COPY["field_198"]],
 [item(PUBLIC_COPY["field_199"],PUBLIC_COPY["field_200"],PUBLIC_COPY["field_201"]),PUBLIC_COPY["field_202"],PUBLIC_COPY["field_203"]],
 ],[3500,3100,3506]),
 h(PUBLIC_COPY["field_204"]),
 cards([[PUBLIC_COPY["field_205"],PUBLIC_COPY["field_206"],PUBLIC_COPY["field_207"]],[PUBLIC_COPY["field_208"],PUBLIC_COPY["field_209"],PUBLIC_COPY["field_210"]],[PUBLIC_COPY["field_211"],PUBLIC_COPY["field_212"],PUBLIC_COPY["field_213"]]]),
 small(PUBLIC_COPY["field_214"])
]);

page(PUBLIC_COPY["field_215"],PUBLIC_COPY["field_216"],PUBLIC_COPY["field_217"],[
 table([PUBLIC_COPY["field_064"],PUBLIC_COPY["field_065"],PUBLIC_COPY["field_067"]],[
 [PUBLIC_COPY["field_218"],PUBLIC_COPY["field_219"],PUBLIC_COPY["field_220"]],
 [PUBLIC_COPY["field_221"],PUBLIC_COPY["field_222"],PUBLIC_COPY["field_223"]],
 [PUBLIC_COPY["field_224"],PUBLIC_COPY["field_225"],PUBLIC_COPY["field_226"]],
 [PUBLIC_COPY["field_227"],PUBLIC_COPY["field_228"],PUBLIC_COPY["field_229"]],
 [PUBLIC_COPY["field_230"],PUBLIC_COPY["field_231"],PUBLIC_COPY["field_232"]],
 ],[2200,5700,2206]),
 h(PUBLIC_COPY["field_233"]),
 cards([[PUBLIC_COPY["field_234"],PUBLIC_COPY["field_235"],PUBLIC_COPY["field_236"],PUBLIC_COPY["field_237"]],[PUBLIC_COPY["field_238"],PUBLIC_COPY["field_235"],PUBLIC_COPY["field_236"],PUBLIC_COPY["field_237"]]]),
 small(PUBLIC_COPY["field_239"]),
 h(PUBLIC_COPY["field_240"]),
 table([PUBLIC_COPY["field_144"],PUBLIC_COPY["field_241"],PUBLIC_COPY["field_242"]],[
 [PUBLIC_COPY["field_243"],PUBLIC_COPY["field_244"],PUBLIC_COPY["field_245"]],
 [PUBLIC_COPY["field_246"],PUBLIC_COPY["field_247"],PUBLIC_COPY["field_248"]],
 [PUBLIC_COPY["field_249"],PUBLIC_COPY["field_250"],PUBLIC_COPY["field_251"]],
 [PUBLIC_COPY["field_252"],PUBLIC_COPY["field_253"],PUBLIC_COPY["field_254"]],
 ],[1550,4550,4006]),
 note(PUBLIC_COPY["field_255"])
]);

page(PUBLIC_COPY["field_256"],PUBLIC_COPY["field_257"],PUBLIC_COPY["field_258"],[
 table([PUBLIC_COPY["field_259"],PUBLIC_COPY["field_260"],PUBLIC_COPY["field_261"]],[
 [[item(PUBLIC_COPY["field_262"],PUBLIC_COPY["field_263"],PUBLIC_COPY["field_264"],PUBLIC_COPY["field_265"]),p(PUBLIC_COPY["field_266"],{spacing:{after:0,line:270},children:[run(PUBLIC_COPY["field_266"],{size:20})]})],
 PUBLIC_COPY["field_267"],PUBLIC_COPY["field_268"]],
 [[item(PUBLIC_COPY["field_269"],PUBLIC_COPY["field_270"],PUBLIC_COPY["field_271"],PUBLIC_COPY["field_265"]),source(PUBLIC_COPY["field_272"],PUBLIC_COPY["field_273"])],
 PUBLIC_COPY["field_274"],PUBLIC_COPY["field_275"]],
 [[item(PUBLIC_COPY["field_276"],PUBLIC_COPY["field_277"],PUBLIC_COPY["field_278"],PUBLIC_COPY["field_279"]),],
 PUBLIC_COPY["field_280"],PUBLIC_COPY["field_281"]],
 [[item(PUBLIC_COPY["field_282"],PUBLIC_COPY["field_283"],PUBLIC_COPY["field_284"],PUBLIC_COPY["field_285"]),source(PUBLIC_COPY["field_286"],PUBLIC_COPY["field_287"])],
 PUBLIC_COPY["field_288"],PUBLIC_COPY["field_289"]],
 [[item(PUBLIC_COPY["field_290"],PUBLIC_COPY["field_291"],PUBLIC_COPY["field_292"],PUBLIC_COPY["field_293"]),source(PUBLIC_COPY["field_294"],PUBLIC_COPY["field_295"])],
 PUBLIC_COPY["field_296"],PUBLIC_COPY["field_297"]],
 ],[4050,3000,3056]),
 h(PUBLIC_COPY["field_298"]),
 p(PUBLIC_COPY["field_299"]),
 small(PUBLIC_COPY["field_300"])
]);

page(PUBLIC_COPY["field_301"],PUBLIC_COPY["field_302"],PUBLIC_COPY["field_303"],[
 table([PUBLIC_COPY["field_304"],PUBLIC_COPY["field_305"],PUBLIC_COPY["field_306"]],[
 [[item(PUBLIC_COPY["field_307"],PUBLIC_COPY["field_308"],PUBLIC_COPY["field_309"],PUBLIC_COPY["field_310"])],PUBLIC_COPY["field_311"],PUBLIC_COPY["field_312"]],
 [[item(PUBLIC_COPY["field_313"],PUBLIC_COPY["field_314"],PUBLIC_COPY["field_315"],PUBLIC_COPY["field_316"]),source(PUBLIC_COPY["field_317"],PUBLIC_COPY["field_318"])],PUBLIC_COPY["field_319"],PUBLIC_COPY["field_320"]],
 [[item(PUBLIC_COPY["field_321"],PUBLIC_COPY["field_322"],PUBLIC_COPY["field_323"],PUBLIC_COPY["field_324"])],PUBLIC_COPY["field_325"],PUBLIC_COPY["field_326"]],
 [[item(PUBLIC_COPY["field_327"],PUBLIC_COPY["field_328"],PUBLIC_COPY["field_329"],PUBLIC_COPY["field_330"])],PUBLIC_COPY["field_331"],PUBLIC_COPY["field_332"]],
 [[item(PUBLIC_COPY["field_333"],PUBLIC_COPY["field_334"],PUBLIC_COPY["field_335"],PUBLIC_COPY["field_336"])],PUBLIC_COPY["field_337"],PUBLIC_COPY["field_338"]],
 ],[4050,3100,2956]),
 h(PUBLIC_COPY["field_339"]),
 table([PUBLIC_COPY["field_340"],PUBLIC_COPY["field_341"]],[
 [PUBLIC_COPY["field_342"],PUBLIC_COPY["field_343"]],
 [PUBLIC_COPY["field_344"],PUBLIC_COPY["field_345"]],
 [PUBLIC_COPY["field_346"],PUBLIC_COPY["field_347"]],
 [PUBLIC_COPY["field_348"],PUBLIC_COPY["field_349"]],
 ],[3400,6706]),
 small(PUBLIC_COPY["field_350"])
]);

page(PUBLIC_COPY["field_351"],PUBLIC_COPY["field_352"],PUBLIC_COPY["field_353"],[
 table([PUBLIC_COPY["field_064"],PUBLIC_COPY["field_065"],PUBLIC_COPY["field_354"]],[
 [PUBLIC_COPY["field_355"],PUBLIC_COPY["field_356"],PUBLIC_COPY["field_357"]],
 [PUBLIC_COPY["field_358"],PUBLIC_COPY["field_359"],PUBLIC_COPY["field_360"]],
 [PUBLIC_COPY["field_361"],PUBLIC_COPY["field_362"],PUBLIC_COPY["field_363"]],
 [PUBLIC_COPY["field_364"],PUBLIC_COPY["field_365"],PUBLIC_COPY["field_366"]],
 [PUBLIC_COPY["field_367"],PUBLIC_COPY["field_368"],PUBLIC_COPY["field_369"]],
 ],[2100,4650,3356]),
 h(PUBLIC_COPY["field_370"]),
 cards([[PUBLIC_COPY["field_371"],PUBLIC_COPY["field_372"],PUBLIC_COPY["field_373"]],[PUBLIC_COPY["field_374"],PUBLIC_COPY["field_375"],PUBLIC_COPY["field_376"]],[PUBLIC_COPY["field_377"],PUBLIC_COPY["field_378"],PUBLIC_COPY["field_379"]],[PUBLIC_COPY["field_380"],PUBLIC_COPY["field_381"],PUBLIC_COPY["field_382"]]]),
 small(PUBLIC_COPY["field_383"]),
 h(PUBLIC_COPY["field_384"]),
 table([PUBLIC_COPY["field_385"],PUBLIC_COPY["field_386"],PUBLIC_COPY["field_387"]],[
 [PUBLIC_COPY["field_388"],PUBLIC_COPY["field_045"],PUBLIC_COPY["field_389"]],
 [PUBLIC_COPY["field_390"],PUBLIC_COPY["field_391"],PUBLIC_COPY["field_392"]],
 [PUBLIC_COPY["field_393"],PUBLIC_COPY["field_394"],PUBLIC_COPY["field_395"]],
 [PUBLIC_COPY["field_396"],PUBLIC_COPY["field_397"],PUBLIC_COPY["field_398"]],
 ],[2300,2200,5606]),
 h(PUBLIC_COPY["field_399"]),
 p(PUBLIC_COPY["field_400"]),
 small(PUBLIC_COPY["field_401"])
]);

page(PUBLIC_COPY["field_402"],PUBLIC_COPY["field_403"],PUBLIC_COPY["field_404"],[
 table([PUBLIC_COPY["field_405"],PUBLIC_COPY["field_406"],PUBLIC_COPY["field_407"]],[
 [[item(PUBLIC_COPY["field_408"],PUBLIC_COPY["field_409"],PUBLIC_COPY["field_410"],PUBLIC_COPY["field_411"]),source(PUBLIC_COPY["field_412"],PUBLIC_COPY["field_413"])],PUBLIC_COPY["field_414"],PUBLIC_COPY["field_415"]],
 [[item(PUBLIC_COPY["field_416"],PUBLIC_COPY["field_417"],PUBLIC_COPY["field_418"],PUBLIC_COPY["field_419"])],PUBLIC_COPY["field_420"],PUBLIC_COPY["field_421"]],
 [[item(PUBLIC_COPY["field_422"],PUBLIC_COPY["field_423"],PUBLIC_COPY["field_424"],PUBLIC_COPY["field_425"])],PUBLIC_COPY["field_426"],PUBLIC_COPY["field_427"]],
 [[item(PUBLIC_COPY["field_428"],PUBLIC_COPY["field_429"],PUBLIC_COPY["field_430"],PUBLIC_COPY["field_431"])],PUBLIC_COPY["field_432"],PUBLIC_COPY["field_433"]],
 [[item(PUBLIC_COPY["field_434"],PUBLIC_COPY["field_435"],PUBLIC_COPY["field_436"],PUBLIC_COPY["field_437"])],PUBLIC_COPY["field_438"],PUBLIC_COPY["field_439"]],
 ],[3400,3350,3356]),
 h(PUBLIC_COPY["field_440"]),
 p(PUBLIC_COPY["field_441"]),
 h(PUBLIC_COPY["field_442"]),
 p(PUBLIC_COPY["field_443"]),
 h(PUBLIC_COPY["field_444"]),
 p(PUBLIC_COPY["field_445"]),
 small(PUBLIC_COPY["field_446"])
]);

const header=new Header({children:[rich([run(PUBLIC_COPY["field_447"],{size:17,color:C.muted}),run(PUBLIC_COPY["field_448"],{size:17,color:C.muted})],{spacing:{after:80},border:{bottom:{color:C.line,space:6,style:BorderStyle.SINGLE,size:4}}})]});
const footer=new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[run(PUBLIC_COPY["field_449"],{size:16,color:C.muted}),new TextRun({children:[PageNumber.CURRENT],size:16,color:C.muted}),run(PUBLIC_COPY["field_450"],{size:16,color:C.muted}),new TextRun({children:[PageNumber.TOTAL_PAGES],size:16,color:C.muted})]})]});
// Apply page breaks through paragraph properties rather than mutating serialized options.
const finalChildren=[];pages.forEach((pg,i)=>{if(i){const old=pg[0];pg[0]=p([PUBLIC_COPY["field_002"],PUBLIC_COPY["field_061"],PUBLIC_COPY["field_117"],PUBLIC_COPY["field_157"],PUBLIC_COPY["field_215"],PUBLIC_COPY["field_256"],PUBLIC_COPY["field_301"],PUBLIC_COPY["field_351"],PUBLIC_COPY["field_402"]][i],{pageBreakBefore:true,children:[run([PUBLIC_COPY["field_451"],PUBLIC_COPY["field_061"],PUBLIC_COPY["field_117"],PUBLIC_COPY["field_157"],PUBLIC_COPY["field_215"],PUBLIC_COPY["field_256"],PUBLIC_COPY["field_301"],PUBLIC_COPY["field_351"],PUBLIC_COPY["field_402"]][i],{size:18,bold:true,color:C.teal})],spacing:{after:100}});}finalChildren.push(...pg);});
const doc=new Document({creator:PUBLIC_COPY["field_452"],title:PUBLIC_COPY["field_453"],description:PUBLIC_COPY["field_454"],styles:{default:{document:{run:{font:'Microsoft YaHei',size:21,color:C.ink},paragraph:{snapToGrid:false,spacing:{after:100,line:290,lineRule:'exact'}}}},paragraphStyles:[{id:PUBLIC_COPY["field_455"],name:PUBLIC_COPY["field_456"],basedOn:PUBLIC_COPY["field_457"],next:PUBLIC_COPY["field_457"],quickFormat:true,run:{font:'Microsoft YaHei',size:38,bold:true},paragraph:{outlineLevel:0,keepNext:true}},{id:PUBLIC_COPY["field_458"],name:PUBLIC_COPY["field_459"],basedOn:PUBLIC_COPY["field_457"],next:PUBLIC_COPY["field_457"],quickFormat:true,run:{font:'Microsoft YaHei',size:26,bold:true},paragraph:{outlineLevel:1,keepNext:true}}]},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:950,bottom:900,left:900,right:900,header:400,footer:400}}},headers:{default:header},footers:{default:footer},children:finalChildren}]});
Packer.toBuffer(doc).then(b=>{const dest=path.join(OUT,"sample-organization.docx");fs.writeFileSync(dest,b);console.log(dest);});
