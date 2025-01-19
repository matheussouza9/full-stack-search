import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CountryResponse, HotelDetails } from '../../types';

import HotelCard from '../Hotel/components/hotelCard';

import { fetchCountryData } from '../../api';

function CountryPage() {
  const { id } = useParams();
  const [countryResponse, setCountryResponse] = useState<CountryResponse>();
  const [hotels, setHotels] = useState<HotelDetails[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchCountryData(id)
      .then((countryResponse) => setCountryResponse(countryResponse))
      .catch((error) => console.error(error));
  }, [id]);

  useEffect(() => {
    if (!countryResponse) return;
    setHotels(countryResponse.hotels);
  }, [countryResponse]);

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center">
          <div className="col">
            {!!countryResponse && (
              <div>
                <h1>Hotels in {countryResponse.name}</h1>
                { hotels.length ? (
                  <div className="container">
                    <div className="row row-cols-1 gy-4">
                      {hotels.map((hotel) => (
                        <HotelCard key={hotel._id} hotel={hotel} />
                      ))}
                    </div>
                  </div>
                ) : <p>No hotels found</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryPage;
