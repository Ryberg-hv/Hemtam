/* Hemtam – gör att appen startar utan wifi. Versionen byts vid varje ny uppladdning. */
const CACHE='hemtam-v0.8';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png','./favicon.png','./favicon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(new Request(f,{cache:'reload'})).catch(()=>{}))))) });
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('hemtam-')&&k!==CACHE).map(k=>caches.delete(k)))))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return; // servern på Cloudflare går alltid direkt
  if(r.mode==='navigate'){e.respondWith(caches.match('./index.html').then(c=>c||fetch(r)).catch(()=>fetch(r)));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r)));
});
