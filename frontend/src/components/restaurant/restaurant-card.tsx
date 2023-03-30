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
  restaurants: Restaurant[];
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurants }) => {
  if (!restaurants) {
    return null;
  }
  console.log(restaurants[0]);
  return (
    <div className={styles['restaurant-card-container']}>
      {restaurants.map((restaurant, index) => (
        <div className={styles['restaurant-card']} key={index}>
          <div className={styles['restaurant-info']}>
            <h3 className={styles['restaurant-name']}>{restaurant.name}</h3>
            <p className={styles['restaurant-categories']}>{restaurant.categories}</p>
            <p className={styles['restaurant-stars']}>{restaurant.stars}⭐️</p>
            <p className={styles['restaurant-city']}>{restaurant.city}, CA</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantCard;

