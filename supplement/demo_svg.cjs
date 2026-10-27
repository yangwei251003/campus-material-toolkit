const fs=require('node:fs'),path=require('node:path');
const sharp=require('sharp');
const g=require('./apis/svg_geometry.cjs');
async function main(){
 const i=process.argv.indexOf('--output');
 if(i<0||!process.argv[i+1])throw Error('Pass --output to a new empty directory.');
 const out=path.resolve(process.argv[i+1]);
 if(fs.existsSync(out)&&fs.readdirSync(out).length)throw Error('Use a new empty output directory.');
 fs.mkdirSync(out,{recursive:true});
 const kinds=['gate','flag','clock','safe','goggles','radio','battery','trophy','tools','drone','bolt','propeller','heart'];
 let content=g.rect(0,0,960,720,g.C.navy)+g.checkers(0,0,12,40)+g.brush(60,110,840,70)+g.gate(30,210,900,450);
 kinds.forEach((kind,index)=>{const col=index%5,row=Math.floor(index/5);content+=g.icon(kind,85+col*175,280+row*120,70,g.C.white);});
 content+=g.line(60,660,900,660,g.C.gold,3)+g.poly('60,680 100,670 140,680',g.C.green);
 const svg=g.wrap(960,720,content);
 if(g.xml('<a&"\'>')!=='&lt;a&amp;&quot;&apos;&gt;')throw Error('XML escape contract changed.');
 fs.writeFileSync(path.join(out,'synthetic-geometry.svg'),svg);
 const result=await sharp(Buffer.from(svg)).png().toFile(path.join(out,'synthetic-geometry.png'));
 if(result.width!==960||result.height!==720)throw Error('Unexpected SVG render size.');
 const base=g.wrap(320,240,g.base(320,240,true));await sharp(Buffer.from(base)).png().toFile(path.join(out,'synthetic-base.png'));
 const summary={synthetic:true,original_media_fonts_business_copy:false,exact_preserved_svg_functions:10,icon_kinds:kinds.length,actual_sharp_render:[result.width,result.height],xml_escaping_passed:true};
 fs.writeFileSync(path.join(out,'validation.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));
}
main().catch(e=>{console.error(e.message);process.exit(1);});
