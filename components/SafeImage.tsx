'use client';
import { useState, useEffect, memo } from 'react';
import { getCachedBlobUrl } from '@/lib/imageUtils';

interface SafeImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  onClick?: () => void;
}

// Memo komponent pre lepší výkon
const SafeImage = memo(function SafeImage({ 
  src, 
  alt, 
  fallback = '/assets/gallery-1.jpg',
  className = '',
  onClick
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallback);
      return;
    }

    // Ak je base64, konvertuj na Blob URL
    if (src.startsWith('data:')) {
      try {
        const blobUrl = getCachedBlobUrl(src);
        setImageSrc(blobUrl);
        setHasError(false);
      } catch (e) {
        console.error('Image conversion error:', e);
        setImageSrc(fallback);
        setHasError(true);
      }
    } else {
      // Normálna URL
      setImageSrc(src);
      setHasError(false);
    }
  }, [src, fallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallback);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onClick={onClick}
      loading="lazy"
      decoding="async"
    />
  );
});

export default SafeImage;
