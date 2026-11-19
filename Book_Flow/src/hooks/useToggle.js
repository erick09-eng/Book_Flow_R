import { useState } from 'react';

// Reutiliza el comportamiento de abrir, cerrar y alternar.
// Cada llamada conserva su propio valor: dos paneles que usan useToggle no se afectan entre sí.
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((prev) => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  return { value, toggle, setTrue, setFalse };
}
