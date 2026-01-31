'use client';

import { useState, useRef, useEffect, ElementType } from 'react';
import { useAdmin } from '@/lib/AdminContext';

interface EditableTextProps {
  textKey: string;
  defaultValue: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export default function EditableText({
  textKey,
  defaultValue,
  as: Component = 'span',
  className = '',
  multiline = false,
  placeholder = 'Klikni pre úpravu...',
}: EditableTextProps) {
  const { isAdmin, isEditing, getText, setText } = useAdmin();
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const currentValue = getText(textKey, defaultValue);

  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (isLocalEditing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isLocalEditing]);

  const handleClick = (e: React.MouseEvent) => {
    if (isAdmin && isEditing) {
      e.preventDefault();
      e.stopPropagation();
      setIsLocalEditing(true);
    }
  };

  const handleBlur = () => {
    setIsLocalEditing(false);
    if (localValue !== currentValue) {
      setText(textKey, localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalValue(currentValue);
      setIsLocalEditing(false);
    }
  };

  // Editing mode
  if (isLocalEditing) {
    const inputClassName = `
      bg-yellow-100 border-2 border-yellow-500 rounded-lg px-3 py-2 
      outline-none w-full text-graphite font-inherit
      shadow-lg
    `;
    
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={e => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={inputClassName + ' min-h-[100px] resize-y'}
          placeholder={placeholder}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={inputClassName}
        placeholder={placeholder}
      />
    );
  }

  // Display mode
  const editableClassName = isAdmin && isEditing
    ? `${className} cursor-pointer relative
       hover:bg-yellow-200/50 hover:outline hover:outline-2 
       hover:outline-yellow-500 hover:outline-dashed 
       rounded transition-all`
    : className;

  return (
    <Component 
      className={editableClassName}
      onClick={handleClick}
      title={isAdmin && isEditing ? '✏️ Klikni pre úpravu' : undefined}
    >
      {currentValue || defaultValue}
      {isAdmin && isEditing && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity">
          ✏️
        </span>
      )}
    </Component>
  );
}

// Jednoduchý wrapper pre rýchle použitie
export function EditableHeading({ 
  textKey, 
  defaultValue, 
  level = 2,
  className = '' 
}: { 
  textKey: string; 
  defaultValue: string; 
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}) {
  const Tag = `h${level}` as ElementType;
  return (
    <EditableText 
      textKey={textKey} 
      defaultValue={defaultValue} 
      as={Tag} 
      className={className}
    />
  );
}

export function EditableParagraph({ 
  textKey, 
  defaultValue,
  className = '' 
}: { 
  textKey: string; 
  defaultValue: string;
  className?: string;
}) {
  return (
    <EditableText 
      textKey={textKey} 
      defaultValue={defaultValue} 
      as="p" 
      className={className}
      multiline
    />
  );
}
