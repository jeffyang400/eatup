import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './conversation-list';
import ConversationOperations from '@/graphql/operations/conversation';
import { ConversationsData } from '@/util/types';
import { ConversationPopulated } from '../../../../../backend/src/util/types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SkeletonLoader from '@/components/common/skeleton-loader';

interface ConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({
  session,
}) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData, any>(
    ConversationOperations.Queries.conversations
  );

  const router = useRouter();
  const { conversationId } = router.query;

  const onViewConversation = async (conversationId: string) => {
    // 1. Push conversationId to router query params
    router.push({ query: { conversationId } });

    // 2. Update conversation to have seenLatestMessage = true
  };

  const subscribetoNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev: any,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribetoNewConversations();
  }, []);

  return (
    <Box
      width={{ base: '100%', md: '400px' }}
      bg={'gray.50'}
      flexDirection="column"
      gap={4}
      py={6}
      px={3}
      display={{ base: conversationId ? 'none' : 'flex', md: 'flex' }}
    >
      {/* Skeleton Loader */}
      {conversationsLoading ? (
        <SkeletonLoader count={7} height="80px" width="270px" />
      ) : (
        <ConversationList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};

export default ConversationsWrapper;
