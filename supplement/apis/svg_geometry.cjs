// Exact local SVG geometry functions; excludes original photos, logos, font paths and copy.
const C={navy:'#002A40',deep:'#001D30',green:'#00B97B',gold:'#F6E67A',white:'#FFFFFF',mint:'#DCF4E8',ink:'#032B41',grey:'#D8E1E5'};

function xml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}

function rect(x,y,w,h,fill,rx=0,stroke='',sw=1){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${sw}"`:''}/>`;}

function line(x1,y1,x2,y2,color,sw=2,more=''){return `<path d="M${x1},${y1}L${x2},${y2}" fill="none" stroke="${color}" stroke-width="${sw}" ${more}/>`;}

function poly(points,fill,more=''){return `<polygon points="${points}" fill="${fill}" ${more}/>`;}

function checkers(x,y,n=7,size=22,c1=C.green,c2=C.navy){let s='';for(let r=0;r<2;r++)for(let c=0;c<n;c++)if((r+c)%2===0)s+=rect(x+c*size,y+r*size,size,size,c1);return s;}

function brush(x,y,w,h,color=C.green){let s=poly(`${x},${y+h*.8} ${x+w*.07},${y+h*.12} ${x+w},${y} ${x+w*.96},${y+h*.8} ${x+w*.1},${y+h}`,color);for(let i=0;i<15;i++){let k=((i*37)%17)/17; s+=line(x+w*k,y+h*((i*13)%10)/10,x+w*Math.min(1,k+.17),y+h*((i*13)%10)/10-5,C.navy,1+(i%3));}return s;}

function base(W,H,light=false){let s=rect(-20,-20,W+40,H+40,light?'#F4F8F3':C.navy);s+=poly(`0,0 ${W*.58},0 ${W*.44},${H*.15} 0,${H*.1}`,light?'#FFFFFF':C.deep);s+=poly(`0,${H*.9} ${W},${H*.66} ${W},${H*.89} 0,${H}`,light?'#E0EDE2':'#00334B');s+=poly(`0,${H*.94} ${W},${H*.84} ${W},${H*.858} 0,${H*.956}`,C.green);s+=poly(`0,${H*.97} ${W},${H*.88} ${W},${H*.886} 0,${H*.978}`,C.gold);s+=checkers(W*.76,H*.91,8,W*.023,light?'#A7C9B9':'#005A5D');return s;}

function gate(x,y,w,h,color=C.green){let s=`<path d="M${x},${y+h}L${x},${y}L${x+w},${y}L${x+w},${y+h}" fill="none" stroke="${C.white}" stroke-width="${w*.095}" stroke-linejoin="round"/>`;s+=line(x,y,x+w,y,color,w*.047);for(let i=0;i<8;i++){s+=rect(x-w*.048,y+h*.48+i*h*.055,w*.096,h*.055,i%2?C.white:C.navy);s+=rect(x+w-w*.048,y+h*.48+i*h*.055,w*.096,h*.055,i%2?C.navy:C.white);}return s;}

function icon(kind,x,y,size,color=C.white){let s='',k=size/100;let stroke=`fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
 if(kind==='gate')s=`<path d="M14,86V14H86V86" ${stroke}/><path d="M30,28H70M30,43H70" ${stroke}/>`;
 if(kind==='flag')s=`<path d="M22,91V12M23,14Q48,4 60,20Q77,36 94,14V59Q76,78 58,57Q43,42 22,54" ${stroke}/>`;
 if(kind==='clock')s=`<circle cx="50" cy="55" r="37" ${stroke}/><path d="M50,55V30M50,55L70,64M40,5H60M50,5V15" ${stroke}/>`;
 if(kind==='safe')s=`<path d="M8,68H92M13,43V90M87,43V90" ${stroke}/><path d="M20,63L35,48M40,63L55,48M60,63L75,48M80,63L92,51" stroke="${C.gold}" stroke-width="9"/>`;
 if(kind==='goggles')s=`<path d="M8,33Q50,16 92,33L86,71Q66,83 54,62H46Q34,83 14,71Z" ${stroke}/><path d="M22,10V30M78,10V30" ${stroke}/><circle cx="30" cy="51" r="9" ${stroke}/><circle cx="70" cy="51" r="9" ${stroke}/>`;
 if(kind==='radio')s=`<rect x="13" y="27" width="74" height="61" rx="14" ${stroke}/><path d="M26,9V27M74,9V27" ${stroke}/><circle cx="32" cy="52" r="10" ${stroke}/><circle cx="68" cy="52" r="10" ${stroke}/><path d="M32,52L37,42M68,52L62,44M38,75H63" ${stroke}/>`;
 if(kind==='battery')s=`<rect x="24" y="17" width="52" height="73" rx="9" ${stroke}/><path d="M40,6H60M52,30L38,56H59L46,79" ${stroke}/>`;
 if(kind==='trophy')s=`<path d="M28,14H72V45Q72,68 50,68Q28,68 28,45ZM28,22H10V37Q10,53 29,53M72,22H90V37Q90,53 71,53M50,69V84M31,91H69" ${stroke}/>`;
 if(kind==='tools')s=`<path d="M25,10Q8,34 33,42L78,87L89,76L45,31Q52,10 34,10L32,26L22,20Z" ${stroke}/><path d="M77,8L90,22L69,43M34,63L13,86L24,96L46,73" ${stroke}/>`;
 if(kind==='drone'){
 s=`<path d="M24,24L76,76M24,76L76,24" stroke="${color}" stroke-width="10"/><rect x="40" y="30" width="20" height="40" rx="5" fill="${color}"/><circle cx="50" cy="31" r="8" fill="${C.green}"/>`;
 for(const [a,b] of [[24,24],[76,24],[24,76],[76,76]]){s+=`<circle cx="${a}" cy="${b}" r="6" fill="${C.gold}"/>`;for(const d of [0,120,240])s+=`<ellipse cx="${a+10}" cy="${b}" rx="14" ry="4" fill="${color}" transform="rotate(${d} ${a} ${b})"/>`;}}
 if(kind==='bolt')s=`<path d="M62,5L16,59H46L37,95L86,41H55Z" fill="${color}"/>`;
 if(kind==='propeller'){for(const d of [0,120,240])s+=`<ellipse cx="69" cy="50" rx="29" ry="10" fill="${color}" transform="rotate(${d} 50 50)"/>`;s+=`<circle cx="50" cy="50" r="11" fill="${C.gold}"/><circle cx="50" cy="50" r="4" fill="${C.navy}"/>`;}
 if(kind==='heart')s=`<path d="M50,88L13,51C-9,16 31,-1 50,25C69,-1 109,16 87,51Z" fill="${color}"/>`;
 return `<g transform="translate(${x} ${y}) scale(${k})">${s}</g>`;
}

function wrap(W,H,s){return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s}</svg>`;}
module.exports={C,xml,rect,line,poly,checkers,brush,base,gate,icon,wrap};
