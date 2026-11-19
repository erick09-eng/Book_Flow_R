import './modal.css';
import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import BookModal from './BookModal';
import AuthModal from './AuthModal';
import ForgotModal from './ForgotModal';
import ResetModal from './ResetModal';
import EditNameModal from './EditNameModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';

// Ventana emergente única: login, recuperación, datos de cuenta y detalle del libro
export default function ModalRoot() {
  const { modal, closeModal } = useApp();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeModal();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeModal]);

  if (!modal) return null;

  const content = {
    book: <BookModal id={modal.id} />,
    auth: <AuthModal />,
    forgot: <ForgotModal prefill={modal.prefill} />,
    reset: <ResetModal email={modal.email} />,
    edit: <EditNameModal />,
    pass: <ChangePasswordModal />,
    delete: <DeleteAccountModal />,
  }[modal.type];

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget || e.target.closest('[data-close]')) closeModal(); }}>
      <div className={'modal__box ' + (modal.type === 'book' ? 'modal__box--wide' : '')} role="dialog" aria-modal="true" key={modal.key}>
        <button className="modal__close" data-close aria-label="Cerrar">×</button>
        {content}
      </div>
    </div>
  );
}
