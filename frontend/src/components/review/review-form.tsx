import { useState } from 'react';
import styles from '@/styles/review-form.module.css';
import { useMutation } from '@apollo/client';
import ReviewOperations from '@/graphql/operations/review';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface ReviewFormProps {
  onSubmit: (formData: { rating: number; text: string }) => void;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    onSubmit({ rating, text });

    setRating(0);
    setText('');
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(Number(event.target.value));
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div className={styles.reviewFormContainer}>
      <h2 className={styles.reviewFormTitle}>Write a review</h2>
      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <div className={styles.reviewFormField}>
          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            value={rating || ''}
            onChange={handleRatingChange}
            required
          />
        </div>
        <div className={styles.reviewFormField}>
          <label htmlFor="comment">Your review:</label>
          <textarea
            id="comment"
            name="comment"
            value={text}
            onChange={handleTextChange}
            required
          />
        </div>
        <button className={styles.reviewFormButton} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
