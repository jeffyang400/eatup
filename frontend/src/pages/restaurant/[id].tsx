import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import Image from 'next/image';
import RestaurantOperations from '@/graphql/operations/restaurant';
import styles from '@/styles/restaurant.module.css';
import ReviewForm from '@/components/review/review-form';
import ReviewOperations from '@/graphql/operations/review';
import Review from '@/components/review/review';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  content: string;
  user: {
    id: string;
    name: string;
  };
}

interface Restaurant {
  name: string;
  categories: string;
  stars: number;
  city: string;
}

export default function Restaurant() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;

  const [createReview] = useMutation(ReviewOperations.Mutations.createReview, {
    update: (cache, { data }) => {
      const newReview = data.createReview;

      // Read the cache for the reviewsForRestaurant query
      const { reviewsForRestaurant } = cache.readQuery({
        query: ReviewOperations.Queries.reviewsForRestaurant,
        variables: { restaurantId: id },
      }) as { reviewsForRestaurant: Review[] };

      // Write the new review to the cache
      cache.writeQuery({
        query: ReviewOperations.Queries.reviewsForRestaurant,
        variables: { restaurantId: id },
        data: {
          reviewsForRestaurant: [newReview, ...reviewsForRestaurant],
        },
      });
    },
  });

  const submitReview = async (formData: { rating: number; text: string }) => {
    try {
      const { rating, text } = formData;
      const { data } = await createReview({
        variables: {
          restaurantId: id,
          userId: session?.user.id,
          rating,
          content: text,
        },
      });
      toast.success('Review created successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const {
    data: reviewData,
    error: reviewError,
    loading: reviewLoading,
  } = useQuery(ReviewOperations.Queries.reviewsForRestaurant, {
    variables: {
      restaurantId: id,
    },
  });

  const {
    data: restData,
    error,
    loading,
  } = useQuery(RestaurantOperations.Queries.restaurant, {
    variables: {
      id,
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const restaurant = restData.restaurant;


  return (
    <div className={styles.restaurant}>
      <div className={styles.header}>
        <div className={styles.backButton} onClick={() => router.back()}>
          &lt; Back
        </div>
        <div className={styles.title}>{restaurant.name}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.image}>
          <Image
            src={'/images/logo.png'}
            alt={`${restaurant.name} image`}
            width={300}
            height={300}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.categories}>{restaurant.categories}</div>
          <div className={styles.stars}>{restaurant.stars} ⭐️ on Yelp</div>
          <div className={styles.city}>{restaurant.city}, CA</div>
          <div className={styles.description}>{restaurant.description}</div>
        </div>
      </div>
      <ReviewForm onSubmit={submitReview} />
      <div className={styles.reviews}>
        {reviewData?.reviewsForRestaurant.map((review: Review) => (
          <Review key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
