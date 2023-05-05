import { useState, useEffect } from 'react';
import { useQuery, useSubscription, useMutation, gql } from '@apollo/client';
import { Box, Button, Text } from '@chakra-ui/react';
import RestaurantOperations from '@/graphql/operations/restaurant';
import ConversationOperations from '@/graphql/operations/conversation';
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
  const [curDate, setCurDate] = useState<Date | null>(null);

  const { data, loading, error } = useSubscription(
    RestaurantOperations.Subscriptions.restaurantsRecommended,
    { variables: { conversationId } }
  );

  const [resetConversationRecommendations] = useMutation(
    ConversationOperations.Mutations.resetConversationRecommendations
  );

  const { data: recommendationStartDateData } = useQuery(
    gql`
      query GetConversation($conversationId: String!) {
        conversation(conversationId: $conversationId) {
          recommendationStartDate
        }
      }
    `,
    { variables: { conversationId } }
  );

  const recStartDate =
    recommendationStartDateData?.conversation.recommendationStartDate;

    function formatDate(dateStr: string) {
      if (!dateStr) {
        return null;
      }
    
      const date: any = new Date(dateStr);
      const now: any = new Date();
      const diffInMs = now - date;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
      if (diffInDays >= 1) {
        return date.toLocaleDateString('en-US');
      }
    
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    }
    
    const formattedDate = formatDate(curDate?.toISOString() || '') || formatDate(recStartDate);
  return (
    <div className={styles['restaurant-recommendation-container']}>
      <div className="main">
        <div className="header" style={{ marginBottom: '10px' }}>
          <h1>Recommendations</h1>
          {recStartDate && <h2 style={{ fontSize: 'large' }}>Since {formattedDate}</h2>}
        </div>

        {loading ? (
          <div>Recommendations will appear here</div>
        ) : error ? (
          <div>
            Error: {error.message} CONVID: {conversationId}
          </div>
        ) : (
          data?.restaurantsRecommended.map(
            (restaurantRecommended: any, idx: number) => (
              <Link
                key={idx}
                href={`/restaurant/${restaurantRecommended.id}`}
                passHref
              >
                <RestaurantCard key={idx} restaurant={restaurantRecommended} />
              </Link>
            )
          )
        )}
      </div>
      <div style={{ position: 'relative', height: '1000px', width: '100%' }}>
        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          <Button
            style={{ boxShadow: '0 5px 5px rgba(0,0,0,0.2)' }}
            onClick={() => {
              resetConversationRecommendations({
                variables: { conversationId },
              });
              setCurDate(new Date());
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRecommendations;
