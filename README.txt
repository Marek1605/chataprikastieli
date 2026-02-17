===============================================
     SUPER ADMIN PANEL - KOMPLETNA INSTALACIA
===============================================

SUBORY A KAM ICH NAHRAT:
------------------------
lib/
  AdminContext.tsx  -> /root/chataprikastieli/lib/AdminContext.tsx

components/
  AdminSidebar.tsx  -> /root/chataprikastieli/components/AdminSidebar.tsx
  Providers.tsx     -> /root/chataprikastieli/components/Providers.tsx
  Hero.tsx          -> /root/chataprikastieli/components/Hero.tsx
  Gallery.tsx       -> /root/chataprikastieli/components/Gallery.tsx
  FAQ.tsx           -> /root/chataprikastieli/components/FAQ.tsx
  Reviews.tsx       -> /root/chataprikastieli/components/Reviews.tsx
  Pricing.tsx       -> /root/chataprikastieli/components/Pricing.tsx
  Contact.tsx       -> /root/chataprikastieli/components/Contact.tsx


PO NAHRATI SPUSTI:
------------------
cd /root/chataprikastieli
git add -A
git commit -m "Super Admin Panel"
git push


PRIHLASENIE:
------------
Heslo: ChataAdmin2025!
Klikni na ozubene koliesko vlavo dole.


CO MOZES UPRAVOVAT:
-------------------
🏠 Hero        - Titulok, podtitulok, pozadie, badges
📋 O chate     - Popis, vlastnosti chaty
🖼️ Galeria     - Fotky (pridavat, mazat, presunut)
🛋️ Vybavenie   - Zoznam vybavenia chaty
💰 Cennik      - Ceny balikoch (vikend, reset, tyzden)
🗺️ Okolie      - Atrakcie v okoli
⭐ Recenzie    - Hodnotenia hosti
❓ FAQ         - Otazky a odpovede
📞 Kontakt     - Telefon, email, adresa, check-in/out
🔍 SEO         - Meta title, description, keywords
⚙️ Nastavenia  - Reset vsetkeho


POZNAMKY:
---------
- Vsetky zmeny sa ukladaju automaticky
- Obrazky su komprimovane na max 800px
- Data sa ukladaju do localStorage (v prehliadaci)
- Pre videnie zmien na inych zariadeniach treba
  znova nahrat data

===============================================
