import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { HotelDetails } from '../../types';

import HotelCard from './components/hotelCard';

import { fetchHotelData } from '../../api';

function HotelPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<HotelDetails>();

  useEffect(() => {
    if (!id) return;
    fetchHotelData(id).then((hotel) => setHotel(hotel)).catch((error) => console.error(error));
  }, [id]);

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center">
          <div className="col-md-9 py-4">
            {!!hotel && (
              <HotelCard hotel={hotel} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelPage;
