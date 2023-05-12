// @ts-nocheck
import { Box, Flex, Text } from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import Chat from '../components/chat';
import Auth from '../components/auth';
import { Session } from 'next-auth';
import RestaurantOperations from '@/graphql/operations/restaurant';
import { useQuery } from '@apollo/client';
import cardStyles from '../styles/restaurants-card.module.css';
import RestaurantCard from '@/components/restaurant/restaurant-card';
import Link from 'next/link';
import styles from '@/styles/homepage.module.css';

interface Restaurant {
  name: string;
  categories: string;
  stars: number;
  city: string;
}

export default function Home() {
  const { data: session } = useSession();

  const { data, error, loading } = useQuery(
    RestaurantOperations.Queries.restaurants
  );


  const reloadSession = async () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  return (
    <div className={styles.homeContainer}>
      <h1>Restaurants</h1>
      <div className={`${cardStyles.restaurantCardContainer}  ${styles.homeRestaurantCards}`}>
        {data?.restaurants.map((restaurant: Restaurant, idx: number) => (
          <Link key={idx} href={`/restaurant/${restaurant.id}`}>
              <RestaurantCard restaurant={restaurant} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
