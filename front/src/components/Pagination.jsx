import PropTypes from "prop-types";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  // Ajuste si la fenêtre est court
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - (maxVisible - 1));
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &laquo;
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          <span className="ellipsis">...</span>
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={page === currentPage ? "active" : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          <span className="ellipsis">...</span>
          <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &raquo;
      </button>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
