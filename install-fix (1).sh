#!/bin/bash
echo "🔧 Inštalujem opravu..."
cd /root/chataprikastieli

# Rozbal ZIP
unzip -o chata-fix-complete.zip
rm chata-fix-complete.zip

# Git commit
git add -A
git commit -m "Complete fix - images, navbar, pricing, atmosphere"
git push

echo ""
echo "✅ HOTOVO!"
echo ""
echo "⚠️  DÔLEŽITÉ: V prehliadači vymaž localStorage:"
echo "   1. Otvor stránku"
echo "   2. F12 -> Application -> Local Storage"
echo "   3. Vymaž 'chata_mega_admin_v1' a 'chata_mega_admin_v2'"
echo "   4. Refresh stránky (Ctrl+F5)"
echo ""
echo "Heslo admin: ChataAdmin2025!"
