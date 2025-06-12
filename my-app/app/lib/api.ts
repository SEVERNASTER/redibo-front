import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  discount: number;
  rentalCount: number;
  rating: number;
  location: string;
  imageUrl: string;
  host: {
    id: number;
    email: string;
  };
  unavailableDates: string[];
  extraEquipment: string[];
  seats: number;
  transmission: string;
  color: string;
  isAvailable: boolean;
  kilometers: string; // Agregado
  licensePlate: string; // Agregado
  fuelType: string; // Agregado
  description: string; // Agregado
}

interface CarsResponse {
  cars: Car[];
  totalCars: number;
  currentPage: number;
  totalPages: number;
}

interface Filters {
  location?: string;
  startDate?: string;
  endDate?: string;
  hostId?: number;
  carType?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  search?: string;
  brand?: string;
  model?: string;
}

export const fetchCars = async (filters: Filters, token?: string): Promise<CarsResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get(`${API_URL}/cars`, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return response.data;
};

export const fetchMyCars = async (filters: Filters, token: string): Promise<CarsResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get(`${API_URL}/cars/my-cars`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const updateCarAvailability = async (carId: number, unavailableDates: string[], token: string) => {
  const response = await axios.patch(
    `${API_URL}/cars/${carId}/availability`,
    { unavailableDates },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const fetchCarById = async (id: number, token: string): Promise<Car> => {
  const response = await axios.get(`${API_URL}/cars/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCar = async (id: number, data: Partial<Car>, token: string): Promise<Car> => {
  const response = await axios.put(`${API_URL}/cars/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.car;
};

export const deleteCar = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/cars/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};