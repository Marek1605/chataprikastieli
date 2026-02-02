'use client';

import { useState, useRef, useEffect, ElementType } from 'react';
import { useAdmin } from '@/lib/AdminContext';

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
  as: Component = 'span',
  className = '',
  multiline = false,
}: EditableTextProps) {
  const { isAdmin, isEditing, getText, setText } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const currentValue = getText(textKey, defaultValue);

  useEffect(() => { setLocalValue(currentValue); }, [currentValue]);
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) inputRef.current.select();
    }
  }, [editing]);

  const handleClick = (e: React.MouseEvent) => {
    if (isAdmin && isEditing) {
      e.preventDefault();
      e.stopPropagation();
      setEditing(true);
    }
  };

  const save = () => {
    setEditing(false);
    if (localValue !== currentValue) setText(textKey, localValue);
  };

  const cancel = () => {
    setLocalValue(currentValue);
    setEditing(false);
  };

  if (editing) {
    const cls = "bg-yellow-50 border-2 border-yellow-400 rounded-lg px-3 py-2 outline-none w-full text-graphite shadow-md text-inherit font-inherit";
    
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            onBlur={save}
            onKeyDown={e => { if (e.key === 'Escape') cancel(); }}
            className={cls + ' min-h-[80px] resize-y'}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            onBlur={save}
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
            className={cls}
          />
        )}
        <div className="absolute -top-6 left-0 flex gap-1">
          <span className="bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
            ✏️ {textKey}
          </span>
        </div>
      </div>
    );
  }

  if (!isAdmin || !isEditing) {
    return <Component className={className}>{currentValue || defaultValue}</Component>;
  }

  return (
    <Component
      className={`${className} cursor-pointer relative inline-block transition-all
        outline-2 outline-dashed outline-transparent
        hover:outline-yellow-400 hover:bg-yellow-100/40 
        hover:rounded-md`}
      onClick={handleClick}
      title="✏️ Klikni pre úpravu"
    >
      {currentValue || defaultValue}
    </Component>
  );
}
