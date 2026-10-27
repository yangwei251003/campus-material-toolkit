const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
let root;
function configure(){
 if(root)return;
 const args=process.argv.slice(2),i=args.indexOf('--workspace');
 if(!args.includes('--execute-archived')||i<0||!args[i+1]){
  console.error('ARCHIVE_GUARD: run supplement/demo.py or supplement/demo_svg.cjs first. Historical modules require --execute-archived --workspace and synthetic inputs.');process.exit(2);
 }
 root=path.resolve(args[i+1]);
 const marker=path.join(root,'.campus-material-workspace.json');
 if(!fs.existsSync(marker)||JSON.parse(fs.readFileSync(marker,'utf8')).synthetic!==true){console.error('ARCHIVE_GUARD: synthetic=true workspace marker required.');process.exit(2);}
 process.argv=[...process.argv.slice(0,2),...args.filter((v,j)=>v!=='--execute-archived'&&j!==i&&j!==i+1)];
}
function directory(alias){
 if(!root)throw Error('Archive not configured');
 const dir=path.resolve(root,'legacy',path.dirname(alias));
 if(path.relative(root,dir).startsWith('..'))throw Error('Archive path escapes workspace');
 fs.mkdirSync(dir,{recursive:true});return dir;
}
function external(name){
 if(!['docx','sharp','opentype.js','pdfkit','svg-to-pdfkit','xml-js'].includes(name))throw Error('Unknown optional dependency');
 try{return createRequire(path.join(__dirname,'package.json'))(name);}
 catch(e){throw Error('Install the optional historical dependency '+name+' in supplement/ before using this archive. '+e.code);}
}
module.exports={configure,directory,external};
