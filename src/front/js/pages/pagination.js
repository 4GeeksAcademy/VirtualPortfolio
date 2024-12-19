import React from "react";

const Pagination = ({ coinsPerPage, setCoinsPerPage, currentPage, setCurrentPage }) => {
  return (
    <div className="pagination d-flex justify-content-between align-items-center">
      <div>
        <label className="text-white">Coins per page:</label>
        <select
          className="form-select"
          value={coinsPerPage}
          onChange={(e) => setCoinsPerPage(parseInt(e.target.value))}
        >
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={300}>300</option>
          <option value={1000}>1000</option>
        </select>
      </div>
      <div>
        <button
          className="btn btn-dark"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-white mx-3">Page {currentPage}</span>
        <button
          className="btn btn-dark"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
