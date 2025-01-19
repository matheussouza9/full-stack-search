import { HotelDetails } from "../../../types";
import StarRating from "./starRating";

function HotelCard(props: { hotel: HotelDetails }) {
  const hotel = props.hotel;

  return (
  <div className="card">
    <div className="card-header">
      <h2>{hotel.hotel_name}</h2>
    </div>
    <div className="card-body">
      <h5 className="card-title">
        Address: { [hotel.addressline1, hotel.city, hotel.state, hotel.country].join(', ') }
      </h5>
      <div className="card-text">
        Stars: <StarRating rating={Number(hotel.star_rating)}/>
      </div>
    </div>
  </div>
  )
}

export default HotelCard;