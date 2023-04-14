import { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { Box, Text } from '@chakra-ui/react';
import RestaurantOperations from '@/graphql/operations/restaurant';
import { Session } from 'next-auth';
import styles from '@/styles/restaurants-card.module.css';
import RestaurantCard from './restaurant-card';
import Link from 'next/link';
// import { Restaurant } from '@/util/types';

interface RestaurantRecommendationsProps {
  conversationId: string;
}

const RestaurantRecommendations: React.FC<RestaurantRecommendationsProps> = ({
  conversationId,
}) => {
  const { data, loading, error } = useSubscription(
    RestaurantOperations.Subscriptions.restaurantsRecommended,
    { variables: { conversationId } }
  );

  return (
    <div className={styles['restaurant-recommendation-container']}>
      <h1>Recommendations</h1>
      {loading ? (
        <div>Recommendations will appear here</div>
      ) : error ? (
        <div>
          Error: {error.message} CONVID: {conversationId}
        </div>
      ) : (
        data?.restaurantsRecommended.map(
          (restaurantRecommended: any, idx: number) => (
            <Link key={idx} href={`/restaurant/${restaurantRecommended.id}`} passHref>
              <RestaurantCard key={idx} restaurant={restaurantRecommended} />
            </Link>
          )
        )
      )}
    </div>
  );
};

export default RestaurantRecommendations;
