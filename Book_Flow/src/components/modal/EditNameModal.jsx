import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { users } from '../../service/usersService';
import FormMessage from '../forms/FormMessage';

export default function EditNameModal() {
  const { user, toast, closeModal, refresh } = useApp();
  const [msg, setMsg] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const r = users.updateName(user.email, d.name);
    if (r.ok) { closeModal(); toast('Datos actualizados.'); refresh(); }
    else setMsg({ text: r.error, ok: false });
  };

  return (
    <>
      <h2>Modificar datos</h2>
      <form className="form" onSubmit={onSubmit}>
        <label className="field">Nombre completo<input name="name" defaultValue={user.name} required /></label>
        <FormMessage msg={msg} />
        <button className="btn btn--primary">Guardar cambios</button>
      </form>
    </>
  );
}
