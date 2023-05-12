import React from "react";
import styles from '@/styles/review-form.module.css';

function Review({ review }: { review: any }) {
  const { content, rating, createdAt, user } = review;


  

  return (
    <div className={styles.review}>
      <h3>{user.name}</h3>
      <p>{content}</p>
      <p>{rating} ⭐️</p>
      <p>{new Date(createdAt).toLocaleDateString()}</p>
    </div>
  );
}

export default Review;
