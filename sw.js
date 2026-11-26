/* Hemtam – gör att appen startar utan wifi. Byt version vid varje ny uppladdning. */
const CACHE='hemtam-v0.5';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon.png','./icons/favicon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('hemtam-')&&k!==CACHE).map(k=>caches.delete(k)))))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return; // servern på Cloudflare går alltid direkt
  if(r.mode==='navigate'){e.respondWith(caches.match('./index.html').then(c=>c||fetch(r)));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r)));
});
