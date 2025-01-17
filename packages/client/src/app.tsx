import { useEffect, useState } from 'react';
import { getCodeSandboxHost } from "@codesandbox/utils";

type Hotel = { _id: string, chain_name: string; hotel_name: string; city: string, country: string };
type City = { _id: string; name: string };
type Country = { _id: string; name: string };

type AccommodationResult = {
  hotels: Hotel[];
  cities: City[];
  countries: Country[];
}

const codeSandboxHost = getCodeSandboxHost(3001)
const API_URL = codeSandboxHost ? `https://${codeSandboxHost}` : 'http://localhost:3001'

const fetchAccomodationsData = async (value: string) => {
  const data = await fetch(`${API_URL}/search?term=${value}`);
  const accomodationResult = (await data.json()) as AccommodationResult;
  return accomodationResult;
}

function App() {
  const [search, setSearch] = useState('');
  const [showClearBtn, setShowClearBtn] = useState(false);

  const [loadingData, setLoadingData] = useState(false);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  const fetchData = async (term: string) => {
    if (term.length < 3) {
      setHotels([]);
      setCities([]);
      setCountries([]);
      setShowClearBtn(false);
      return;
    }

    try {
      setLoadingData(true);
      const accomodationData = await fetchAccomodationsData(term);
      setShowClearBtn(true);
      setHotels(accomodationData.hotels);
      setCities(accomodationData.cities);
      setCountries(accomodationData.countries);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData(search);
  }, [search]);

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="dropdown">
              <div className="form">
                <i className={`fa input-prefix-icon ${loadingData ? 'fa-spinner fa-spin' : 'fa-search'}`}></i>
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Search accommodation..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {showClearBtn && (
                  <span className="left-pan pe-auto" onClick={() => setSearch('')}>
                    <i className="fa fa-close"></i>
                  </span>
                )}
              </div>
              {showClearBtn && (
                <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                  <h2>Hotels</h2>
                  {hotels.length ? hotels.map((hotel, index) => (
                    <li key={index}>
                      <a href={`/hotels/${hotel._id}`} className="dropdown-item">
                        <i className="fa fa-building mr-2"></i>
                        {hotel.hotel_name}
                      </a>
                      <hr className="divider" />
                    </li>
                  )) : <p>No hotels matched</p>}

                  <h2>Countries</h2>
                  {countries.length ? countries.map((country, index) => (
                    <li key={index}>
                      <a href={`/country/${country._id}`} className="dropdown-item">
                        <i className="fa fa-flag mr-2"></i>
                        {country.name}
                      </a>
                      <hr className="divider" />
                    </li>
                  )) : <p>No countries matched</p>}

                  <h2>Cities</h2>
                  {cities.length ? cities.map((city, index) => (
                    <li key={index}>
                      <a href={`/city/${city._id}`} className="dropdown-item">
                        <i className="fa fa-map-marker mr-2"></i>
                        {city.name}
                      </a>
                      <hr className="divider" />
                    </li>
                  )) : <p>No cities matched</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
