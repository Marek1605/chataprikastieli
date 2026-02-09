'use client';

import React, { useState, useRef, ElementType } from 'react';
import { useAdmin } from '@/lib/AdminContext';

export function EditableText({ textKey, defaultValue, as: Component = 'span', className = '', multiline = false }: {
  textKey: string; defaultValue: string; as?: ElementType; className?: string; multiline?: boolean;
}) {
  const { isEditing, getText, setText, isAdmin } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');
  const value = getText(textKey) || defaultValue;

  const startEditing = () => { if (!isEditing || !isAdmin) return; setLocalValue(value); setEditing(true); };
  const save = () => { setText(textKey, localValue); setEditing(false); };
  const cancel = () => setEditing(false);

  if (editing && isEditing) {
    const cls = 'w-full bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg px-3 py-2 text-inherit font-inherit focus:outline-none focus:border-yellow-400';
    if (multiline) {
      return (
        <div className="relative inline-block w-full">
          <textarea className={cls + ' resize-y min-h-[60px]'} value={localValue} onChange={e => setLocalValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') cancel(); }} autoFocus rows={3} />
          <div className="flex gap-1 mt-1">
            <button onClick={save} className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium">Ulozit</button>
            <button onClick={cancel} className="px-3 py-1 bg-white/10 text-white/60 rounded-lg text-xs">Zrusit</button>
          </div>
        </div>
      );
    }
    return (
      <span className="relative inline-flex items-center gap-1">
        <input className={cls} value={localValue} onChange={e => setLocalValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }} autoFocus
          style={{ width: Math.max(localValue.length * 0.6, 5) + 'em' }} />
        <button onClick={save} className="p-1 bg-green-500 text-white rounded text-[10px]">OK</button>
        <button onClick={cancel} className="p-1 bg-white/20 text-white/60 rounded text-[10px]">X</button>
      </span>
    );
  }

  const editClass = isEditing && isAdmin ? ' cursor-pointer outline-2 outline-dashed outline-transparent hover:outline-yellow-500/40 hover:bg-yellow-500/5 rounded-lg transition-all' : '';
  return (
    <Component className={className + editClass} onClick={startEditing}
      title={isEditing && isAdmin ? 'Klikni pre upravu: ' + textKey : undefined}>
      {value}
    </Component>
  );
}

export function EditableHeading({ textKey, defaultValue, level = 2, className = '' }: {
  textKey: string; defaultValue: string; level?: 1 | 2 | 3 | 4 | 5 | 6; className?: string;
}) {
  const Tag = ('h' + level) as ElementType;
  return <EditableText textKey={textKey} defaultValue={defaultValue} as={Tag} className={className} />;
}

export function EditableParagraph({ textKey, defaultValue, className = '' }: {
  textKey: string; defaultValue: string; className?: string;
}) {
  return <EditableText textKey={textKey} defaultValue={defaultValue} as="p" className={className} multiline />;
}

export function EditableImage({ imageKey, defaultSrc, alt, className = '' }: {
  imageKey: string; defaultSrc: string; alt: string; className?: string;
}) {
  const { isEditing, isAdmin, getImage, setImage, uploadImage } = useAdmin();
  const [showEditor, setShowEditor] = useState(false);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const src = getImage(imageKey) || defaultSrc;

  const handleUrlSave = () => {
    if (url) { setImage(imageKey, url); setUrl(''); setShowEditor(false); }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    setError('');
    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setImage(imageKey, uploadedUrl);
        setShowEditor(false);
      } else {
        setError('Upload zlyhal');
      }
    } catch (err: any) {
      setError(err.message || 'Upload zlyhal');
    } finally {
      setUploading(false);
    }
  };

  if (showEditor && isEditing && isAdmin) {
    return (
      <div className="relative">
        <img src={src} alt={alt} className={className + ' opacity-50'} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 w-72 space-y-3 shadow-2xl">
            <h4 className="text-xs font-bold text-white">Zmenit obrazok</h4>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUrlSave()}
              placeholder="URL obrazka..."
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={handleUrlSave} disabled={!url}
                className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium disabled:opacity-30">
                URL
              </button>
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className={'flex-1 py-2 rounded-lg text-xs font-medium ' + (uploading ? 'bg-blue-500/10 text-blue-300 animate-pulse' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30')}>
                {uploading ? 'Nahravam...' : 'Subor'}
              </button>
              <button onClick={() => setShowEditor(false)}
                className="px-3 py-2 bg-white/5 text-white/40 rounded-lg text-xs">
                X
              </button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={'relative ' + (isEditing && isAdmin ? 'cursor-pointer group' : '')}
      onClick={() => isEditing && isAdmin && setShowEditor(true)}
    >
      <img src={src} alt={alt} className={className} />
      {isEditing && isAdmin && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-xl">
          <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">Zmenit obrazok</span>
        </div>
      )}
    </div>
  );
}
