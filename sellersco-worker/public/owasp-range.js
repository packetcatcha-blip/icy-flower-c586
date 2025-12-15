// Simple, self-contained client-side logic for OWASP Range page
(function(){
  const topRisks = [
    { id:'A01', title:'Broken Access Control', desc:'Improper restrictions on authenticated users.' , examples:['Missing object-level checks','Insecure direct object references'], fixes:['Enforce checks server-side','Use lowest-privilege patterns']},
    { id:'A02', title:'Cryptographic Failures', desc:'Weak or missing cryptography.' , examples:['Hard-coded keys','Deprecated ciphers'], fixes:['Use vetted libs','Rotate keys, TLS1.3']},
    { id:'A03', title:'Injection', desc:'SQL/NoSQL/Command injection vectors.' , examples:['Concatenated queries','Unsafe deserialization'], fixes:['Use param queries','Input validation']},
    { id:'A04', title:'Insecure Design', desc:'Architectural security gaps.' , examples:['No threat model','Missing boundaries'], fixes:['Threat modeling','Secure design reviews']},
    { id:'A05', title:'Vulnerable and Outdated Components', desc:'Dependencies with known vulnerabilities.' , examples:['Old libs','Unpatched frameworks'], fixes:['SCA, dependency scanning','Regular upgrades']}
  ];

  const stackMap = {
    webapp: ['app','sast','devsecops','endpoint'],
    legacy: ['legacy','enterprise','idm'],
    cloudnative: ['k8s','cloud','edge','cdn'],
    iot: ['iot','embedded','visibility'],
    default: ['cloud','network','app']
  };

  let vendorList = null;

  async function loadVendors(){
    try{
      const r = await fetch('/vendors.json');
      if(!r.ok) throw new Error('vendors.json not found');
      vendorList = await r.json();
    }catch(e){
      console.warn('Could not load vendors.json — using built-in defaults', e);
      vendorList = null;
    }
  }

  function el(sel){return document.querySelector(sel)}
  function renderAccordion(){
    const container = el('#accordion');
    container.innerHTML = '';
    topRisks.forEach(r=>{
      const card = document.createElement('div'); card.className='card';
      const h = document.createElement('h3'); h.innerHTML = `<span>${r.id} — ${r.title}</span><small class="muted">toggle</small>`;
      const p = document.createElement('div'); p.className='panel';
      p.innerHTML = `
        <p class="muted">${r.desc}</p>
        <strong>Examples:</strong>
        <ul>${r.examples.map(x=>`<li>${x}</li>`).join('')}</ul>
        <strong>Fixes:</strong>
        <ul>${r.fixes.map(x=>`<li>${x}</li>`).join('')}</ul>
      `;
      p.style.display='none';
      h.addEventListener('click',()=>{ p.style.display = p.style.display === 'none' ? 'block' : 'none'; });
      card.appendChild(h); card.appendChild(p); container.appendChild(card);
    });
  }

  function scoreVendorForStack(vendor, stackKey){
    const stackTags = stackMap[stackKey] || stackMap.default;
    let score = vendor.baseEff || 60;
    // add bonus if vendor tags match stack tags
    if(vendor.tags && vendor.tags.length){
      for(const t of vendor.tags){
        if(stackTags.includes(t)) score += 6;
        if(stackTags.some(s=>t.includes(s))) score += 2;
      }
    }
    // clamp
    return Math.min(99, Math.max(20, Math.round(score)));
  }

  function recommend(){
    const key = document.getElementById('stackSelect').value || 'default';
    const chaos = document.getElementById('chaos').checked;
    const out = document.getElementById('recommendations'); out.innerHTML='';
    let candidates = [];
    if(vendorList){
      candidates = vendorList.map(v=>({name:v.name,eff:scoreVendorForStack(v,key)}));
      candidates.sort((a,b)=>b.eff - a.eff);
      candidates = candidates.slice(0,6);
    } else {
      // fallback to stackMap sample
      const sample = (stackMap[key] || stackMap.default).slice(0,3).map(n=>({name:n,eff:60}));
      candidates = sample;
    }

    // apply chaos randomization
    if(chaos) candidates = candidates.map(c=>({name:c.name,eff:Math.max(10,Math.round(c.eff * (0.5+Math.random())))}));

    candidates.forEach(r=>{
      const d = document.createElement('div'); d.className='partner'; d.innerHTML = `<strong>${r.name}</strong> <span class="muted">eff</span> <span class="eff" style="width:${r.eff/1.5}px"></span> <span style="margin-left:8px;color:var(--muted)">${r.eff}%</span>`;
      out.appendChild(d);
    })
  }

  window.addEventListener('DOMContentLoaded',()=>{
    renderAccordion();
    loadVendors().then(()=>{ document.getElementById('recommendBtn').addEventListener('click',recommend); recommend(); });
  });

})();
