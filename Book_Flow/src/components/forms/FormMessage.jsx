/* Mensaje de error / éxito de un formulario (antes la función msg() de app.js) */
export default function FormMessage({ msg }) {
  return <p className={'msg' + (msg ? (msg.ok ? ' msg--ok' : ' msg--err') : '')} role="alert">{msg?.text}</p>;
}
