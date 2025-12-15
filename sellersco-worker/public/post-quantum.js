// Post-Quantum lab client script: fills table, timeline, partners and simulates a hybrid KEM handshake
(function(){
  const candidates = [
    {cat:'KEM', name:'CRYSTALS-Kyber', strength:'High', notes:'Compact, NIST-selected KEM (recommended)'},
    {cat:'Signature', name:'CRYSTALS-Dilithium', strength:'High', notes:'Post-quantum signature with good performance'},
    {cat:'Signature', name:'Falcon', strength:'High', notes:'Smaller signatures; careful integration required'},
    {cat:'KEM', name:'BIKE', strength:'Moderate', notes:'Alternate lattice-based candidate'}
  ];

  const partners = ['F5 CalypsoAI','Palo Alto Networks','CrowdStrike','Akamai','Cloudflare'];

  function el(id){return document.getElementById(id)}

  function populateTable(){
    const tbody = document.querySelector('#pqTable tbody'); tbody.innerHTML = '';
    candidates.forEach(c=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c.cat}</td><td>${c.name}</td><td>${c.strength}</td><td class="muted">${c.notes}</td>`;
      tbody.appendChild(tr);
    });
  }

  function renderTimeline(){
    const root = el('timeline'); root.innerHTML='';
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('width','100%'); svg.setAttribute('height','100%');
    const milestones = [
      {label:'2023',t:0.1},{label:'2024',t:0.3},{label:'2025 NIST',t:0.55},{label:'2026-2028 Migration',t:0.8},{label:'2030+',t:0.95}
    ];
    milestones.forEach(m=>{
      const x = Math.round(m.t*980);
      const circle = document.createElementNS(svg.namespaceURI,'circle'); circle.setAttribute('cx',x); circle.setAttribute('cy',60); circle.setAttribute('r',6); circle.setAttribute('fill','#00d4ff');
      const text = document.createElementNS(svg.namespaceURI,'text'); text.setAttribute('x',x); text.setAttribute('y',90); text.setAttribute('fill','#9fb0c8'); text.setAttribute('font-size',12); text.setAttribute('text-anchor','middle'); text.textContent = m.label;
      svg.appendChild(circle); svg.appendChild(text);
    });
    root.appendChild(svg);
  }

  let verbose = false;
  function runSim(){
    const out = el('simOut'); out.textContent = 'Running hybrid KEM simulation...\n';
    const start = Date.now();
    // simulate asymmetric ops timings
    const classical = {name:'RSA-2048', keysize:2048, enc:120};
    const pq = {name:'CRYSTALS-Kyber', keysize:'n/a', enc:320};
    const hybridSize = classical.enc + pq.enc;
    setTimeout(()=>{
      const elapsed = Date.now()-start;
      out.textContent += `Classical (${classical.name}) ciphertext: ${classical.enc} bytes\n`
      out.textContent += `Post-Quantum (${pq.name}) ciphertext: ${pq.enc} bytes\n`
      out.textContent += `Hybrid combined ciphertext: ${hybridSize} bytes\n`
      out.textContent += `Simulated latency: ${elapsed + 20} ms\n`;
      if(verbose) out.textContent += '\nDetailed: simulated keygen 24ms, encaps 48ms, decaps 28ms\n';
    }, 400 + Math.random()*300);
  }

  function showPartners(){
    const container = el('pqPartners'); container.innerHTML='';
    partners.forEach(p=>{ const d=document.createElement('div'); d.className='partner'; d.textContent=p; container.appendChild(d); });
  }

  window.addEventListener('DOMContentLoaded',()=>{
    populateTable(); renderTimeline(); showPartners();
    el('runSim').addEventListener('click',runSim);
    el('toggleVerbose').addEventListener('click',()=>{ verbose=!verbose; el('toggleVerbose').textContent = `Verbose: ${verbose? 'On':'Off'}` });
  });

})();
