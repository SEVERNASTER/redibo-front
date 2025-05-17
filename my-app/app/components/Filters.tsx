"use client";

import { useState, useEffect } from "react";
import Panel from "./Panel";
import { hostname } from "os";

interface FiltersProps {
  filters: {
    location?: string;
    startDate?: string;
    rating: number;
    endDate?: string;
    hostId?: string;
    carType?: string;
    transmission?: string;
    consumo?: string;
    fuelType?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    search?: string;

    // extras
    capacidad?: string;
    color?: string;
    kilometrajes?: string;
  };
  onFilterChange: (filters: FiltersProps["filters"]) => void;
}


export default function Filters({ filters, onFilterChange }: FiltersProps) {
  // === ESTADOS: VISIBILIDAD DE OPCIONES DE FILTROS ===
  const [showFuelTypeOptions, setShowFuelTypeOptions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showHostOptions, setShowHostOptions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTransmissionOptions, setShowTransmissionOptions] = useState(false);
  const [showCarTypeOptions, setShowCarTypeOptions] = useState(false);
  const [showRatingOptions, setShowRatingOptions] = useState(false);
  const [showPriceOptions, setShowPriceOptions] = useState(false);

  // === ESTADOS: INTERACCIÓN Y ANIMACIONES ===
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // === ESTADOS: VALORES DE FILTRO ===
  const [priceRange, setPriceRange] = useState<[number, number]>([15, 100]);

  // activar un solo filtro a la vez
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // === ESTADOS: HOSTS (filtro por nombre) ===
  const [hostSearch, setHostSearch] = useState("");
  const [hostResults, setHostResults] = useState<{ id: string; name: string; location?: string }[]>([]);
  const [selectedHost, setSelectedHost] = useState<{ id: string; name: string; location?: string } | null>(null);

  // === ESTADOS: BUSCADOR GENERAL ===
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // === EFECTOS: Acciones al presionar teclas ===
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSuggestions(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // === GESTION DE FILTROS GENERALES ===
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleFuelTypeChange = (fuelType: string) => {
    onFilterChange({ ...filters, fuelType });
    setShowFuelTypeOptions(false);
  };

  const handleTransmissionChange = (transmission: string) => {
    onFilterChange({ ...filters, transmission });
    setShowTransmissionOptions(false);
  };

  const handleCarTypeChange = (carType: string) => {
    onFilterChange({ ...filters, carType });
    setShowCarTypeOptions(false);
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, rating });
    setShowRatingOptions(false);
  };

  const handleHostChange = (hostId: string) => {
    onFilterChange({ ...filters, hostId });
    setShowHostOptions(false);
    setHostSearch("");
  };


  // utils/api.ts o dentro de un useEffect en tu componente
  async function getCarsByHost(hostId: number, token: string) {
    const res = await fetch(`/api/cars/host/${hostId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error al obtener autos');
    }

    const data = await res.json();
    return data.cars; // Lista de autos del host
  }


  const handleResetFilters = () => {
    onFilterChange({
      location: "",
      startDate: "",
      endDate: "",
      hostId: undefined,
      carType: "",
      transmission: "",
      consumo: "",
      fuelType: "",
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "relevance",
      rating: 0,
      capacidad: undefined,
      color: undefined,
      kilometrajes: undefined,
    });
    setShowFuelTypeOptions(false);
    setShowTransmissionOptions(false);
    setShowCarTypeOptions(false);
    setShowRatingOptions(false);
    setShowAdvancedFilters(false);
  };

  // === GESTION DE FILTROS DE BUSQUEDA ===
  const hayFiltrosActivos = () => {
    return (
      filters.location ||
      filters.startDate ||
      filters.endDate ||
      filters.hostId ||
      filters.carType ||
      filters.transmission ||
      filters.consumo ||
      filters.fuelType ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      (filters.sortBy && filters.sortBy !== "relevance") ||
      filters.rating > 0 ||
      filters.capacidad ||
      filters.color ||
      filters.kilometrajes
    );
  };

  const hayFiltrosDelPanel = () => {
    return (
      filters.carType ||
      filters.transmission ||
      filters.fuelType ||
      filters.rating > 0 ||
      filters.capacidad ||
      filters.color ||
      filters.kilometrajes
    );
  };

  // === GESTION DE FILTROS DE HOSTS ==
  useEffect(() => {
    const cleanQuery = hostSearch
      .trim()
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");

    if (!cleanQuery) {
      setHostResults([]);
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const fetchHosts = async () => {
      try {
        const response = await fetch(`${API_URL}/hosts?search=${encodeURIComponent(cleanQuery)}`);
        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }
        const data = await response.json();
        console.log('RESULTADO DEL BACKEND:', data);
        setHostResults(data.slice(0, 4));

      } catch (error) {
        console.error("Error al buscar hosts:", error);
        setHostResults([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchHosts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [hostSearch]);


  // === GESTION DE FILTROS DE AUTOS DE BUSQUEDA ===
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/['";\\/*<>&|^$~@!{}[\]()=+]/g, "");
    setSearchInput(sanitizedValue);
    

    const saved = localStorage.getItem("searchHistory");
    const previousSearches = saved ? (JSON.parse(saved) as string[]) : [];

    const normalized = sanitizedValue.trim().toLowerCase();

    const matched = previousSearches.filter((item) =>
      item.toLowerCase().includes(normalized)
    );

    if (
      sanitizedValue &&
      !previousSearches.map((v) => v.toLowerCase()).includes(normalized)
    ) {
      matched.unshift(sanitizedValue);
    }

    setSuggestions(matched);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (value: string) => {
    onFilterChange({ ...filters, search: value });
    setShowSuggestions(false);

    const saved = localStorage.getItem("searchHistory");
    const previousSearches = saved ? (JSON.parse(saved) as string[]) : [];

    const updatedSearches = [
      value,
      ...previousSearches.filter((v) => v !== value),
    ];

    localStorage.setItem(
      "searchHistory",
      JSON.stringify(updatedSearches.slice(0, 10))
    );
  };



  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      {/* FILA SUPERIOR: Ubicación, De, Hasta */}
      <div className="flex items-center justify-between bg-white rounded-full px-6 py-3 shadow-md w-full max-w-4xl">
        {/* Ubicación */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-black-500">
            Ubicación
          </span>
          <select
            name="location"
            value={filters.location || ""}
            onChange={handleChange}
            className="flex-1 bg-transparent border-none focus:outline-none text-xs font-medium text-gray-500"
          >
            <option value="">Ubicación</option>
            <option value="Santa Cruz">Santa Cruz</option>
            <option value="Cochabamba">Cochabamba</option>
            <option value="La Paz">La Paz</option>
            {/*<option value="Santa Cruz">Tarija</option>
            <option value="Cochabamba">Sucre</option>
            <option value="La Paz">Oruro</option>
            <option value="Santa Cruz">Pando</option>
            <option value="Cochabamba">Beni</option>
            <option value="La Paz">Potosi</option>*/}
          </select>
        </div>

        {/* Fecha Inicio */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-black-500">De</span>
          <input
            type="date"
            name="startDate"
            value={filters.startDate || ""}
            onChange={handleChange}
            className="flex-1 bg-transparent border-none focus:outline-none text-xs font-medium text-gray-500"
          />
        </div>

        {/* Fecha Fin */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-black-500">Hasta</span>
          <input
            type="date"
            name="endDate"
            value={filters.endDate || ""}
            onChange={handleChange}
            className="flex-1 bg-transparent border-none focus:outline-none text-xs font-medium text-gray-500"
          />
        </div>

        {/* Botón lupa */}
        <button type="button" className="text-orange-500 hover:text-orange-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="relative w-full max-w-4xl mt-4">
        <div className="flex rounded overflow-hidden border border-gray-300">
          {/* Botón de búsqueda */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, search: searchInput.trim() })}
            className="bg-[#FBE7C2] px-6 py-2 font-semibold text-xs text-gray-700"
          >
            Buscar
          </button>

          <div className="relative w-full">
            <input
              type="text"
              name="search"
              placeholder="Buscar"
              value={searchInput}
              onChange={handleSearchInput}
              onKeyDown={(e) => {
                 if (e.key === "Enter") {
                    onFilterChange({ ...filters, search: searchInput.trim() });
                    setShowSuggestions(false); // Ocultar sugerencias al buscar
                 }
              }}
              className="w-full px-4 py-2 bg-[#F9F1E7] text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
              maxLength={50}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[0.75rem] text-orange-500">

            </span>


            {/* Botón "X" para borrar el texto */}
            {filters.search && (

              <button
                type="button"
                onClick={() => {
                  // Limpiar búsqueda y ocultar sugerencias
                  onFilterChange({ ...filters, search: "" });
                  setShowSuggestions(false);
                }}
                className="absolute right-0.5 top-1/2 -translate-y-1/2 bg-[#FBE7C2] px-6 py-2 text-gray-900 hover:bg-[#FBE7C2] cursor-pointer rounded-md"
                style={{ padding: '11px 20px' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border mt-1 z-50 shadow-lg max-h-60 overflow-y-auto rounded-md">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(item)}
                onMouseEnter={() => setHoveredIndex(index)}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-orange-100 ${index === hoveredIndex ? "bg-orange-100" : ""
                  }`}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* FILTROS EN FILA */}

      <div className="flex flex-col items-center gap-4 mb-6">

        <div className="overflow-x-auto w-full max-h-20">
          <div className="flex space-x-4 px-6 py-4 bg-white rounded-lg shadow-md">
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center border p-2 rounded px-3 py-1 w-10 justify-between transition ${hayFiltrosDelPanel() ? 'bg-orange-500 text-white' : 'bg-white'
                  }`}
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black scale-150"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 6a1 1 0 0 1 1-1h3a2 2 0 0 1 4 0h10a1 1 0 1 1 0 2H11a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1zM3 12a1 1 0 0 1 1-1h9a2 2 0 0 1 4 0h4a1 1 0 1 1 0 2h-4a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1zM3 18a1 1 0 0 1 1-1h5a2 2 0 0 1 4 0h7a1 1 0 1 1 0 2h-7a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1z" />
                </svg>
              </button>
            </div>

            {/* Panel flotante sobre los autos */}
            <Panel
              visible={showAdvancedFilters}
              onClose={() => setShowAdvancedFilters(false)}
              filters={filters}
              onFilterChange={onFilterChange}
            />


            {/* PRECIO */}
            {filters.minPrice !== undefined || filters.maxPrice !== undefined ? (
              <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-60 justify-between">
                <span className="truncate">
                  ${filters.minPrice} - ${filters.maxPrice} /día
                </span>
                <button
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      minPrice: undefined,
                      maxPrice: undefined,
                    })
                  }
                  className="ml-2 text-white hover:text-gray-200 font-bold"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-40">
                <button
                  type="button"
                  onClick={() => setActiveFilter(activeFilter === 'price' ? null : 'price')}
                  className="border p-2 rounded flex items-center justify-between w-full"
                >
                  Precio
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {activeFilter === 'price' && (
                  <div className="absolute mt-2 bg-white border rounded p-4 shadow-lg z-10 w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ${priceRange[0]} - ${priceRange[1]} /por día
                    </label>
                    <input
                      type="range"
                      min={15}
                      max={100}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([+e.target.value, priceRange[1]])
                      }
                      className="w-full mb-2"
                    />
                    <input
                      type="range"
                      min={15}
                      max={100}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], +e.target.value])
                      }
                      className="w-full"
                    />
                    <button
                      onClick={() => {
                        onFilterChange({
                          ...filters,
                          minPrice: priceRange[0],
                          maxPrice: priceRange[1],
                        });
                        setShowPriceOptions(false);
                      }}
                      className="mt-2 w-full bg-orange-500 text-white py-1 rounded hover:bg-orange-600 text-sm"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CALIFICACIÓN 
            {filters.rating > 0 ? (
              <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-40 justify-between">
                <div className="flex gap-1">
                  {[...Array(filters.rating)].map((_, idx) => (
                    <span key={idx} className="text-white text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onFilterChange({ ...filters, rating: 0 })}
                  className="ml-2 text-white hover:text-gray-200 font-bold"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-40 ">
                <button
                  type="button"
                  onClick={() => setShowRatingOptions(!showRatingOptions)}
                  className="border p-2 rounded flex items-center justify-between w-full"
                >
                  Calificación
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showRatingOptions && (
                  <div className="absolute mt-1 bg-white border rounded p-5 shadow-lg z-9 w-auto">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => {
                            handleRatingChange(star);
                            setShowRatingOptions(false);
                          }}
                          className="focus:outline-none"
                        >
                          <span
                            className={`text-2xl ${(hoverRating ?? filters.rating) >= star
                              ? "text-orange-500"
                              : "text-gray-300"
                              }`}
                          >
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            */}

            {/* HOST */}

            {filters.hostId ? (
              <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-60 justify-between flex-shrink-0">
                <span className="truncate">
                  {selectedHost?.name || "Host"}
                </span>
                <button
                  onClick={() => onFilterChange({ ...filters, hostId: "" })}
                  className="ml-2 text-white hover:text-gray-200 font-bold"
                >
                  ×
                </button>
              </div>
            ) : (

              <div className="w-40 flex-shrink-0">

                <button
                  type="button"
                  onClick={() => setActiveFilter(activeFilter === 'showHostOptions' ? null : 'showHostOptions')}
                  className="border p-2 rounded flex items-center justify-between w-full"
                >
                  {filters.hostId ? "Host" : "Host"}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>

                </button>

                {activeFilter === 'showHostOptions' && (
                  <div className="absolute mt-2 bg-white border rounded p-2 shadow-lg z-30 w-auto">
                    <span className="truncate">
                      <h1 className="text-sm font-bold text-beige-300">Host</h1>
                    </span>

                    <input
                      type="text"
                      value={hostSearch}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                        setHostSearch(value);
                      }}
                      placeholder="Buscar host..."
                      className="w-full p-2 mb-2 border rounded"
                      maxLength={50}
                    />

                    <div className="max-h-40 overflow-y-auto">
                      {hostSearch.trim() === "" ? null : (
                        <>
                          {hostResults.filter(h => h.name?.toLowerCase().startsWith(hostSearch.toLowerCase())).length > 0 ? (
                            <>
                              <p className="px-2 text-sm text-gray-500 mb-1">Sugerencias</p>
                              {hostResults
                                .filter(h => h.name?.toLowerCase().startsWith(hostSearch.toLowerCase()))
                                .map((host) => (
                                  <div
                                    key={host.id}
                                    onClick={() => {
                                      handleHostChange(host.id);
                                      setShowHostOptions(false);
                                    }}
                                    className="p-2 hover:bg-gray-100 cursor-pointer rounded flex justify-between items-center"
                                  >
                                    <span className="truncate">{host.name}</span>
                                    {host.location && (
                                      <span className="ml-4 text-sm text-gray-600 flex items-center gap-1">
                                        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                        </svg>
                                        {host.location}
                                      </span>
                                    )}
                                  </div>
                                ))}
                            </>
                          ) : (
                            <div className="p-2 text-gray-400">Host no encontrado</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TIPO DE AUTO */}
            {filters.carType ? (
              <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-40 justify-between">
                <span className="truncate capitalize">{filters.carType}</span>
                <button
                  onClick={() => onFilterChange({ ...filters, carType: "" })}
                  className="ml-2 text-white hover:text-gray-200 font-bold"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-40">
                <button
                  type="button"
                  onClick={() => setActiveFilter(activeFilter === 'showCarTypeOptions' ? null : 'showCarTypeOptions')}
                  className="border p-2 rounded flex items-center justify-between w-full"
                >
                  {filters.carType || "Tipo de Auto"}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeFilter === 'showCarTypeOptions' && (
                  <div className="absolute bg-white border rounded mt-2 p-2 shadow-lg z-10">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.carType === "Sedan"}
                        onChange={() => handleCarTypeChange("Sedan")}
                      />
                      Sedán
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.carType === "Camioneta"}
                        onChange={() => handleCarTypeChange("Camioneta")}
                      />
                      Camioneta
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.carType === "SUV"}
                        onChange={() => handleCarTypeChange("SUV")}
                      />
                      SUV
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.carType === "Deportivo"}
                        onChange={() => handleCarTypeChange("Deportivo")}
                      />
                      Deportivo
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.carType === "Eléctrico"}
                        onChange={() => handleCarTypeChange("Eléctrico")}
                      />
                      Eléctrico
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* TRANSMISIÓN */}
            {filters.transmission ? (
              <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-40 justify-between">
                <span className="truncate cpitalize">{filters.transmission}</span>
                <button
                  onClick={() => onFilterChange({ ...filters, transmission: "" })}
                  className="ml-2 text-white hover:text-gray-200 font-bold"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-40">
                <button
                  type="button"
                  onClick={() => setActiveFilter(activeFilter === 'showTransmissionOptions' ? null : 'showTransmissionOptions') }
                  className="border p-2 rounded flex items-center justify-between w-full"
                >
                  {filters.transmission || "Transmisión"}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeFilter==='showTransmissionOptions' && (
                  <div className="absolute bg-white border rounded mt-2 p-2 shadow-lg z-10">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.transmission === "Manual"}
                        onChange={() => handleTransmissionChange("Manual")}
                      />
                      Manual
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.transmission === "Automático"}
                        onChange={() => handleTransmissionChange("Automático")}
                      />
                      Automático
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* CONSUMO */}
            {filters.fuelType ? (
              <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-40 justify-between">
                <span className="truncate capitalize">{filters.fuelType}</span>
                <button
                  onClick={() => onFilterChange({ ...filters, fuelType: "" })}
                  className="ml-2 text-white hover:text-gray-200 font-bold"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-40">
                <button
                  type="button"
                  onClick={() => setActiveFilter(activeFilter === 'showFuelTypeOptions' ? null : 'showFuelTypeOptions')}
                  className="border p-2 rounded flex items-center justify-between w-full"
                >
                  {filters.fuelType || "Consumo"}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFilter === 'showFuelTypeOptions' && (
                  <div className="absolute mt-2 bg-white border rounded p-1 shadow-lg z-10 w-auto max-w-max">

                    <label
                      className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
                      onClick={() => handleFuelTypeChange("Gas")}
                    >
                      <span
                        className={`w-4 h-4 rounded-sm border ${filters.fuelType === "Gas" ? "bg-orange-500 border-orange-500" : "bg-white border-gray-400"
                          }`}
                      />
                      <span className="ml-2">Gas</span>
                    </label>

                    {/* Opción Gasolina */}
                    <label
                      className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
                      onClick={() => handleFuelTypeChange("Gasolina")}
                    >
                      <span
                        className={`w-4 h-4 rounded-sm border ${filters.fuelType === "Gasolina" ? "bg-orange-500 border-orange-500" : "bg-white border-gray-400"
                          }`}
                      />
                      <span className="ml-2">Gasolina</span>
                    </label>

                  </div>
                )}
              </div>
            )}

            {/* Botón solo si hay filtros activos */}
            {hayFiltrosActivos() && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z"
                  />
                </svg>
              </button>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}