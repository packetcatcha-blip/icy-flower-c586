// Threat Map client: Leaflet map with simulated OTX pulses and animated arrows
(function(){
  const center = [39.8283, -98.5795];
  let pew = false;
  let map, markers = [], arrows = [];

  function initMap(){
    map = L.map('map',{preferCanvas:true,center,zoom:4,scrollWheelZoom:false});
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{attribution:''}).addTo(map);
  }

  function randIn(bounds){
    const [minLat,maxLat,minLng,maxLng] = bounds;
    const lat = minLat + Math.random()*(maxLat-minLat);
    const lng = minLng + Math.random()*(maxLng-minLng);
    return [lat,lng];
  }

  function spawnPulse(latlng){
    const m = L.circleMarker(latlng,{radius:6,fillColor:'#ff3860',color:'#ff8aa0',weight:1,fillOpacity:0.9}).addTo(map);
    markers.push(m);
    setTimeout(()=>{map.removeLayer(m); markers = markers.filter(x=>x!==m)},4500);
  }

  function spawnArrow(from,to){
    const poly = L.polyline([from,to],{color:'#ff6b6b',weight:2,opacity:0.85}).addTo(map);
    arrows.push(poly);
    setTimeout(()=>{map.removeLayer(poly); arrows = arrows.filter(x=>x!==poly)},3500);
  }

  function simulateOTX(){
    // rough bounding box for continental US
    const bounds = [24.5,49.5,-125, -66.9];
    const count = 6 + Math.floor(Math.random()*6);
    const pts = [];
    for(let i=0;i<count;i++){ pts.push(randIn(bounds)); }
    pts.forEach(p=>spawnPulse(p));
    // arrows from random pulses to others
    for(let i=0;i<Math.min(8,pts.length);i++){
      const a = pts[Math.floor(Math.random()*pts.length)];
      const b = pts[Math.floor(Math.random()*pts.length)];
      if(a!==b) spawnArrow(a,b);
    }
    const stats = document.getElementById('stats');
    stats.innerHTML = `<strong>${count} pulses</strong><br/><span class="muted">Simulated OTX + RSS feed</span>`;
  }

  window.addEventListener('DOMContentLoaded',()=>{
    initMap();
    simulateOTX();
    document.getElementById('refreshBtn').addEventListener('click',simulateOTX);
    document.getElementById('togglePew').addEventListener('click',()=>{
      pew = !pew; document.getElementById('togglePew').textContent = `Pew-Pew: ${pew? 'On':'Off'}`;
      if(pew){ // add frequent micro-arrows
        window.pewInterval = setInterval(()=>{ simulateOTX(); }, 1800);
      } else { clearInterval(window.pewInterval); }
    });

    // auto-refresh
    setInterval(simulateOTX, 15000);
  });

})();
