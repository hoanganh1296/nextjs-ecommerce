import { useEffect } from 'react';

function Toast({ msg, handleShow, bgColor }) {
  useEffect(() => {
    const timeout = setTimeout(() => handleShow(), 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [msg]);

  return (
    <div
      className="toast show position-fixed text-light"
      style={{ top: '5px', right: '5px', zIndex: 9999, minWidth: '280px' }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`toast-header ${bgColor} text-light`}>
        <strong className="me-auto text-light">{msg.title}</strong>
        <button
          type="button"
          className="ml-2 mb-1 btn-close"
          style={{ outline: 'none' }}
          data-bs-dismiss="toast"
          onClick={handleShow}
        />
      </div>
      <div className="toast-body text-dark">{msg.msg}</div>
    </div>
  );
}

export default Toast;
