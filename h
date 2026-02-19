[1mdiff --git a/README.txt b/README.txt[m
[1mnew file mode 100644[m
[1mindex 0000000..4dd82b7[m
[1m--- /dev/null[m
[1m+++ b/README.txt[m
[36m@@ -0,0 +1,24 @@[m
[32m+[m[32m===========================================[m
[32m+[m[32mCHATA FIX - Kompletná oprava[m
[32m+[m[32m===========================================[m
[32m+[m
[32m+[m[32mOPRAVENÉ:[m
[32m+[m[32m- Obrázky sa zobrazujú v Chrome aj Firefox[m
[32m+[m[32m- Navbar biely, nie priehľadný[m
[32m+[m[32m- Cena z admin panelu sa prejaví pri rezervácii[m
[32m+[m[32m- Odstránený prázdny priestor[m
[32m+[m[32m- Atmosféra - funkčné nahrávanie fotiek[m
[32m+[m[32m- Okolie - obrázky bez textu[m
[32m+[m[32m- Zjednodušené jazyky (len SK)[m
[32m+[m
[32m+[m[32mINŠTALÁCIA:[m
[32m+[m[32m-----------[m
[32m+[m[32mcd /root/chataprikastieli[m
[32m+[m[32munzip -o chata-fix-complete.zip[m
[32m+[m[32mrm chata-fix-complete.zip[m
[32m+[m[32mgit add -A[m
[32m+[m[32mgit commit -m "Complete fix - images, navbar, pricing, atmosphere"[m
[32m+[m[32mgit push[m
[32m+[m
[32m+[m[32mHESLO: ChataAdmin2025![m
[32m+[m[32m===========================================[m
[1mdiff --git a/components/Atmosphere.tsx b/components/Atmosphere.tsx[m
[1mindex 3670f6f..c36d90e 100644[m
[1m--- a/components/Atmosphere.tsx[m
[1m+++ b/components/Atmosphere.tsx[m
[36m@@ -18,27 +18,27 @@[m [mexport default function Atmosphere() {[m
             <p className="text-gray-600 text-lg">{a.text2}</p>[m
           </div>[m
           <div className="grid grid-cols-2 gap-4">[m
[31m-            {/* Ranná atmosféra */}[m
[31m-            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#d4cfc7]">[m
[31m-              <p className="absolute top-4 left-4 z-20 text-graphite font-medium bg-white/80 px-2 py-1 rounded text-sm">{a.morningTitle}</p>[m
[31m-              {a.morningImage ? ([m
[32m+[m[32m            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#e8e4dc]">[m
[32m+[m[32m              <p className="absolute top-4 left-4 z-10 text-graphite font-medium bg-white/80 px-2 py-1 rounded">{a.morningTitle}</p>[m
[32m+[m[32m              {a.morningImage && ([m
                 <img [m
                   src={a.morningImage} [m
[31m-                  alt={a.morningTitle}[m
[31m-                  className="absolute inset-0 w-full h-full object-cover z-10"[m
[32m+[m[32m                  alt={a.morningTitle}[m[41m [m
[32m+[m[32m                  className="absolute inset-0 w-full h-full object-cover"[m
[32m+[m[32m                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}[m
                 />[m
[31m-              ) : null}[m
[32m+[m[32m              )}[m
             </div>[m
[31m-            {/* Večerná atmosféra */}[m
[31m-            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#d4cfc7] mt-8">[m
[31m-              <p className="absolute top-4 left-4 z-20 text-graphite font-medium bg-white/80 px-2 py-1 rounded text-sm">{a.eveningTitle}</p>[m
[31m-              {a.eveningImage ? ([m
[32m+[m[32m            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#e8e4dc] mt-8">[m
[32m+[m[32m              <p className="absolute top-4 left-4 z-10 text-graphite font-medium bg-white/80 px-2 py-1 rounded">{a.eveningTitle}</p>[m
[32m+[m[32m              {a.eveningImage && ([m
                 <img [m
                   src={a.eveningImage} [m
[31m-                  alt={a.eveningTitle}[m
[31m-                  className="absolute inset-0 w-full h-full object-cover z-10"[m
[32m+[m[32m                  alt={a.eveningTitle}[m[41m [m
[32m+[m[32m                  className="absolute inset-0 w-full h-full object-cover"[m
[32m+[m[32m                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}[m
                 />[m
[31m-              ) : null}[m
[32m+[m[32m              )}[m
             </div>[m
           </div>[m
         </div>[m
[1mdiff --git a/components/Gallery.tsx b/components/Gallery.tsx[m
[1mindex b3142e7..9303dbe 100644[m
[1m--- a/components/Gallery.tsx[m
[1m+++ b/components/Gallery.tsx[m
[36m@@ -8,10 +8,9 @@[m [mexport default function Gallery() {[m
   const [lightbox, setLightbox] = useState(false);[m
   const [idx, setIdx] = useState(0);[m
   const g = data.gallery;[m
[31m-  const imgs = g.images || [];[m
[32m+[m[32m  const imgs = g.images;[m
 [m
   const grid = ['col-span-2 row-span-2', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-2', 'col-span-1', 'col-span-1'];[m
[31m-  [m
   if (!imgs.length) return null;[m
 [m
   return ([m
[36m@@ -23,29 +22,28 @@[m [mexport default function Gallery() {[m
         </header>[m
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[150px] md:auto-rows-[180px]">[m
           {imgs.map((img, i) => ([m
[31m-            <article key={img.id} className={cn('relative rounded-xl overflow-hidden cursor-pointer group bg-[#d4cfc7]', grid[i % grid.length])}>[m
[31m-              {img.src ? ([m
[31m-                <img [m
[31m-                  src={img.src} [m
[31m-                  alt={img.alt || 'Galéria'}[m
[31m-                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"[m
[31m-                />[m
[31m-              ) : null}[m
[31m-              <button [m
[31m-                onClick={() => { setIdx(i); setLightbox(true); }} [m
[31m-                className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors z-10" [m
[32m+[m[32m            <article key={img.id} className={cn('relative rounded-xl overflow-hidden cursor-pointer group bg-cream', grid[i % grid.length])}>[m
[32m+[m[32m              <img[m[41m [m
[32m+[m[32m                src={img.src}[m[41m [m
[32m+[m[32m                alt={img.alt}[m[41m [m
[32m+[m[32m                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"[m
[32m+[m[32m                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/gallery-1.jpg'; }}[m
               />[m
[32m+[m[32m              <button onClick={() => { setIdx(i); setLightbox(true); }} className="absolute inset-0 hover:bg-black/20 transition-colors" />[m
             </article>[m
           ))}[m
         </div>[m
       </div>[m
       [m
[31m-      {lightbox && imgs[idx] && ([m
[32m+[m[32m      {/* Lightbox */}[m
[32m+[m[32m      {lightbox && ([m
         <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[500]" onClick={() => setLightbox(false)}>[m
[31m-          <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-20">✕</button>[m
[31m-          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-20" onClick={e => { e.stopPropagation(); setIdx(p => (p - 1 + imgs.length) % imgs.length); }}>←</button>[m
[31m-          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-20" onClick={e => { e.stopPropagation(); setIdx(p => (p + 1) % imgs.length); }}>→</button>[m
[31m-          <img src={imgs[idx].src} alt={imgs[idx].alt || 'Galéria'} className="max-h-[80vh] max-w-[90vw] object-contain" onClick={e => e.stopPropagation()} />[m
[32m+[m[32m          <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300">✕</button>[m
[32m+[m[32m          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300" onClick={e => { e.stopPropagation(); setIdx(p => (p - 1 + imgs.length) % imgs.length); }}>←</button>[m
[32m+[m[32m          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300" onClick={e => { e.stopPropagation(); setIdx(p => (p + 1) % imgs.length); }}>→</button>[m
[32m+[m[32m          <div onClick={e => e.stopPropagation()}>[m
[32m+[m[32m            <img src={imgs[idx]?.src || ''} alt={imgs[idx]?.alt || ''} className="max-h-[80vh] max-w-[90vw] object-contain" />[m
[32m+[m[32m          </div>[m
           <div className="absolute bottom-4 text-white bg-black/50 px-4 py-2 rounded-full">{idx + 1} / {imgs.length}</div>[m
         </div>[m
       )}[m
[1mdiff --git a/components/Hero.tsx b/components/Hero.tsx[m
[1mindex 8a1aaf5..06504e9 100644[m
[1m--- a/components/Hero.tsx[m
[1m+++ b/components/Hero.tsx[m
[36m@@ -15,17 +15,18 @@[m [mexport default function Hero() {[m
 [m
   return ([m
     <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">[m
[32m+[m[32m      {/* Pozadie */}[m
       <div className="absolute inset-0 z-0">[m
         <div className="absolute inset-0 bg-gradient-to-br from-wood/70 via-wood-dark/80 to-graphite/90 z-10" />[m
[31m-        {h.backgroundImage ? ([m
[31m-          <img [m
[31m-            src={h.backgroundImage} [m
[31m-            alt="Chata pri Kaštieli" [m
[31m-            className="absolute inset-0 w-full h-full object-cover"[m
[31m-          />[m
[31m-        ) : null}[m
[32m+[m[32m        <img[m[41m [m
[32m+[m[32m          src={h.backgroundImage}[m[41m [m
[32m+[m[32m          alt="Chata pri Kaštieli"[m[41m [m
[32m+[m[32m          className="absolute inset-0 w-full h-full object-cover"[m
[32m+[m[32m          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}[m
[32m+[m[32m        />[m
       </div>[m
       [m
[32m+[m[32m      {/* Obsah */}[m
       <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>[m
         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white mb-6 leading-tight">{h.title}</h1>[m
         <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">{h.subtitle}</p>[m
[36m@@ -39,8 +40,12 @@[m [mexport default function Hero() {[m
         </div>[m
         [m
         <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 px-4">[m
[31m-          <a href="#booking" onClick={scroll('booking')} className="btn btn-lg bg-white text-graphite hover:bg-cream font-semibold shadow-lg">📅 {h.cta1}</a>[m
[31m-          <a href="#booking" onClick={scroll('booking')} className="btn btn-lg bg-transparent text-white border-2 border-white/60 hover:bg-white/15">{h.cta2}</a>[m
[32m+[m[32m          <a href="#booking" onClick={scroll('booking')} className="btn btn-lg bg-white text-graphite hover:bg-cream font-semibold shadow-lg">[m
[32m+[m[32m            📅 {h.cta1}[m
[32m+[m[32m          </a>[m
[32m+[m[32m          <a href="#booking" onClick={scroll('booking')} className="btn btn-lg bg-transparent text-white border-2 border-white/60 hover:bg-white/15">[m
[32m+[m[32m            {h.cta2}[m
[32m+[m[32m          </a>[m
         </div>[m
         [m
         <div className="flex items-center justify-center gap-4 text-white/90">[m
[1mdiff --git a/components/Overview.tsx b/components/Overview.tsx[m
[1mindex ec11f15..1c7dec5 100644[m
[1m--- a/components/Overview.tsx[m
[1m+++ b/components/Overview.tsx[m
[36m@@ -27,14 +27,15 @@[m [mexport default function Overview() {[m
               ))}[m
             </div>[m
           </div>[m
[31m-          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#d4cfc7]">[m
[31m-            {o.image ? ([m
[32m+[m[32m          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream">[m
[32m+[m[32m            {o.image && ([m
               <img [m
                 src={o.image} [m
[31m-                alt={o.title}[m
[32m+[m[32m                alt={o.title}[m[41m [m
                 className="absolute inset-0 w-full h-full object-cover"[m
[32m+[m[32m                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}[m
               />[m
[31m-            ) : null}[m
[32m+[m[32m            )}[m
           </div>[m
         </div>[m
       </div>[m
[1mdiff --git a/components/Surroundings.tsx b/components/Surroundings.tsx[m
[1mindex 3cce909..6eca30a 100644[m
[1m--- a/components/Surroundings.tsx[m
[1m+++ b/components/Surroundings.tsx[m
[36m@@ -15,15 +15,18 @@[m [mexport default function Surroundings() {[m
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">[m
           {s.attractions.map(a => ([m
             <div key={a.id} className="bg-cream rounded-2xl overflow-hidden shadow-sm">[m
[32m+[m[32m              {/* Obrázok BEZ textu */}[m
               <div className="relative aspect-[4/3] bg-[#d4cfc7]">[m
[31m-                {a.image ? ([m
[32m+[m[32m                {a.image && ([m
                   <img [m
                     src={a.image} [m
[31m-                    alt={a.title}[m
[32m+[m[32m                    alt={a.title}[m[41m [m
                     className="absolute inset-0 w-full h-full object-cover"[m
[32m+[m[32m                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}[m
                   />[m
[31m-                ) : null}[m
[32m+[m[32m                )}[m
               </div>[m
[32m+[m[32m              {/* Text pod obrázkom */}[m
               <div className="p-4">[m
                 <span className="text-xs text-wood font-semibold uppercase">{a.category}</span>[m
                 <h3 className="font-bold text-graphite mt-1">{a.title}</h3>[m
[1mdiff --git a/install-complete-fix.sh b/install-complete-fix.sh[m
[1mdeleted file mode 100755[m
[1mindex cbc866f..0000000[m
[1m--- a/install-complete-fix.sh[m
[1m+++ /dev/null[m
[36m@@ -1,34 +0,0 @@[m
[31m-#!/bin/bash[m
[31m-echo "🔧 Inštalujem kompletný fix..."[m
[31m-cd /root/chataprikastieli[m
[31m-[m
[31m-# Rozbaľ[m
[31m-unzip -o complete-fix.zip[m
[31m-[m
[31m-# Presuň súbory na správne miesta[m
[31m-mv -f AdminContext.tsx lib/[m
[31m-mv -f Atmosphere.tsx components/[m
[31m-mv -f Overview.tsx components/[m
[31m-mv -f Gallery.tsx components/[m
[31m-mv -f Hero.tsx components/[m
[31m-mv -f Surroundings.tsx components/[m
[31m-mv -f Providers.tsx components/[m
[31m-[m
[31m-# Vyčisti[m
[31m-rm -f complete-fix.zip README.txt[m
[31m-[m
[31m-# Git[m
[31m-git add -A[m
[31m-git commit -m "Complete image fix - all components"[m
[31m-git push[m
[31m-[m
[31m-echo ""[m
[31m-echo "✅ HOTOVO!"[m
[31m-echo ""[m
[31m-echo "⚠️  DÔLEŽITÉ - V prehliadači:"[m
[31m-echo "   1. Otvor stránku"[m
[31m-echo "   2. F12 -> Application -> Local Storage"[m
[31m-echo "   3. Vymaž všetky položky 'chata_mega_admin'"[m
[31m-echo "   4. Ctrl+F5 refresh"[m
[31m-echo "   5. Prihláš sa do admin: ChataAdmin2025!"[m
[31m-echo "   6. Nahraj obrázky znova"[m
[1mdiff --git a/lib/AdminContext.tsx b/lib/AdminContext.tsx[m
[1mindex e0040d8..bd3327a 100644[m
[1m--- a/lib/AdminContext.tsx[m
[1m+++ b/lib/AdminContext.tsx[m
[36m@@ -1,11 +1,11 @@[m
 'use client';[m
[31m-import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';[m
[32m+[m[32mimport { createContext, useContext, useState, useEffect, ReactNode } from 'react';[m
 [m
 const STORAGE_KEY = 'chata_mega_admin_v2';[m
 [m
 interface GalleryImage { id: string; src: string; alt: string; }[m
 interface Review { id: string; name: string; text: string; rating: number; date: string; }[m
[31m-interface FAQItem { id: string; question: string; answer: string; }[m
[32m+[m[32minterface FAQ { id: string; question: string; answer: string; }[m
 interface Amenity { id: string; icon: string; title: string; items: string[]; }[m
 interface Attraction { id: string; image: string; category: string; title: string; description: string; }[m
 interface BookingLink { id: string; name: string; url: string; }[m
[36m@@ -80,7 +80,7 @@[m [minterface SiteData {[m
   faq: {[m
     label: string;[m
     title: string;[m
[31m-    items: FAQItem[];[m
[32m+[m[32m    items: FAQ[];[m
   };[m
   contact: {[m
     label: string;[m
[36m@@ -124,7 +124,7 @@[m [minterface SiteData {[m
 const defaultData: SiteData = {[m
   hero: {[m
     title: 'Únik do ticha pod horami.',[m
[31m-    subtitle: 'Luxusná horská chata s panoramatickým výhľadom na Malú Fatru.',[m
[32m+[m[32m    subtitle: 'Luxusná horská chata s panoramatickým výhľadom na Malú Fatru. Moderný dizajn, absolútne súkromie a nezabudnuteľné zážitky v srdci Turca.',[m
     backgroundImage: '/assets/hero.jpg',[m
     badges: [[m
       { icon: '🔒', text: 'Súkromie' },[m
[36m@@ -140,7 +140,7 @@[m [mconst defaultData: SiteData = {[m
   overview: {[m
     label: 'O CHATE',[m
     title: 'Váš horský únik',[m
[31m-    description: 'Moderná chata s tradičným duchom, kde sa stretáva komfort s prírodou.',[m
[32m+[m[32m    description: 'Moderná chata s tradičným duchom, kde sa stretáva komfort s prírodou. Ideálne miesto pre rodinnú dovolenku, romantický víkend alebo pracovný retreat.',[m
     features: [[m
       { id: '1', icon: '🛏️', title: 'Spálne', value: '3' },[m
       { id: '2', icon: '👥', title: 'Hostia', value: '6-8' },[m
[36m@@ -163,12 +163,12 @@[m [mconst defaultData: SiteData = {[m
     label: 'VYBAVENIE CHATY',[m
     title: 'Všetko pre váš komfort',[m
     categories: [[m
[31m-      { id: '1', icon: '🍳', title: 'Kuchyňa', items: ['Indukčná varná doska', 'Kávovar', 'Chladnička'] },[m
[31m-      { id: '2', icon: '🚿', title: 'Kúpeľňa', items: ['Sprchový kút', 'Kozmetika', 'Fén'] },[m
[31m-      { id: '3', icon: '🛏️', title: 'Spálňa', items: ['Kvalitné postele', 'Obliečky', 'Závesy'] },[m
[31m-      { id: '4', icon: '🛋️', title: 'Obývačka', items: ['Smart TV', 'Netflix', 'Reproduktor'] },[m
[31m-      { id: '5', icon: '🌲', title: 'Exteriér', items: ['Terasa', 'Gril', 'Parkovanie'] },[m
[31m-      { id: '6', icon: '🎿', title: 'Aktivity', items: ['Turistika', 'Lyžovanie', 'Cyklistika'] },[m
[32m+[m[32m      { id: '1', icon: '🍳', title: 'Plne vybavená kuchyňa', items: ['Indukčná varná doska', 'Prémiový kávovar', 'Veľká chladnička', 'Mikrovlnná rúra', 'Kompletný riad pre 6 osôb'] },[m
[32m+[m[32m      { id: '2', icon: '🚿', title: 'Moderná kúpeľňa', items: ['Priestranný sprchový kút', 'Prémiová kozmetika', 'Profesionálny fén', 'Mäkké uteráky', 'Podlahové kúrenie'] },[m
[32m+[m[32m      { id: '3', icon: '🛏️', title: 'Pohodlná spálňa', items: ['Kvalitné postele s ortopedickými matracmi', 'Luxusné bavlnené obliečky', 'Zatemňovacie závesy', 'Priestranné úložné priestory'] },[m
[32m+[m[32m      { id: '4', icon: '🛋️', title: 'Útulná obývačka', items: ['Pohodlná rozkladacia sedačka', '55" Smart TV s Netflixom', 'Bluetooth reproduktor', 'Výber stolových hier'] },[m
[32m+[m[32m      { id: '5', icon: '🌲', title: 'Súkromný exteriér', items: ['Priestranná terasa so sedením', 'Záhradný nábytok', 'Súkromné parkovanie', 'Plynový gril Weber'] },[m
[32m+[m[32m      { id: '6', icon: '🎿', title: 'Zážitky v okolí', items: ['Turistické chodníky', 'Cyklotrasy', 'Lyžiarske strediská', 'Historické pamiatky'] },[m
     ],[m
   },[m
   atmosphere: {[m
[36m@@ -207,33 +207,36 @@[m [mconst defaultData: SiteData = {[m
     label: 'OKOLIE A ATRAKCIE',[m
     title: 'Objavte krásu Turca',[m
     attractions: [[m
[31m-      { id: '1', image: '/assets/surrounding-1.jpg', category: 'PRÍRODA', title: 'Necpalská dolina', description: 'Krásna prírodná dolina.' },[m
[31m-      { id: '2', image: '/assets/surrounding-2.jpg', category: 'VÝLET', title: 'Ploská & Borišov', description: 'Populárne vrcholy.' },[m
[31m-      { id: '3', image: '/assets/surrounding-3.jpg', category: 'PRECHÁDZKA', title: 'Necpalské vodopády', description: 'Romantické vodopády.' },[m
[31m-      { id: '4', image: '/assets/surrounding-4.jpg', category: 'CELOROČNE', title: 'Jasenská dolina', description: 'Lyžovanie aj turistika.' },[m
[32m+[m[32m      { id: '1', image: '/assets/surrounding-1.jpg', category: 'PRÍRODA', title: 'Necpalská dolina', description: 'Krásna prírodná dolina s turistickými chodníkmi priamo od chaty.' },[m
[32m+[m[32m      { id: '2', image: '/assets/surrounding-2.jpg', category: 'CELODENNÝ VÝLET', title: 'Ploská & Borišov', description: 'Populárne vrcholy Veľkej Fatry s úžasnými výhľadmi.' },[m
[32m+[m[32m      { id: '3', image: '/assets/surrounding-3.jpg', category: 'ĽAHKÁ PRECHÁDZKA', title: 'Necpalské vodopády', description: 'Romantické prírodné vodopády ideálne na ľahkú prechádzku.' },[m
[32m+[m[32m      { id: '4', image: '/assets/surrounding-4.jpg', category: 'CELOROČNE', title: 'Jasenská dolina', description: 'Lyžiarske stredisko v zime, turistika a cyklistika v lete.' },[m
     ],[m
   },[m
   reviews: {[m
[31m-    label: 'RECENZIE',[m
[31m-    title: 'Čo hovoria hostia',[m
[32m+[m[32m    label: 'RECENZIE HOSTÍ',[m
[32m+[m[32m    title: 'Čo hovoria naši hostia',[m
     items: [[m
[31m-      { id: '1', name: 'Jana K.', text: 'Nádherné miesto!', rating: 5, date: '2024-10' },[m
[31m-      { id: '2', name: 'Peter M.', text: 'Super výhľad!', rating: 5, date: '2024-09' },[m
[32m+[m[32m      { id: '1', name: 'Jana K.', text: 'Nádherné miesto na oddych! Výhľad je úžasný a chata má všetko čo potrebujete.', rating: 5, date: '2024-10' },[m
[32m+[m[32m      { id: '2', name: 'Peter M.', text: 'Super výhľad, čistota, pokoj. Určite sa vrátime!', rating: 5, date: '2024-09' },[m
[32m+[m[32m      { id: '3', name: 'Lucia S.', text: 'Perfektný víkendový únik. Odporúčam všetkým.', rating: 5, date: '2024-08' },[m
     ],[m
   },[m
   faq: {[m
     label: 'FAQ',[m
     title: 'Často kladené otázky',[m
     items: [[m
[31m-      { id: '1', question: 'Aký je čas príchodu?', answer: 'Check-in od 15:00, check-out do 10:00.' },[m
[31m-      { id: '2', question: 'Je parkovanie?', answer: 'Áno, bezplatné pre 2 autá.' },[m
[32m+[m[32m      { id: '1', question: 'Aký je čas príchodu a odchodu?', answer: 'Check-in je od 15:00 a check-out do 10:00. Po dohode možné upraviť.' },[m
[32m+[m[32m      { id: '2', question: 'Je možné priviesť domáce zviera?', answer: 'Áno, domáce zvieratá sú vítané po predchádzajúcej dohode.' },[m
[32m+[m[32m      { id: '3', question: 'Je k dispozícii parkovanie?', answer: 'Áno, máme bezplatné parkovanie pre 2 autá priamo pri chate.' },[m
[32m+[m[32m      { id: '4', question: 'Aké platobné metódy akceptujete?', answer: 'Akceptujeme bankový prevod a platbu kartou.' },[m
     ],[m
   },[m
   contact: {[m
     label: 'KONTAKT',[m
     title: 'Kontaktujte nás',[m
     addressLabel: 'Adresa',[m
[31m-    address: 'Necpaly 90, 038 12',[m
[32m+[m[32m    address: 'Necpaly 90, 038 12 Necpaly',[m
     phoneLabel: 'Telefón',[m
     phone: '+421 915 327 597',[m
     emailLabel: 'Email',[m
[36m@@ -244,15 +247,15 @@[m [mconst defaultData: SiteData = {[m
     mapLabel: 'Nájdite nás',[m
   },[m
   footer: {[m
[31m-    description: 'Luxusná horská chata v Turci.',[m
[32m+[m[32m    description: 'Luxusná horská chata v Turci s výhľadom na Malú Fatru.',[m
     phone: '+421 915 327 597',[m
     email: 'info@chataprikastieli.sk',[m
[31m-    location: 'Necpaly, Turiec',[m
[31m-    copyright: '© 2026 Chata pri Kaštieli',[m
[31m-    madeWith: 'Made with ❤️',[m
[32m+[m[32m    location: 'Necpaly, Turiec, Slovensko',[m
[32m+[m[32m    copyright: '© 2026 Chata pri Kaštieli. Všetky práva vyhradené.',[m
[32m+[m[32m    madeWith: 'Made with ❤️ in Slovakia',[m
     privacyText: 'Ochrana súkromia',[m
     termsText: 'Obchodné podmienky',[m
[31m-    bookViaText: 'REZERVUJTE CEZ:',[m
[32m+[m[32m    bookViaText: 'REZERVUJTE AJ CEZ:',[m
   },[m
   nav: {[m
     home: 'Domov',[m
[36m@@ -268,18 +271,6 @@[m [mconst defaultData: SiteData = {[m
   },[m
 };[m
 [m
[31m-function deepMerge(target: any, source: any): any {[m
[31m-  const output = { ...target };[m
[31m-  for (const key in source) {[m
[31m-    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {[m
[31m-      output[key] = deepMerge(target[key] || {}, source[key]);[m
[31m-    } else {[m
[31m-      output[key] = source[key];[m
[31m-    }[m
[31m-  }[m
[31m-  return output;[m
[31m-}[m
[31m-[m
 interface AdminContextType {[m
   data: SiteData;[m
   isAdmin: boolean;[m
[36m@@ -295,54 +286,39 @@[m [mexport function AdminProvider({ children }: { children: ReactNode }) {[m
   const [isAdmin, setAdmin] = useState(false);[m
   const [loaded, setLoaded] = useState(false);[m
 [m
[31m-  // Load data on mount[m
   useEffect(() => {[m
     try {[m
       const saved = localStorage.getItem(STORAGE_KEY);[m
       if (saved) {[m
         const parsed = JSON.parse(saved);[m
[31m-        const merged = deepMerge(defaultData, parsed);[m
[31m-        setData(merged);[m
[31m-        console.log('Admin data loaded:', Object.keys(parsed));[m
[31m-      }[m
[31m-      if (sessionStorage.getItem('chata_admin') === 'true') {[m
[31m-        setAdmin(true);[m
[32m+[m[32m        setData(prev => ({ ...prev, ...parsed }));[m
       }[m
[31m-    } catch (e) {[m
[31m-      console.error('Load error:', e);[m
[31m-    }[m
[32m+[m[32m      if (sessionStorage.getItem('chata_admin') === 'true') setAdmin(true);[m
[32m+[m[32m    } catch (e) { console.error('Load error:', e); }[m
     setLoaded(true);[m
   }, []);[m
 [m
[31m-  const updateSection = useCallback(<K extends keyof SiteData>(section: K, value: Partial<SiteData[K]>) => {[m
[31m-    setData(prev => {[m
[31m-      const newData = {[m
[31m-        ...prev,[m
[31m-        [section]: { ...prev[section], ...value }[m
[31m-      };[m
[31m-      // Save to localStorage[m
[31m-      try {[m
[31m-        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));[m
[31m-        console.log('Saved section:', section, Object.keys(value));[m
[31m-      } catch (e) {[m
[31m-        console.error('Save error:', e);[m
[31m-        alert('Chyba pri ukladaní! Skúste menšie obrázky.');[m
[31m-      }[m
[31m-      return newData;[m
[31m-    });[m
[31m-  }, []);[m
[32m+[m[32m  const saveData = (newData: SiteData) => {[m
[32m+[m[32m    setData(newData);[m
[32m+[m[32m    try {[m[41m [m
[32m+[m[32m      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));[m[41m [m
[32m+[m[32m    } catch (e) {[m[41m [m
[32m+[m[32m      console.error('Save error:', e);[m[41m [m
[32m+[m[32m      alert('Chyba ukladania!');[m[41m [m
[32m+[m[32m    }[m
[32m+[m[32m  };[m
 [m
[31m-  const resetAll = useCallback(() => {[m
[31m-    localStorage.removeItem(STORAGE_KEY);[m
[31m-    setData(defaultData);[m
[31m-    window.location.reload();[m
[31m-  }, []);[m
[32m+[m[32m  const updateSection = <K extends keyof SiteData>(section: K, value: Partial<SiteData[K]>) => {[m
[32m+[m[32m    const newData = { ...data, [section]: { ...data[section], ...value } };[m
[32m+[m[32m    saveData(newData);[m
[32m+[m[32m  };[m
[32m+[m
[32m+[m[32m  const resetAll = () => {[m[41m [m
[32m+[m[32m    localStorage.removeItem(STORAGE_KEY);[m[41m [m
[32m+[m[32m    window.location.reload();[m[41m [m
[32m+[m[32m  };[m
 [m
[31m-  if (!loaded) {[m
[31m-    return <div className="min-h-screen flex items-center justify-center">[m
[31m-      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wood"></div>[m
[31m-    </div>;[m
[31m-  }[m
[32m+[m[32m  if (!loaded) return null;[m
 [m
   return ([m
     <AdminContext.Provider value={{ data, isAdmin, setAdmin, updateSection, resetAll }}>[m
[36m@@ -353,7 +329,7 @@[m [mexport function AdminProvider({ children }: { children: ReactNode }) {[m
 [m
 export function useAdmin() {[m
   const ctx = useContext(AdminContext);[m
[31m-  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');[m
[32m+[m[32m  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');[m
   return ctx;[m
 }[m
 [m
