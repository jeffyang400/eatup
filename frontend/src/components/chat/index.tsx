import { Button, Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import ConversationsWrapper from './conversations/conversations-wrapper';
import FeedWrapper from './feed/feed-wrapper';

interface ChatProps {
  session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  return (
    <Flex height="100vh">
      <ConversationsWrapper session={session}/>
      <FeedWrapper session={session}/>
      {/* <Button
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </Button> */}
    </Flex>
  );
};

export default Chat;