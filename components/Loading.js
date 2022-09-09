function Loading() {
  return (
    <div className="position-fixed w-100 h-100 text-center loading">
      <div
        className="spinner-border text-info"
        role="status"
        style={{ width: '3rem', height: '3rem' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;
