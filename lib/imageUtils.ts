// Konvertuje base64 na Blob URL - funguje v Chrome aj Firefox
export function base64ToBlobUrl(base64: string): string {
  // Ak nie je base64, vráť ako je
  if (!base64 || !base64.startsWith('data:')) {
    return base64;
  }
  
  try {
    const [header, data] = base64.split(',');
    const mimeMatch = header.match(/data:([^;]+)/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mime });
    
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error('Base64 to Blob error:', e);
    return base64;
  }
}

// Cache pre Blob URLs aby sa nevytvárali duplicity
const blobCache = new Map<string, string>();

export function getCachedBlobUrl(base64: string): string {
  if (!base64 || !base64.startsWith('data:')) {
    return base64;
  }
  
  // Použi hash prvých 100 znakov ako kľúč
  const key = base64.substring(0, 100);
  
  if (blobCache.has(key)) {
    return blobCache.get(key)!;
  }
  
  const blobUrl = base64ToBlobUrl(base64);
  blobCache.set(key, blobUrl);
  return blobUrl;
}
