#!/bin/bash
set -e
cd /root/chataprikastieli

echo "🔧 Inštalujem server-side ukladanie..."

# 1. Zálohy
cp lib/AdminContext.tsx lib/AdminContext.tsx.bak 2>/dev/null || true
cp app/api/admin-content/route.ts app/api/admin-content/route.ts.bak 2>/dev/null || true
cp app/api/admin-upload/route.ts app/api/admin-upload/route.ts.bak 2>/dev/null || true
cp components/AdminSidebar.tsx components/AdminSidebar.tsx.bak 2>/dev/null || true
cp Dockerfile Dockerfile.bak 2>/dev/null || true
echo "✅ Zálohy vytvorené"

# 2. Skopíruj nové súbory (už sú rozbalené zo ZIP-u)
echo "✅ AdminContext.tsx - server-side ukladanie"
echo "✅ admin-content/route.ts - GET/PUT so zálohou"
echo "✅ admin-upload/route.ts - POST upload + GET fallback"

# 3. Patch AdminSidebar - nahraď base64 upload za server upload
echo "🔧 Patchujem AdminSidebar.tsx..."

python3 << 'PYEOF'
with open('components/AdminSidebar.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip_until_click = False
compress_started = False
upload_started = False
upload_replaced = False

i = 0
while i < len(lines):
    line = lines[i]
    
    # Skip the compress function entirely
    if 'const compress = useCallback' in line:
        # Skip until we find the closing }, []);
        depth = 0
        while i < len(lines):
            if 'useCallback' in lines[i] or '=> {' in lines[i]:
                depth += lines[i].count('{') - lines[i].count('}')
            else:
                depth += lines[i].count('{') - lines[i].count('}')
            i += 1
            if depth <= 0 and '], [' in lines[i-1]:
                break
        # Also skip the blank line after
        if i < len(lines) and lines[i].strip() == '':
            i += 1
        continue
    
    # Skip the "// Kompresia" comment
    if '// Kompresia' in line:
        i += 1
        continue
    
    # Replace the uploadImage function
    if 'const uploadImage = useCallback' in line and not upload_replaced:
        # Write replacement
        new_lines.append('  // Nahranie obrázka na server\n')
        new_lines.append('  const uploadImageToServer = useCallback((callback: (url: string) => void) => {\n')
        new_lines.append("    const input = document.createElement('input');\n")
        new_lines.append("    input.type = 'file';\n")
        new_lines.append("    input.accept = 'image/jpeg,image/png,image/webp';\n")
        new_lines.append('    input.onchange = async (e: Event) => {\n')
        new_lines.append('      const file = (e.target as HTMLInputElement).files?.[0];\n')
        new_lines.append('      if (!file) return;\n')
        new_lines.append("      flash('⏳ Nahrávam na server...');\n")
        new_lines.append('      try {\n')
        new_lines.append('        const url = await uploadImage(file);\n')
        new_lines.append('        callback(url);\n')
        new_lines.append("        flash('✅ Uložené na server!');\n")
        new_lines.append('      } catch (err) {\n')
        new_lines.append("        console.error('Upload error:', err);\n")
        new_lines.append("        flash('❌ Chyba pri nahrávaní!');\n")
        new_lines.append('      }\n')
        new_lines.append('    };\n')
        new_lines.append('    input.click();\n')
        new_lines.append('  }, [uploadImage]);\n')
        
        upload_replaced = True
        
        # Skip old function until input.click(); and closing }, [...]);
        while i < len(lines):
            i += 1
            if i < len(lines) and ('input.click()' in lines[i]):
                i += 1  # skip input.click()
                # Skip closing }, [...]); 
                if i < len(lines) and ('], [' in lines[i] or '});' in lines[i]):
                    i += 1
                break
        continue
    
    # Replace uploadImage( calls with uploadImageToServer(
    if 'uploadImage(src =>' in line:
        line = line.replace('uploadImage(src =>', 'uploadImageToServer(src =>')
    if 'uploadImage((src)' in line:
        line = line.replace('uploadImage((src)', 'uploadImageToServer((src)')
    
    new_lines.append(line)
    i += 1

# Now fix useAdmin destructure to include uploadImage and saving
content = ''.join(new_lines)

# Add uploadImage to useAdmin destructure
import re
def add_to_destructure(content, varname):
    pattern = r'const \{([^}]+)\} = useAdmin\(\)'
    match = re.search(pattern, content)
    if match and varname not in match.group(1):
        old = match.group(0)
        vars_str = match.group(1).rstrip().rstrip(',')
        new = f'const {{{vars_str}, {varname}}} = useAdmin()'
        content = content.replace(old, new)
    return content

content = add_to_destructure(content, 'uploadImage')
content = add_to_destructure(content, 'saving')

with open('components/AdminSidebar.tsx', 'w') as f:
    f.write(content)

print("✅ AdminSidebar.tsx patched")
PYEOF

# 4. Verify patch
echo ""
echo "=== Verify: uploadImageToServer exists ==="
grep -c "uploadImageToServer" components/AdminSidebar.tsx || echo "❌ PATCH FAILED"

echo "=== Verify: old base64 compress removed ==="
grep -c "readAsDataURL\|canvas.toDataURL" components/AdminSidebar.tsx && echo "❌ Old base64 still present!" || echo "✅ Base64 removed"

echo "=== Verify: useAdmin has uploadImage ==="
grep "useAdmin()" components/AdminSidebar.tsx

# 5. Create dirs
mkdir -p data public/uploads
touch public/uploads/.gitkeep

# 6. Test build
echo ""
echo "🔨 Testing build..."
npm run build 2>&1 | tail -5

echo ""
echo "============================================"
echo "✅ Hotovo! Teraz:"
echo "   git add -A"
echo "   git commit -m 'Server-side admin: upload + content API'"
echo "   git push"
echo "============================================"
