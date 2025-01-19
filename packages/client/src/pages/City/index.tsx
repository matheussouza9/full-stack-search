import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CityResponse, HotelDetails } from '../../types';

import HotelCard from '../Hotel/components/hotelCard';

import { fetchCityData } from '../../api';

function CityPage() {
  const { id } = useParams();
  const [cityResponse, setCityResponse] = useState<CityResponse>();
  const [hotels, setHotels] = useState<HotelDetails[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchCityData(id)
      .then((cityResponse) => setCityResponse(cityResponse))
      .catch((error) => console.error(error));
  }, [id]);

  useEffect(() => {
    if (!cityResponse) return;
    setHotels(cityResponse.hotels);
  }, [cityResponse]);

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center">
          <div className="col">
            {!!cityResponse && (
              <div>
                <h1>Hotels in {cityResponse.name}</h1>
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

export default CityPage;
