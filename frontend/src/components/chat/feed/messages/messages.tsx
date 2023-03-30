import {
  MessagesData,
  MessageSubscriptionData,
  MessagesVariables,
} from '@/util/types';
import { Flex, Stack } from '@chakra-ui/layout';
import { useQuery } from '@apollo/client';
import MessageOperations from '../../../../graphql/operations/message';
import { toast } from 'react-hot-toast';
import SkeletonLoader from '@/components/common/skeleton-loader';
import { useEffect } from 'react';
import MessageItem from './message-item';

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  function subscribeToMoreMessages(conversationId: string) {
    return subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData) return prev;

        console.log('subscription data:', subscriptionData);

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
  }

  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(conversationId);

    return () => unsubscribe();
  }, [conversationId]);

  if (error) {
    return null;
  }

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height="60px" />
          <span>Loading Messages</span>
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map((m, idx) => {
            let renderHeader = true;

            if (idx < data.messages.length-1) {
              const prevMsg = data.messages[idx + 1];
              const curDate = new Date(m.createdAt);
              const prevDate = new Date(prevMsg.createdAt);
              if (
                curDate.getTime() - prevDate.getTime() < 6000 &&
                m.sender.id === prevMsg.sender.id
              ) {
                renderHeader = false;
              }
            }

            return (
              <MessageItem
                key={m.id}
                message={m}
                sentByMe={m.sender.id === userId}
                renderHeader={renderHeader}
              />
            );
          })}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
