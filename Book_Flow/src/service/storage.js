/* Persistencia: todo se guarda en localStorage, así sobrevive al cerrar el navegador. */
const P = 'bookflow:';

export const storage = {
  get(k, d) { try { const v = localStorage.getItem(P + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch { /* ignore write errors */ } },
  remove(k) { try { localStorage.removeItem(P + k); } catch { /* ignore remove errors */ } },
};

export const ok = (data) => ({ ok: true, data });
export const fail = (error) => ({ ok: false, error });
