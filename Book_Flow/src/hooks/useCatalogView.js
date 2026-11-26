import { useState, useCallback } from 'react';

const STORAGE_KEY = 'bookflow:catalogView';
const VALID_VIEWS = ['grid', 'list'];

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (VALID_VIEWS.includes(parsed)) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return 'grid';
}

export function useCatalogView() {
  const [view, setView] = useState(() => readFromStorage());

  const setViewSafe = useCallback((nextView) => {
    try {
      const newView = typeof nextView === 'function' ? nextView(view) : nextView;
      if (VALID_VIEWS.includes(newView)) {
        setView(newView);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newView));
      }
    } catch {
      // ignore write errors
    }
  }, [view]);

  const toggleView = useCallback(() => {
    setViewSafe((v) => (v === 'grid' ? 'list' : 'grid'));
  }, [setViewSafe]);

  return { view, setView: setViewSafe, toggleView };
}