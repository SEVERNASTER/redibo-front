"use client";

import { FaTrash } from "react-icons/fa";

interface FiltersProps {
  filters: {
    isAvailable?: boolean;
    brand: string;
    model: string;
    carType: string;
    transmission: string;
    sortBy: string;
    page: number;
    limit: number;
  };
  onFilterChange: (newFilters: Partial<FiltersProps["filters"]>) => void;
  onClearFilters: () => void;
}

const FiltrosHost: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const hayFiltrosActivos = () => {
    return (
      filters.brand !== "" ||
      filters.carType !== "" ||
      filters.transmission !== "" ||
      filters.sortBy !== "" ||
      filters.isAvailable !== undefined
    );
  };

  return (
    <div className=" p-4 rounded-lg mb-4 shadow-sm">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-auto-fit gap-4 mb-2 items-center max-w-6xl w-full md:[grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
          <input
            type="search"
            placeholder="Marca"
            value={filters.brand}
            onChange={(e) => onFilterChange({ brand: e.target.value })}
            className="p-2 border rounded w-full"
          />
          <input
            type="search"
            placeholder="Modelo"
            value={filters.model}
            onChange={(e) => onFilterChange({ model: e.target.value })}
            className="p-2 border rounded w-full"
          />

          {filters.transmission ? (
            <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-full justify-between">
              <span className="truncate capitalize">{filters.transmission}</span>
              <button
                onClick={() => onFilterChange({ transmission: "" })}
                className="ml-2 text-white hover:text-gray-200 font-bold"
              >
                ×
              </button>
            </div>
          ) : (
            <select
              value={filters.transmission}
              onChange={(e) => onFilterChange({ transmission: e.target.value })}
              className="p-2 border rounded w-full"
            >
              <option value="">Transmisión</option>
              <option value="Manual">Manual</option>
              <option value="Automático">Automático</option>
            </select>
          )}

          {filters.sortBy ? (
            <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-full justify-between">
              <span className="truncate capitalize">
                {filters.sortBy === "priceAsc"
                  ? "Precio: menor a mayor"
                  : "Precio: mayor a menor"}
              </span>
              <button
                onClick={() => onFilterChange({ sortBy: "" })}
                className="ml-2 text-white hover:text-gray-200 font-bold"
              >
                ×
              </button>
            </div>
          ) : (
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="p-2 border rounded w-full"
            >
              <option value="">Ordenar por</option>
              <option value="priceAsc">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
            </select>
          )}

          {filters.isAvailable ? (
            <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-full justify-between">
              <span className="truncate capitalize">
                {filters.isAvailable === true 
                ? "Disponible" 
                : "No disponible"}
              </span>
              <button
                onClick={() => onFilterChange({ isAvailable: undefined  })}
                className="ml-2 text-white hover:text-gray-200 font-bold"
              >
                ×
              </button>
            </div>
          ) : (
            <select
              value={
                filters.isAvailable === true
                  ? "available"
                  : filters.isAvailable === false
                  ? "notAvailable"
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "available")
                  onFilterChange({ isAvailable: true });
                else if (value === "notAvailable")
                  onFilterChange({ isAvailable: false });
                else onFilterChange({ isAvailable: undefined }); 
              }}
              className="p-2 border rounded w-full"
            >
              <option value="">Disponibilidad</option>
              <option value="available">Disponible</option>
              <option value="notAvailable">No disponible</option>
            </select>
          )}

          {hayFiltrosActivos() && (
            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center justify-center gap-1 bg-orange-500 text-white px-2 py-2 rounded hover:bg-orange-600 transition w-16 h-full"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltrosHost;
