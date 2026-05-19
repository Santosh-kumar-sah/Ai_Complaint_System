// client/src/components/ui/Pagination.jsx | Pagination controls | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ page, pages, onPageChange, total, limit }) => {
  if (!pages || pages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-800/70 p-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-slate-400">
        Showing {start}-{end} of {total} complaints
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn-secondary px-4 py-2" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>
        {Array.from({ length: pages }, (_, index) => index + 1).slice(0, 7).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`rounded-xl px-4 py-2 text-sm transition-all ${pageNumber === page ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-700'}`}
          >
            {pageNumber}
          </button>
        ))}
        <button type="button" className="btn-secondary px-4 py-2" onClick={() => onPageChange(page + 1)} disabled={page === pages}>
          Next
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
};

export default Pagination;