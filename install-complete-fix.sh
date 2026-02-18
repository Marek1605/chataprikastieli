#!/bin/bash
echo "🔧 Inštalujem kompletný fix..."
cd /root/chataprikastieli

# Rozbaľ
unzip -o complete-fix.zip

# Presuň súbory na správne miesta
mv -f AdminContext.tsx lib/
mv -f Atmosphere.tsx components/
mv -f Overview.tsx components/
mv -f Gallery.tsx components/
mv -f Hero.tsx components/
mv -f Surroundings.tsx components/
mv -f Providers.tsx components/

# Vyčisti
rm -f complete-fix.zip README.txt

# Git
git add -A
git commit -m "Complete image fix - all components"
git push

echo ""
echo "✅ HOTOVO!"
echo ""
echo "⚠️  DÔLEŽITÉ - V prehliadači:"
echo "   1. Otvor stránku"
echo "   2. F12 -> Application -> Local Storage"
echo "   3. Vymaž všetky položky 'chata_mega_admin'"
echo "   4. Ctrl+F5 refresh"
echo "   5. Prihláš sa do admin: ChataAdmin2025!"
echo "   6. Nahraj obrázky znova"
