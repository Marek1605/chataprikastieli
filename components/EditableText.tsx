'use client';
import { ElementType } from 'react';

export default function EditableText({
  textKey, defaultValue, as: Component = 'span', className = '', multiline = false
}: {
  textKey: string; defaultValue: string; as?: ElementType; className?: string; multiline?: boolean;
}) {
  // Jednoducho zobraz text - editovanie je cez admin panel
  return <Component className={className}>{defaultValue}</Component>;
}
