import RestaurantRecommendations from '@/components/restaurant/restaurant-recommendations';
import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import MessagesHeader from './messages/header';
import MessageInput from './messages/input';
import Messages from './messages/messages';
import styles from '@/styles/feed.module.css';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();

  const { conversationId } = router.query;
  const {
    user: { id: userId },
  } = session;

  return (
    <div className={styles.feedContainer}>
      <Flex
        display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
        width="50vw"
        direction="column"
      >
        {conversationId && typeof conversationId === 'string' ? (
          <>
            <Flex
              direction="column"
              justify="space-between"
              overflow="hidden"
              flexGrow={1}
            >
              <MessagesHeader userId={userId} conversationId={conversationId} />
              <Messages userId={userId} conversationId={conversationId} />
            </Flex>
            <MessageInput session={session} conversationId={conversationId} />
          </>
        ) : (
          <div>No Chat Selected</div>
        )}
      </Flex>
      {conversationId && typeof conversationId === 'string' && (
        <RestaurantRecommendations key={conversationId} conversationId={conversationId} />
      )}
    </div>
  );
};

export default FeedWrapper;
