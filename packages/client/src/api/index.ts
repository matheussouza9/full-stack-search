import { getCodeSandboxHost } from '@codesandbox/utils';
import {
  AccommodationsResponse,
  City,
  CityResponse,
  Country,
  CountryResponse,
  Hotel,
  HotelDetails,
} from '../types';

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
  ? `https://${codeSandboxHost}`
  : 'http://localhost:3001';

// TODO Improve error handling for all fetch requests

export const fetchAccomodationsData = async (
  searchTerm: string,
  fetchProps?: RequestInit,
) => {
  try {
    const response = await fetch(
      `${API_URL}/search?term=${searchTerm}`,
      fetchProps,
    );
    if (response.ok) {
      const accomodationResponse =
        (await response.json()) as AccommodationsResponse;
      return Promise.resolve(accomodationResponse);
    } else {
      if (response.status === 404) throw new Error('404, Not found');
      if (response.status === 500)
        throw new Error('500, internal server error');
      throw new Error(response.status.toString());
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchHotelData = async (id: Hotel['_id']) => {
  try {
    const response = await fetch(`${API_URL}/hotels/${id}`);
    if (response.ok) {
      const hotelResponse = (await response.json()) as HotelDetails;
      return Promise.resolve(hotelResponse);
    } else {
      if (response.status === 404) throw new Error('404, Not found');
      if (response.status === 500)
        throw new Error('500, internal server error');
      throw new Error(response.status.toString());
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchCountryData = async (id: Country['_id']) => {
  try {
    const response = await fetch(`${API_URL}/countries/${id}`);
    if (response.ok) {
      const countryResponse = (await response.json()) as CountryResponse;
      return Promise.resolve(countryResponse);
    } else {
      if (response.status === 404) throw new Error('404, Not found');
      if (response.status === 500)
        throw new Error('500, internal server error');
      throw new Error(response.status.toString());
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchCityData = async (id: City['_id']) => {
  try {
    const response = await fetch(`${API_URL}/cities/${id}`);
    if (response.ok) {
      const cityResponse = (await response.json()) as CityResponse;
      return Promise.resolve(cityResponse);
    } else {
      if (response.status === 404) throw new Error('404, Not found');
      if (response.status === 500)
        throw new Error('500, internal server error');
      throw new Error(response.status.toString());
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
