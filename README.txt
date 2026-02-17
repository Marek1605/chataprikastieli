================================================
  MEGA ADMIN PANEL - KOMPLETNÁ SPRÁVA CELÉHO WEBU
================================================

OBSAH ZIP:
----------
lib/
  AdminContext.tsx     -> Centrálne dáta pre celý web

components/
  AdminSidebar.tsx     -> Admin panel s VŠETKÝMI sekciami
  Providers.tsx        -> Wrapper
  Hero.tsx             -> Hlavná sekcia
  Overview.tsx         -> O chate
  Gallery.tsx          -> Fotogaléria
  Amenities.tsx        -> Vybavenie (6 kategórií)
  Atmosphere.tsx       -> Atmosféra (ranná/večerná)
  Pricing.tsx          -> Cenové balíčky
  Surroundings.tsx     -> Okolie a atrakcie
  Reviews.tsx          -> Recenzie hostí
  FAQ.tsx              -> Často kladené otázky
  Contact.tsx          -> Kontaktné údaje
  Footer.tsx           -> Pätička


INŠTALÁCIA:
-----------
1. Nahraj ZIP do /root/chataprikastieli/
2. Spusti:

cd /root/chataprikastieli
unzip -o mega-admin-full.zip
rm mega-admin-full.zip
git add -A
git commit -m "MEGA Admin Panel - all sections editable"
git push


PRIHLÁSENIE:
------------
Heslo: ChataAdmin2025!


VŠETKY SEKCIE NA ÚPRAVU:
------------------------
🏠 Hero        - Titulok, podtitulok, pozadie, badges, rating, tlačidlá
📋 O chate     - Label, titulok, popis, vlastnosti (ikona+názov+hodnota), obrázok
🖼️ Galéria     - Label, titulok, obrázky (pridať/zmazať/presunúť)
🛋️ Vybavenie   - Label, titulok, kategórie s položkami
🌅 Atmosféra   - Label, titulok, texty, ranný/večerný obrázok
💰 Cenník      - Label, titulok, texty, 3 balíčky (názov/popis/noci/cena)
📅 Rezervácia  - Label, titulok, cena/noc, min nocí, max hostí, booking linky
🗺️ Okolie      - Label, titulok, atrakcie (kategória/názov/popis/obrázok)
⭐ Recenzie    - Label, titulok, recenzie (meno/text/rating/dátum)
❓ FAQ         - Label, titulok, otázky a odpovede
📞 Kontakt     - Label, titulok, všetky texty a hodnoty
📄 Footer      - Popis, kontakty, copyright, linky
🧭 Navigácia   - Texty všetkých položiek menu
⚙️ Reset       - Vymazať všetky zmeny

VŠETKO sa ukladá automaticky do localStorage!
================================================
