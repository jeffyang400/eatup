import { Button, Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import RestaurantRecommendations from '../restaurant/restaurant-recommendations';
import ConversationsWrapper from './conversations/conversations-wrapper';
import FeedWrapper from './feed/feed-wrapper';

interface ChatProps {
  session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  return (
    <Flex height="95vh">
      <ConversationsWrapper session={session}/>
      <FeedWrapper session={session}/>
    </Flex>
  );
};

export default Chat;
