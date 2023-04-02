import { systemProps } from '@chakra-ui/react';
import React from 'react';
import styles from '../../styles/restaurants-card.module.css';

interface Restaurant {
  name: string;
  categories: string;
  stars: number;
  city: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  if (!restaurant) {
    return null;
  }

  return (
    <div className={styles['restaurant-card']}>
      <div className={styles['restaurant-info']}>
        <h3 className={styles['restaurant-name']}>{restaurant.name}</h3>
        <p className={styles['restaurant-categories']}>
          {restaurant.categories}
        </p>
        <p className={styles['restaurant-stars']}>{restaurant.stars}⭐️</p>
        <p className={styles['restaurant-city']}>{restaurant.city}, CA</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
