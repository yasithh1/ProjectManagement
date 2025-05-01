import React from 'react';
import '../style/ViewReviews.css';

const reviews = [
  { id: 1, reviewer: 'John Doe', rating: 5, comment: 'Great product!' },
  { id: 2, reviewer: 'Jane Smith', rating: 4, comment: 'Very useful.' },
  // Add more sample reviews as needed
];

const ViewReviews = () => {
  return (
    <div className="view-reviews-container">
      <h2>View Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="review">
          <h3>{review.reviewer}</h3>
          <p>Rating: {review.rating}</p>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewReviews;
