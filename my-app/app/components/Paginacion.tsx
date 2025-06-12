import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border px-3 py-2 rounded disabled:opacity-50 hover:bg-gray-100 transition"
      >
        ←
      </button>
      <span className="self-center">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border px-3 py-2 rounded disabled:opacity-50 hover:bg-gray-100 transition"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
