import { Box, Flex, Text } from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import Chat from '../components/chat';
import Auth from '../components/auth';
import { Session } from 'next-auth';
import RestaurantOperations from '@/graphql/operations/restaurant';
import { useQuery } from '@apollo/client';

export default function Home() {
  const { data: session } = useSession();

  const { data, error, loading } = useQuery(
    RestaurantOperations.Queries.restaurants
  );

  console.log('restaurant data', data);

  const reloadSession = async () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  return (
    <Flex justify="center" py={20}>
      <Text fontWeight={600} fontSize="3em">
        Welcome to Eatup
      </Text>
      <div>
        {data?.restaurants.map((r: any, idx: any) => (
          <div key={idx}>{r.name}</div>
        ))}
      </div>
    </Flex>
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
