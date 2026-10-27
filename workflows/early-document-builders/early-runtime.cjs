const fs=require('node:fs'),path=require('node:path');
let outputDirectory;
function configure(){
 const args=process.argv.slice(2),i=args.indexOf('--output');
 if(!args.includes('--synthetic-demo')||i<0||!args[i+1]){console.error('SYNTHETIC_GUARD: pass --synthetic-demo --output <new directory>. Original business inputs are excluded.');process.exit(2);}
 outputDirectory=path.resolve(args[i+1]);
 const marker=path.join(outputDirectory,'.campus-early-synthetic.json');
 if(fs.existsSync(outputDirectory)&&fs.readdirSync(outputDirectory).length){
  if(!fs.existsSync(marker)||JSON.parse(fs.readFileSync(marker,'utf8')).synthetic!==true)throw Error('Output is not a marked synthetic workspace. Choose a new directory.');
 }else{
  fs.mkdirSync(outputDirectory,{recursive:true});fs.writeFileSync(marker,JSON.stringify({synthetic:true,generator:'early-document-builders'}));
 }
}
function output(){if(!outputDirectory)throw Error('Not configured');return outputDirectory;}
module.exports={configure,output,syntheticReserveRate:0.1};
