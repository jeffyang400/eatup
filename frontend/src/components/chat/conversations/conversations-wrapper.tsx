import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './conversation-list';
import ConversationOperations from '@/graphql/operations/conversation';
import { ConversationsData, ConversationUpdatedData } from '@/util/types';
import {
  ConversationPopulated,
  ParticipantPopulated,
} from '../../../../../backend/src/util/types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SkeletonLoader from '@/components/common/skeleton-loader';

interface ConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({
  session,
}) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const {
    user: { id: userId },
  } = session;

  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData, any>(
    ConversationOperations.Queries.conversations
  );

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  useSubscription<ConversationUpdatedData, any>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        console.log('ON DATA FIRING', subscriptionData);
        if (!subscriptionData) return;

        const {
          conversationUpdated: {conversation: updatedConversation}
        } = subscriptionData;
        const currentlyViewingConversation =
          updatedConversation.id === conversationId;
        if (currentlyViewingConversation) {
          onViewConversation(conversationId, false);
        }
      },
    }
  );

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => {
    // 1. Push conversationId to router query params
    router.push({ query: { conversationId } });

    if (hasSeenLatestMessage) return;
    // 2. Update conversation to have seenLatestMessage = true

    try {
      await markConversationAsRead({
        variables: { userId, conversationId },
        optimisticResponse: { markConversationAsRead: true },
        update: (cache) => {
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });
          if (!participantsFragment) return;

          const participants = [...participantsFragment.participants];
          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id == userId
          );

          if (userParticipantIdx === -1) return;
          const userParticipant = participants[userParticipantIdx];

          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error: any) {
      console.log('onViewConversation error: ', error);
    }
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
