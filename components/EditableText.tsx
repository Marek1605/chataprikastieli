'use client';

import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '@/lib/AdminContext';

interface Props {
  contentKey: string;
  defaultValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
}

export default function EditableText({ contentKey, defaultValue, as: Tag = 'span', className = '', multiline = false }: Props) {
  const { isAdmin, isEditing, content, updateContent } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const currentValue = content[contentKey] || defaultValue;

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleClick = () => {
    if (isAdmin && isEditing) {
      setEditing(true);
    }
  };

  const handleBlur = () => {
    setEditing(false);
    updateContent(contentKey, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) handleBlur();
    if (e.key === 'Escape') {
      setValue(currentValue);
      setEditing(false);
    }
  };

  if (editing) {
    const inputClass = "bg-yellow-100 border-2 border-yellow-400 rounded px-2 py-1 outline-none w-full " + className;
    
    if (multiline) {
      return (
        <textarea
          ref={inputRef as any}
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={inputClass}
          rows={3}
        />
      );
    }

    return (
      <input
        ref={inputRef as any}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={inputClass}
      />
    );
  }

  const editableClass = isAdmin && isEditing
    ? `${className} cursor-pointer hover:bg-yellow-100/50 hover:outline hover:outline-2 hover:outline-yellow-400 hover:outline-dashed rounded transition-all`
    : className;

  return (
    <Tag className={editableClass} onClick={handleClick} title={isAdmin && isEditing ? 'Klikni pre úpravu' : undefined}>
      {currentValue}
    </Tag>
  );
}
