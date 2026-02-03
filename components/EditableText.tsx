'use client';

import { useState, useRef, useEffect, ElementType } from 'react';
import { useAdmin } from '@/lib/AdminContext';

// ===========================================
// EDITABLE TEXT
// ===========================================
interface EditableTextProps {
  textKey: string;
  defaultValue: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
}

export default function EditableText({
  textKey,
  defaultValue,
  as: Tag = 'span',
  className = '',
  multiline = false,
}: EditableTextProps) {
  const { isAdmin, isEditing, getText, setText } = useAdmin();
  const [localEditing, setLocalEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const currentValue = getText(textKey, defaultValue);

  useEffect(() => { setValue(currentValue); }, [currentValue]);
  useEffect(() => {
    if (localEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [localEditing]);

  const handleClick = (e: React.MouseEvent) => {
    if (isAdmin && isEditing) {
      e.preventDefault();
      e.stopPropagation();
      setLocalEditing(true);
    }
  };

  const save = () => {
    setLocalEditing(false);
    if (value !== currentValue) setText(textKey, value);
  };

  const cancel = () => {
    setValue(currentValue);
    setLocalEditing(false);
  };

  // Editing input
  if (localEditing) {
    const inputClass = `
      bg-yellow-50 border-2 border-yellow-400 rounded-lg px-3 py-2 
      outline-none w-full text-graphite shadow-xl
      text-inherit font-inherit leading-inherit
    `;
    
    return (
      <div className="relative inline-block w-full">
        <div className="absolute -top-7 left-0 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-t-lg whitespace-nowrap z-10">
          ✏️ {textKey}
        </div>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={e => e.key === 'Escape' && cancel()}
            className={inputClass + ' min-h-[80px] resize-y'}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
            className={inputClass}
          />
        )}
      </div>
    );
  }

  // Normal display
  if (!isAdmin || !isEditing) {
    return <Tag className={className}>{currentValue}</Tag>;
  }

  // Editable state (hover)
  return (
    <Tag
      className={`${className} 
        cursor-pointer relative 
        outline-2 outline-dashed outline-transparent
        hover:outline-yellow-400 hover:bg-yellow-100/50 
        hover:rounded-md transition-all
        after:absolute after:content-['✏️'] after:text-sm
        after:opacity-0 hover:after:opacity-100
        after:-right-6 after:top-0
      `}
      onClick={handleClick}
      title="✏️ Klikni pre úpravu"
    >
      {currentValue}
    </Tag>
  );
}

// ===========================================
// EDITABLE IMAGE
// ===========================================
interface EditableImageProps {
  imageKey: string;
  defaultSrc: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function EditableImage({
  imageKey,
  defaultSrc,
  alt = '',
  className = '',
  fill = false,
}: EditableImageProps) {
  const { isAdmin, isEditing, getImage, setImage } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const currentSrc = getImage(imageKey, defaultSrc);

  const handleClick = (e: React.MouseEvent) => {
    if (isAdmin && isEditing) {
      e.preventDefault();
      e.stopPropagation();
      setUrlInput(currentSrc);
      setShowModal(true);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(imageKey, ev.target?.result as string);
      setShowModal(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUrl = () => {
    setImage(imageKey, urlInput);
    setShowModal(false);
  };

  const imgElement = (
    <img
      src={currentSrc}
      alt={alt}
      className={`${className} ${fill ? 'absolute inset-0 w-full h-full object-cover' : ''}`}
    />
  );

  if (!isAdmin || !isEditing) {
    return imgElement;
  }

  return (
    <>
      <div 
        className="relative cursor-pointer group" 
        onClick={handleClick}
        style={fill ? { position: 'absolute', inset: 0 } : {}}
      >
        {imgElement}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-400 text-black px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
            📷 Zmeniť obrázok
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[300] p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#2a2a2a] rounded-2xl p-5 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">📷 Zmeniť obrázok</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="aspect-video bg-black/50 rounded-xl overflow-hidden">
              <img src={currentSrc} alt="" className="w-full h-full object-contain" />
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-1">URL obrázka</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
                <button onClick={handleSaveUrl} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold text-white">
                  Uložiť
                </button>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500">alebo</div>
            
            <button 
              onClick={() => fileRef.current?.click()} 
              className="w-full py-3 bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/20 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2"
            >
              📁 Nahrať z počítača
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>
        </div>
      )}
    </>
  );
}

// ===========================================
// SHORTHAND COMPONENTS
// ===========================================
export function EditableHeading({ textKey, defaultValue, level = 2, className = '' }: { 
  textKey: string; 
  defaultValue: string; 
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}) {
  return <EditableText textKey={textKey} defaultValue={defaultValue} as={`h${level}` as ElementType} className={className} />;
}

export function EditableParagraph({ textKey, defaultValue, className = '' }: { 
  textKey: string; 
  defaultValue: string;
  className?: string;
}) {
  return <EditableText textKey={textKey} defaultValue={defaultValue} as="p" className={className} multiline />;
}
