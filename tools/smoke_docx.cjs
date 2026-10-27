// Validate the original local DOCX layout algorithm using explicit synthetic content only.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),{createRequire}=require('node:module');
const index=process.argv.indexOf('--workspace');
if(index<0||!process.argv[index+1])throw Error('Pass --workspace for a fresh empty directory');
const W=path.resolve(process.argv[index+1]),R=path.resolve(__dirname,'..');
if(fs.existsSync(W)&&fs.readdirSync(W).length)throw Error('Choose an empty independent directory; nothing was changed');
fs.mkdirSync(path.join(W,'organization'),{recursive:true});
fs.writeFileSync(path.join(W,'.campus-material-workspace.json'),JSON.stringify({synthetic:true}));
fs.copyFileSync(path.join(R,'fixtures/organization-copy.json'),path.join(W,'organization/content.json'));
const result=cp.spawnSync(process.execPath,[path.join(R,'workflows/organization/build.js'),'--workspace',W],{cwd:R,encoding:'utf8'});
if(result.status!==0)throw Error('DOCX builder failed: '+result.stderr);
const requireDocx=createRequire(require.resolve('docx'));
const JSZip=requireDocx('jszip');
(async()=>{
 const file=path.join(W,'organization/sample-organization.docx');
 const zip=await JSZip.loadAsync(fs.readFileSync(file),{checkCRC32:true});
 const xml=await zip.file('word/document.xml').async('string');
 if(!xml.includes('Synthetic content')||!xml.includes('<w:tbl>')||Object.keys(zip.files).some(n=>n.startsWith('word/media/')))throw Error('Unexpected DOCX fixture content');
 let folder=path.dirname(require.resolve('docx')),metadata;
 while(folder!==path.dirname(folder)){
  const candidate=path.join(folder,'package.json');
  if(fs.existsSync(candidate)){const value=JSON.parse(fs.readFileSync(candidate,'utf8'));if(value.name==='docx'){metadata=value;break;}}
  folder=path.dirname(folder);
 }
 if(!metadata)throw Error('Cannot identify the tested docx version');
 const report={docx_version:metadata.version,zip_entries:Object.keys(zip.files).length,embedded_images:0,word_COM_executed:false};
 fs.writeFileSync(path.join(W,'docx-smoke.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
