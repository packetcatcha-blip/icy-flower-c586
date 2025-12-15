const fs = require('fs');
const path = require('path');

function exists(p){ return fs.existsSync(path.join(__dirname,'..',p)); }

const checks = [
  'sellersco-worker/public/owasp-range.html',
  'sellersco-worker/public/owasp-range.js',
  'sellersco-worker/public/threat-map.html',
  'sellersco-worker/public/threat-map.js',
  'sellersco-worker/public/post-quantum.html',
  'sellersco-worker/public/post-quantum.js',
  'sellersco-worker/public/vendors.json',
  'nexum-sales-portal/package.json',
  'nexum-sales-portal/app/api/otx/route.js',
  'nexum-sales-portal/app/api/recommend/route.js'
];

let ok = true;
console.log('Running sanity checks...');
for(const c of checks){
  const p = path.join(__dirname,'..',c);
  if(!fs.existsSync(p)){
    console.error('MISSING:', c);
    ok = false;
  } else {
    console.log('OK:', c);
  }
}

// parse vendors.json
try{
  const vpath = path.join(__dirname,'..','sellersco-worker','public','vendors.json');
  if(fs.existsSync(vpath)){
    const raw = fs.readFileSync(vpath,'utf8');
    const arr = JSON.parse(raw);
    if(!Array.isArray(arr) || arr.length < 10){
      console.warn('vendors.json looks small or malformed');
    } else {
      console.log('vendors.json parsed,', arr.length, 'vendors');
    }
  }
}catch(e){ console.error('vendors.json parse error', e.message); ok = false }

if(!ok){
  console.error('Sanity checks failed');
  process.exit(2);
}
console.log('Sanity checks passed');
