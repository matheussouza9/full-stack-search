function StarRating(props: { rating: number }) {
  return (
    <span className="star-rating">
      {Array.from({ length: props.rating }, (_, index) => (
          <span key={index} className="star">&#9733;</span>
      ))}
    </span>
  );
}

export default StarRating;