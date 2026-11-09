import './toast.css';
import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { toastState } = useApp();
  return (
    <div id="toast" role="status" className={'toast ' + (toastState.ok ? 'toast--ok' : 'toast--err') + (toastState.on ? ' is-on' : '')}>
      {toastState.text}
    </div>
  );
}
