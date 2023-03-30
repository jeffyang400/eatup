import { useMutation } from '@apollo/client';
import { Box, Button, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ConversationPopulated } from '../../../../../backend/src/util/types';
import ConversationItem from './conversation-item';
import ConversationModal from './modal/modal';
import ConversationOperations from '@/graphql/operations/conversation';
import { toast } from 'react-hot-toast';
import { signOut } from 'next-auth/react';

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConversation] = useMutation<{
    deletedConversation: boolean;
    conversationId: string;
  }>(ConversationOperations.Mutations.deleteConversation);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  async function onDeleteConversation(conversationId: string) {
    try {
      toast.promise(
        deleteConversation({
          variables: { conversationId },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === 'string'
                ? process.env.NEXT_PUBLIC_BASE_URL
                : ''
            );
          },
        }),
        {
          loading: 'Deleting Group',
          success: 'Group Deleted',
          error: 'Delete Failed',
        }
      );
    } catch (error) {
      console.log('onDeleteConversation error: ', error);
    }
  }

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

  return (
    <Box width="100%" position="relative" height="100%" overflow="hidden">
      <Box
        py={2}
        px={4}
        mb={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign="center">Create Group</Text>
      </Box>
      <ConversationModal isOpen={isOpen} onClose={onClose} session={session} />
      {sortedConversations.map((conversation) => {
        const participant = conversation.participants.find(
          (p) => p.user.id === userId
        );
        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            conversation={conversation}
            onClick={() => {
              onViewConversation(
                conversation.id,
                participant?.hasSeenLatestMessage
              );
            }}
            isSelected={conversation.id === router.query.conversationId}
            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
            onDeleteConversation={onDeleteConversation}
          />
        );
      })}
      <Box position="absolute" bottom={0} left={0} width="100%" px={8}>
        <Button width="100%" onClick={() => signOut()}>
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

export default ConversationList;
